import api from "../../../lib/axios";

export const createProduct = async (productData) => {
  const formData = new FormData();

  formData.append("title", productData.title);
  formData.append("description", productData.description);
  formData.append("priceAmount", productData.priceAmount);
  formData.append("priceCurrency", productData.priceCurrency || "INR");
  formData.append("category", productData.category);
  formData.append("gender", productData.gender);

  // ✅ Tags: parse comma-separated string into array, send as JSON string
  // Backend Zod schema expects: JSON.parse(val) → string[]
  if (productData.tags) {
    const tagsArray = productData.tags
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);
    formData.append("tags", JSON.stringify(tagsArray));
  } else {
    formData.append("tags", JSON.stringify([]));
  }

  // Images — each file appended individually under the "images" key
  if (productData.images?.length) {
    productData.images.forEach((file) => {
      formData.append("images", file);
    });
  }

  // ✅ Don't set Content-Type manually — axios sets it with the correct boundary
  const response = await api.post("/product", formData);
  return response.data;
};

export const getSellerProducts = async () => {
  const response = await api.get("/product/seller");
  return response.data;
};

export const getAllProducts = async (params = {}) => {
  const response = await api.get("/product", { params });
  return response.data;
};

export const getProductById = async (id) => {
  const response = await api.get(`/product/${id}`);
  return response.data;
};

export const getLatestProducts = async () => {
  const response = await api.get("/product/latest");
  return response.data;
};
