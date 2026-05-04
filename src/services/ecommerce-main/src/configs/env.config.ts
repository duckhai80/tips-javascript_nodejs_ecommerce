import dotenv from "dotenv";

dotenv.config();

type Env = "development" | "production";

const ENV: Env = (process.env.NODE_ENV as Env) || "development";

const getEnvPrefix = (key: string): string => {
  const prefix = ENV === "production" ? "PROD_" : "DEV_";
  const value = process.env[`${prefix}${key}`];

  if (!value) {
    throw new Error(`Missing env: ${prefix}${key}`);
  }

  return value;
};

const envConfig = {
  app: {
    port: Number(getEnvPrefix("APP_PORT")),
  },
  db: {
    host: getEnvPrefix("DB_HOST"),
    port: Number(getEnvPrefix("DB_PORT")),
    name: getEnvPrefix("DB_NAME"),
  },
  auth: {
    token: process.env.AUTH_TOKEN || "",
    apiKey: process.env.X_API_KEY || "",
    clientId: process.env.X_CLIENT_ID || "",
  },
  discord: {
    botToken: process.env.DISCORD_BOT_TOKEN || "",
    channelId: process.env.DISCORD_CHANNEL_ID || "",
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME || "",
    apiKey: process.env.CLOUDINARY_API_KEY || "",
    apiSecret: process.env.CLOUDINARY_API_SECRET || "",
  },
  aws: {
    region: process.env.AWS_REGION || "",
    bucketName: process.env.AWS_BUCKET_NAME || "",
    bucketAccessKey: process.env.AWS_BUCKET_ACCESS_KEY || "",
    bucketSecretKey: process.env.AWS_BUCKET_SECRET_KEY || "",
  },
};

export default envConfig;
