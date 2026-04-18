import ImageKit from '@imagekit/nodejs';
import config from '../config/config.js';

const client = new ImageKit({
  publicKey: config.IMAGEKIT_PUBLIC_KEY,
  privateKey: config.IMAGEKIT_PRIVATE_KEY,
  urlEndpoint: config.IMAGEKIT_URL_ENDPOINT,
});

export const uploadFile = async (fileBuffer, fileName, folder = "snitch") => {
  try {
    const result = await client.files.upload({
      file: await ImageKit.toFile(fileBuffer),
      fileName,
      folder
    });
    return result;
  } catch (error) {
    throw error;
  }
};

export const deleteFile = async (fileId) => {
  try {
    return await client.deleteFile(fileId);
  } catch (error) {
    console.error("ImageKit Delete Error:", error.message);
    // Don't throw here, as this is usually called during rollbacks
  }
};

export default client;