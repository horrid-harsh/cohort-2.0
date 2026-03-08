const ImageKit = require("@imagekit/nodejs");

const client = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
});

async function uploadFile({ buffer, fileName, folder = "" }) {
  try {
    const file = await client.files.upload({
      file: await ImageKit.toFile(Buffer.from(buffer)),
      fileName: fileName,
      folder,
    });
    return file;
  } catch (error) {
    console.error("Error uploading to ImageKit:", error);
    throw error;
  }
}

async function deleteFile(fileId) {
  try {
    if (!fileId) return;
    await client.files.delete(fileId);
  } catch (error) {
    console.error("Error deleting from ImageKit:", error);
    // We might not want to throw here so that database record is still cleaned up,
    // or we might want to throw to keep them synced. Usually sync is better.
    throw error;
  }
}

module.exports = { uploadFile, deleteFile };
