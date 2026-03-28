import { supabase } from "../config/supabase.js";
import { ApiError } from "../utils/ApiError.js";

/**
 * Upload a file to Supabase Storage
 * @param {Object} file - The file object from multer (req.file)
 * @returns {Promise<Object>} - Object containing url and fileName (used as ID)
 */
export const uploadFile = async (file) => {
  if (!file) throw new ApiError(400, "No file provided");

  const timestamp = Date.now();
  const fileExtension = file.originalname.split(".").pop();
  const baseName = file.originalname.split(".").slice(0, -1).join(".");
  const uniqueName = `upload-${timestamp}-${baseName}.${fileExtension}`;

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

  return {
    url: publicUrlData.publicUrl,
    fileId: uniqueName, // Using the filename as the ID for consistency
  };
};

/**
 * Delete a file from Supabase Storage
 * @param {string} fileRef - Can be a full URL or just the fileName
 */
export const deleteFile = async (fileRef) => {
  if (!fileRef) return;

  let fileName = fileRef;

  // If a full URL is provided, extract the filename
  if (fileRef.includes("/uploads/")) {
    const rawFileName = fileRef.split("/uploads/")[1];
    if (rawFileName) {
      fileName = decodeURIComponent(rawFileName);
    }
  }

  if (fileName.includes("..")) {
    throw new ApiError(400, "Invalid file name");
  }

  const { error } = await supabase.storage
    .from("uploads")
    .remove([fileName]);

  if (error) {
    console.warn("Supabase deletion warning:", {
      fileName,
      error: error.message,
    });
    // We don't necessarily want to crash the whole operation if a file delete fails
  }

  return { fileName };
};
