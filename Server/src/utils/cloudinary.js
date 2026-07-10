import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) {
      console.log("No local file path received");
      return null;
    }

    console.log("Uploading to Cloudinary:", localFilePath);

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "lumix/avatars",
    });

    console.log("Cloudinary upload successful");
    console.log("Cloudinary public_id:", response.public_id);
    console.log("Cloudinary secure_url:", response.secure_url);

    // Delete temporary local file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
      console.log("Temporary local file deleted");
    }

    // IMPORTANT: return full Cloudinary response
    return response;
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    // Delete temp file even if upload fails
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return null;
  }
};

export { uploadOnCloudinary };