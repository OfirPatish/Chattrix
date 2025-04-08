import axios from "axios";
import { config } from "dotenv";

config();

const IMGBB_API_KEY = process.env.IMGBB_API_KEY;
const IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload";

export const uploadImage = async (base64Image) => {
  try {
    // Remove the data URL prefix if present
    const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

    // Create form data
    const formData = new FormData();
    formData.append("image", base64Data);

    const response = await axios.post(IMGBB_UPLOAD_URL, formData, {
      params: {
        key: IMGBB_API_KEY,
      },
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    if (response.data.success) {
      return {
        secure_url: response.data.data.url,
        deleteUrl: response.data.data.delete_url,
        thumb: response.data.data.thumb?.url || response.data.data.url,
      };
    }

    throw new Error("Failed to upload image to ImgBB");
  } catch (error) {
    console.error("Error uploading image:", error.message);
    throw error;
  }
};
