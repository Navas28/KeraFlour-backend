import cloudinary from "../config/cloudinary.js";
import streamfier from "streamifier";

export const uploadToCloudinary = (fileBuffer, folder = "KeraFlour") => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: folder },
      (error, result) => {
        if (result) resolve(result);
        else reject(error);
      },
    );
    streamfier.createReadStream(fileBuffer).pipe(stream);
  });
};

export const deleteFromCloudinary = async (publicId) => {
  try {
    return await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    throw error;
  }
};
