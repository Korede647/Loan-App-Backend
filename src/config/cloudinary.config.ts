import { v2 as cloudinary } from "cloudinary";
import multer, { FileFilterCallback } from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { Request } from "express";
import dotenv from "dotenv";

dotenv.config();

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_CLOUD_API_KEY,
  api_secret: process.env.CLOUDINARY_CLOUD_API_SECRET,
});

// Configure Cloudinary Storage for Profile Images
const profileImageStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: async (req: Request, file: Express.Multer.File) => {
    const timestamp = Date.now();
    const fileName = file.originalname.split(".")[0];

    return {
      folder: "elearning", // Cloudinary folder for profile images
      public_id: `${fileName}-${timestamp}`,
      resource_type: "image", // Enforce image type uploads
    };
  },
});

// Multer Configuration for Profile Image Uploads
const uploadProfileImage = multer({
  storage: profileImageStorage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit to 5MB
  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
    // (error: Error | null, acceptFile: boolean) => void
  ) => {
    const allowedImageTypes = /image\/(jpeg|png|jpg)/;

    if (!allowedImageTypes.test(file.mimetype)) {
        cb (new Error("Only image, JPG, JPEG, PNG files are allowed"));
      } else {
        cb(null, true);
      }
  },
});

// Export the Multer Middleware
export const uploadToCloudinaryProfileImage =
  uploadProfileImage.single("profileImage"); // Allow only one image at a time