import replayAttackController from "@/controllers/replay-attack.controller";
import { catchAsync, checkApiKey, pushLogDiscord } from "@/middlewares";
import express from "express";
import accessRouter from "./access";
import cartRouter from "./cart";
import checkoutRouter from "./checkout";
import commentRouter from "./comment";
import discountRouter from "./discount";
import inventoryRouter from "./inventory";
import notificationRouter from "./notification";
import productRouter from "./product";
import uploadRouter from "./upload";

const router = express.Router();

router.get(
  "/v1/api/test-replay-attack",
  catchAsync(replayAttackController.testReplayAttack),
);

// Check api key
router.use(catchAsync(checkApiKey));

// Add log to discord
router.use(pushLogDiscord);

router.get("/", (req, res, next) => {
  return res.status(200).json({
    message: "Hello world!",
  });
});

router.use("/v1/api/products", productRouter);
router.use("/v1/api/discounts", discountRouter);
router.use("/v1/api/carts", cartRouter);
router.use("/v1/api/checkouts", checkoutRouter);
router.use("/v1/api/inventories", inventoryRouter);
router.use("/v1/api/comments", commentRouter);
router.use("/v1/api/notifications", notificationRouter);
router.use("/v1/api/uploads", uploadRouter);
router.use("/v1/api", accessRouter);

export default router;
