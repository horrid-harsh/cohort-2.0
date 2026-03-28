import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";
import { uploadToSupabase, deleteFromSupabase } from "../services/storage.supabase.js";

/**
 * Handle File Deletion from Supabase
 * DELETE /api/v1/upload
 */
export const deleteFile = asyncHandler(async (req, res) => {
  const { fileUrl } = req.body;

  if (!fileUrl) {
    throw new ApiError(400, "fileUrl is required in request body");
  }

  const result = await deleteFromSupabase(fileUrl);

  return res.status(200).json(
    new ApiResponse(200, result, "File deleted successfully")
  );
});

/**
 * Handle Single File Upload to Supabase
 * POST /api/v1/upload
 */
export const uploadFile = asyncHandler(async (req, res) => {
  // Check if file exists (provided by multer)
  const file = req.file;

  if (!file) {
    throw new ApiError(400, "Please upload a file with field name 'file'");
  }

  // Upload to Supabase Storage Bucket "uploads"
  const publicUrl = await uploadToSupabase(file);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        message: "File uploaded",
        url: publicUrl,
      },
      "File uploaded successfully"
    )
  );
});
