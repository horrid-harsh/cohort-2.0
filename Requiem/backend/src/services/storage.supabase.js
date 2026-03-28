import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Upload a file to Supabase Storage
 */
export const uploadToSupabase = async (file) => {
  if (!file) throw new ApiError(400, "No file provided");

  const timestamp = Date.now();
  const fileExtension = file.originalname.split(".").pop();
  const baseName = file.originalname.split(".").slice(0, -1).join(".");
  const uniqueName = `${timestamp}-${baseName}.${fileExtension}`;

  const { data, error } = await supabase.storage
    .from("uploads")
    .upload(uniqueName, file.buffer, {
      contentType: file.mimetype,
      cacheControl: "3600",
      upsert: false,
    });

  if (error) {
    console.error("Supabase storage error:", error);
    throw new ApiError(500, "Upload failed: " + error.message);
  }

  // Generate public URL
  const { data: publicUrlData } = supabase.storage
    .from("uploads")
    .getPublicUrl(uniqueName);

  return publicUrlData.publicUrl;
};

/**
 * Delete a file from Supabase Storage
 */
export const deleteFromSupabase = async (fileUrl) => {
  if (!fileUrl) {
    throw new ApiError(400, "File URL is required");
  }

  const rawFileName = fileUrl.split("/uploads/")[1];

  if (!rawFileName) {
    throw new ApiError(400, "Invalid file URL");
  }

  // ✅ FIX HERE
  const fileName = decodeURIComponent(rawFileName);

  if (fileName.includes("..")) {
    throw new ApiError(400, "Invalid file name");
  }

  const { data, error } = await supabase.storage
    .from("uploads")
    .remove([fileName]);

  if (error) {
    console.error("Supabase deletion error:", {
      fileName,
      error: error.message,
    });
    throw new ApiError(500, "Deletion failed: " + error.message);
  }

  return { fileName };
};
