import { AuthFailureError, BadRequestError, ForbiddenError } from "@/core";
import { shopModel } from "@/models";
import { KeyStore } from "@/models/key-store.model";
import { createTokenPair, getInfoData, JWTAuthPayload } from "@/utils";
import bcrypt from "bcrypt";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import KeyStoreService from "./key-store.service";
import ShopService from "./shop.service";

const RoleShop = {
  SHOP: "SHOP",
  WRITER: "WRITER",
  EDITOR: "EDITOR",
  ADMIN: "ADMIN",
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const privateKey = fs.readFileSync(
  path.join(__dirname, "../../certs/jwt/private.pem"),
  "utf8",
);
const publicKey = fs.readFileSync(
  path.join(__dirname, "../../certs/jwt/public.pem"),
  "utf8",
);

class AccessService {
  handleRefreshToken = async (
    keyStore: KeyStore,
    shop: JWTAuthPayload,
    refreshToken: string,
  ) => {
    const { shopId, email } = shop;

    if (keyStore.refreshTokensUsed.includes(refreshToken)) {
      await KeyStoreService.deleteByShopID(shopId);
      throw new ForbiddenError("Something went wrong! Please login again!");
    }

    if (keyStore.refreshToken !== refreshToken) {
      throw new AuthFailureError("Invalid refresh token!");
    }

    const foundShop = await ShopService.findOneByEmail(email);

    if (!foundShop) throw new AuthFailureError("Shop not registered");

    // Generate token pair
    const tokens = await createTokenPair(
      { shopId, email },
      keyStore.privateKey,
      keyStore.publicKey,
    );

    // Update key store
    await KeyStoreService.updateRefreshToken(
      refreshToken,
      tokens?.refreshToken!,
    );

    return { shop, tokens };
  };

  login = async ({
    email,
    password,
    refreshToken = null,
  }: {
    email: string;
    password: string;
    refreshToken?: string | null;
  }) => {
    // Check email exists
    const foundShop = await ShopService.findOneByEmail(email);

    if (!foundShop) {
      throw new BadRequestError("Shop not registered!");
    }

    // Check password
    const match = await bcrypt.compare(password, foundShop.password);

    if (!match) {
      throw new BadRequestError("Invalid credentials!");
    }

    // Create token pair
    const tokens = await createTokenPair(
      { shopId: foundShop._id.toString(), email },
      privateKey,
      publicKey,
    );

    // Save token
    await KeyStoreService.createKeyStore({
      shopId: foundShop._id.toString(),
      privateKey,
      publicKey,
      refreshToken: tokens?.refreshToken,
    });

    // Get data
    return {
      shop: getInfoData({
        object: foundShop,
        fields: ["_id", "email"],
      }),
      tokens,
    };
  };

  signup = async ({
    name,
    email,
    password,
  }: {
    name: string;
    email: string;
    password: string;
  }) => {
    const holder = await shopModel.findOne({ email: email }).lean();

    if (holder) {
      throw new BadRequestError("Shop already registered!");
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newShop = await shopModel.create({
      name,
      email,
      password: hashedPassword,
      roles: [RoleShop.SHOP],
    });

    if (newShop) {
      // const privateKey = crypto.randomBytes(64).toString("hex");
      // const publicKey = crypto.randomBytes(64).toString("hex");

      const tokenKeys = await KeyStoreService.createKeyStore({
        shopId: newShop._id.toString(),
        privateKey,
        publicKey,
      });

      if (!tokenKeys) {
        throw new BadRequestError("Public key string errors!");
      }

      // Create token pair
      const tokens = await createTokenPair(
        { shopId: newShop._id.toString(), email },
        privateKey,
        publicKey,
      );

      return {
        shop: getInfoData({
          object: newShop,
          fields: ["_id", "email", "name"],
        }),
        tokens,
      };
    }

    return {
      code: 200,
      metadata: null,
    };
  };

  logout = async (keyStore: KeyStore) => {
    return await KeyStoreService.deleteById(keyStore._id);
  };
}

export default new AccessService();
