import axiosInstance from "../../../lib/axios";

/**
 * @desc    Add item to cart (Supports Guest & Authenticated)
 * @param   {Object} cartData - { productId, size, quantity, guestId? }
 * @returns {Promise<Object>} - The updated cart
 */
export const addToCart = async (cartData) => {
    const response = await axiosInstance.post('/cart/add', cartData);
    return response.data;
};

/**
 * @desc    Update quantity of an item in cart
 * @param   {Object} cartData - { productId, size, quantity, guestId? }
 * @returns {Promise<Object>} - The updated cart
 */
export const updateCartItem = async (cartData) => {
    const response = await axiosInstance.patch('/cart/update', cartData);
    return response.data;
};

/**
 * @desc    Remove an item from cart completely
 * @param   {Object} cartData - { productId, size, guestId? }
 * @returns {Promise<Object>} - The updated cart
 */
export const removeFromCart = async (cartData) => {
    const response = await axiosInstance.delete('/cart/remove', { data: cartData });
    return response.data;
};

/**
 * @desc    Merge guest cart into user account cart on login
 * @param   {string} guestId - The guestId from localStorage
 * @returns {Promise<Object>} - The merged user cart
 */
export const mergeCart = async (guestId) => {
    const response = await axiosInstance.post('/cart/merge', { guestId });
    return response.data;
};

/**
 * @desc    Fetch user's current cart (Guest or Authenticated)
 * @param   {Object} params - { guestId?, page?, limit? }
 * @returns {Promise<Object>} - The user's cart with pagination metadata
 */
export const getCart = async (params = {}) => {
    const response = await axiosInstance.get('/cart', { params });
    return response.data;
};