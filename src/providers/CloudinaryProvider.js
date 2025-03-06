import cloudinary from "cloudinary";
import { env } from "~/config/environment";
import streamifier from "streamifier";

// config cloudinary
const cloudinaryV2 = cloudinary.v2;
cloudinaryV2.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
});

// upload image to cloudinary
const streamUpload = (fileBuffer, folderName) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinaryV2.uploader.upload_stream(
      { folder: folderName },
      (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }
    );
    streamifier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const CloudinaryProvider = {
  streamUpload,
};
