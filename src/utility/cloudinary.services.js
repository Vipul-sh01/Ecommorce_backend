import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudnary = async (localPath) => {
    try{
        if(!localPath) return null;
        const responce = await cloudinary.uploader.upload(localPath, {
            resource_type: "auto",
        });
        fs.unlinkSync(localPath);
        return responce;
    }
    catch{
        fs.unlinkSync(localPath);
        null;
    }
};

export { uploadOnCloudnary };