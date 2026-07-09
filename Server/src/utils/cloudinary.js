import {v2 as cloudinary} from "cloudinary";
import fs from "fs";
import { ApiError } from "./ApiError";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET
})

const uploadOnCloudinary = async(localFilepath)=>{
    try {
        if(!localFilepath){
            throw new ApiError(404,"local file path not found")
        }

         const response= await cloudinary.uploader.upload(
            localFilepath,{
                resource_type: "auto",
                folder: "lumix/avatars"
            }
        )

        fs.unlinkSync(localFilepath)
    } catch (error) {
      if(localFilepath && fs.existsSync(localFilepath)){
        fs.unlinkSync(localFilepath);
      }
    }
}

export {uploadOnCloudinary};