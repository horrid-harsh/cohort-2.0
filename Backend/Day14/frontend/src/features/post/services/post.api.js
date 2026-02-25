import axios from "axios";

export const postApi = axios.create({
  baseURL: "http://localhost:3000/api/posts",
  withCredentials: true,
});

export const getFeedApi = async () => {
  try {
    const response = await postApi.get("/feed");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const getMyPostsApi = async () => {
  try {
    const response = await postApi.get("/");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const createPostApi = async (formData) => {
  try {
    const response = await postApi.post("/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const deletePostApi = async (postId) => {
  try {
    const response = await postApi.delete(`/${postId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const likePostApi = async (postId) => {
  try {
    const response = await postApi.post(`/like/${postId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

export const dislikePostApi = async (postId) => {
  try {
    const response = await postApi.post(`/dislike/${postId}`);
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
