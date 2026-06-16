import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(
  file: string,
  folder = "ethiouni"
): Promise<string | null> {
  if (!process.env.CLOUDINARY_CLOUD_NAME) {
    console.warn("Cloudinary not configured");
    return null;
  }

  try {
    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "image",
    });
    return result.secure_url;
  } catch (error) {
    console.error("Cloudinary upload failed:", error);
    return null;
  }
}

export { cloudinary };
