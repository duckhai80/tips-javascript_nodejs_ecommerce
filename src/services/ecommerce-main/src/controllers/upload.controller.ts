import { BadRequestError, SuccessResponse } from "@/core";
import { UploadService } from "@/services";
import { NextFunction, Request, Response } from "express";

class UploadController {
  uploadImageUrl = async (req: Request, res: Response, next: NextFunction) => {
    return new SuccessResponse({
      message: "Image uploaded from url successfully",
      status: 200,
      metadata: await UploadService.uploadImageUrl(),
    }).send(res);
  };

  uploadImage = async (req: Request, res: Response, next: NextFunction) => {
    const { file } = req;

    if (!file) throw new BadRequestError("File missing");

    return new SuccessResponse({
      message: "Image uploaded successfully",
      status: 200,
      metadata: await UploadService.uploadImage({
        file,
      }),
    }).send(res);
  };

  uploadImages = async (req: Request, res: Response, next: NextFunction) => {
    const { files } = req;

    if (!files || !files.length) throw new BadRequestError("Files missing");

    return new SuccessResponse({
      message: "Images uploaded successfully",
      status: 200,
      metadata: await UploadService.uploadImages({
        files: files as Express.Multer.File[],
      }),
    }).send(res);
  };

  uploadImageS3 = async (req: Request, res: Response, next: NextFunction) => {
    const { file } = req;

    if (!file) throw new BadRequestError("File missing");

    return new SuccessResponse({
      message: "Image uploaded successfully",
      status: 200,
      metadata: await UploadService.uploadImageS3(file),
    }).send(res);
  };
}

export default new UploadController();
