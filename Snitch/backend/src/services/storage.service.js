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
    const res = await client.files.delete(fileId);
    return res;
  } catch (error) {
    console.error("ImageKit Delete Error:", error.message, fileId);
    throw error;
  }
};

export default client;