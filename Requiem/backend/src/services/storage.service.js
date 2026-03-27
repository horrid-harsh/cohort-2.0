import ImageKit, { toFile } from "@imagekit/nodejs";

const client = new ImageKit({
  publicKey: (process.env.IMAGEKIT_PUBLIC_KEY || "").trim(),
  privateKey: (process.env.IMAGEKIT_PRIVATE_KEY || "").trim(),
});

/**
 * Upload buffer to ImageKit
 * @param {Buffer} buffer - File buffer
 * @param {string} fileName - Destination file name
 */
export const uploadFile = async ({ buffer, fileName }) => {
  try {
    const response = await client.files.upload({
      file: await toFile(buffer, "file.jpg"), 
      fileName: fileName,
      folder: "cohort-2-requiem",
    });

    return {
      url: response.url,
      fileId: response.fileId,
    };
  } catch (error) {
    console.error("ImageKit Upload Error:", error.message || error);
    throw error;
  }
};

/**
 * Delete file from ImageKit
 * @param {string} fileId - ImageKit file ID
 */
export const deleteFile = async (fileId) => {
  try {
    if (!fileId) return;
    await client.files.delete(fileId);
  } catch (error) {
    console.warn("ImageKit Delete Warning:", error.message);
  }
};
