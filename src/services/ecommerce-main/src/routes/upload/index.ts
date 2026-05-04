import { uploadDisk, uploadMemory } from "@/configs/multer.config";
import { uploadController } from "@/controllers";
import {
  catchAsync,
  checkAuthentication,
  checkPermission,
} from "@/middlewares";
import express from "express";

const uploadRouter = express.Router();

// Check authentication
uploadRouter.use(checkPermission("0000"));
uploadRouter.use(checkAuthentication);

uploadRouter.post("/image-url", catchAsync(uploadController.uploadImageUrl));
uploadRouter.post(
  "/image",
  uploadDisk.single("file"),
  catchAsync(uploadController.uploadImage),
);
uploadRouter.post(
  "/images",
  uploadDisk.array("files", 3),
  catchAsync(uploadController.uploadImages),
);

uploadRouter.post(
  "/image-s3",
  uploadMemory.single("file"),
  catchAsync(uploadController.uploadImageS3),
);

export default uploadRouter;
