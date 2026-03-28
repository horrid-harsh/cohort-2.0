import { UserModel } from "../models/user.model.js";
import { uploadFile, deleteFile } from "../services/storage.service.js";

/**
 * @description Upload/Update User Avatar
 * @route PATCH /api/v1/users/avatar
 */
export const uploadAvatar = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ 
        success: false, 
        message: "Unauthorized: User not found in request" 
      });
    }

    if (!req.file || !req.file.buffer) {
      return res.status(400).json({ 
        success: false, 
        message: "Please provide an image file" 
      });
    }

    // 🔹 Find user and their old avatar reference
    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: "User not found in database" 
      });
    }

    // 🚀 Attempting upload via service
    const uploadResult = await uploadFile(req.file);

    // 🔹 Clean up old image if it exists
    if (user.avatarFileId) {
      deleteFile(user.avatarFileId).catch(err => console.error("Cleanup Err:", err.message));
    }

    // 🔹 Update database
    user.avatar = uploadResult.url;
    user.avatarUrl = uploadResult.url;      
    user.avatarFileId = uploadResult.fileId; 
    
    await user.save();

    return res.status(200).json({
      success: true,
      message: "Avatar updated successfully",
      data: {
        avatarUrl: user.avatarUrl,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error("Controller Error Trace:", error.message || error);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to process avatar upload"
    });
  }
};

/**
 * @description Delete User Avatar
 * @route DELETE /api/v1/users/avatar
 */
export const deleteAvatar = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized: User not found in request" });
    }

    const user = await UserModel.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found in database" });
    }

    if (!user.avatarFileId) {
      return res.status(400).json({ success: false, message: "No avatar found to delete" });
    }

    await deleteFile(user.avatarFileId);

    user.avatar = "";
    user.avatarUrl = "";
    user.avatarFileId = "";

    await user.save();

    return res.status(200).json({
      success: true,
      message: "Avatar deleted successfully",
    });
  } catch (error) {
    console.error("Delete Avatar Error:", error.message);
    return res.status(500).json({
      success: false,
      message: error.message || "Failed to delete avatar",
    });
  }
};