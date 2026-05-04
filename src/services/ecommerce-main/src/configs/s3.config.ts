import {
  DeleteObjectCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import envConfig from "./env.config";

const s3Client = new S3Client({
  region: envConfig.aws.region,
  credentials: {
    accessKeyId: envConfig.aws.bucketAccessKey,
    secretAccessKey: envConfig.aws.bucketSecretKey,
  },
});

export { DeleteObjectCommand, GetObjectCommand, PutObjectCommand, s3Client };
