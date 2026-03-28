import multer from "multer";

// Configure memory storage
const storage = multer.memoryStorage();

// Middleware to handle single file upload (Generic - for Supabase)
export const upload = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit for general uploads
  },
});

// Middleware to handle image-only uploads (Specifically for avatars)
export const imageUpload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit for images
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only images (PNG, JPG, JPEG, WEBP) are allowed."), false);
    }
  },
});
