/* 
  - Upload from a specific url
  - Upload one file
  - Upload multiple files
*/

import cloudinary from "@/configs/cloudinary.config";
import envConfig from "@/configs/env.config";
import {
  GetObjectCommand,
  PutObjectCommand,
  s3Client,
} from "@/configs/s3.config";
import { generateRandomString } from "@/utils";
import { getSignedUrl } from "@aws-sdk/cloudfront-signer";
// import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

class UploadService {
  static async uploadImageUrl() {
    const imageUrl =
      "https://down-vn.img.susercontent.com/file/cn-11134207-820l4-mk5hqyc2915084.webp";
    const folderName = "product/shopId";
    const fileName = "testDemo";

    const result = await cloudinary.uploader.upload(imageUrl, {
      folder: folderName,
      public_id: fileName,
    });

    return result;
  }

  static async uploadImage({
    file,
    folderName = "product/shopId",
  }: {
    file: Express.Multer.File;
    folderName?: string;
  }) {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: folderName,
    });

    return {
      shopId: "shopId",
      imageUrl: result.secure_url,
      thumbUrl: await cloudinary.url(result.public_id, {
        width: 100,
        height: 100,
        format: "jpg",
      }),
    };
  }

  static async uploadImages({
    files,
    folderName = "product/shopId",
  }: {
    files: Express.Multer.File[];
    folderName?: string;
  }) {
    if (!files.length) return;

    const uploadedImages = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, {
        folder: folderName,
      });

      uploadedImages.push({
        shopId: "shopId",
        imageUrl: result.secure_url,
        thumbUrl: await cloudinary.url(result.public_id, {
          width: 100,
          height: 100,
          format: "jpg",
        }),
      });
    }

    return uploadedImages;
  }

  static async uploadImageS3(file: Express.Multer.File) {
    const randomImageName = generateRandomString();
    const command = new PutObjectCommand({
      Bucket: envConfig.aws.bucketName,
      Key: randomImageName,
      Body: file.buffer,
      ContentType: "image/jpeg",
    });

    const result = await s3Client.send(command);
    /* // Get S3 signed url
    const commandSignedUrl = new GetObjectCommand({
      Bucket: envConfig.aws.bucketName,
      Key: randomImageName,
    });
    const url = await getSignedUrl(s3Client, commandSignedUrl, {
      expiresIn: 36000,
    }); */
    const url = getSignedUrl({
      url: `${envConfig.aws.cloudfrontDistributionDomain}/${randomImageName}`,
      keyPairId: envConfig.aws.cloudfrontKeyPairId,
      privateKey: envConfig.aws.cloudfrontPrivateKey,
      dateLessThan: new Date(Date.now() + 1000 * 60 * 60 * 24 * 100),
    });

    return {
      url,
      result,
    };
  }
}

export default UploadService;
