import { useSelector, useDispatch } from 'react-redux';
import { useCallback } from 'react';
import * as cartApi from '../service/cart.api';
import { setCart, setLoading, setError } from '../state/cart.slice';

/**
 * Custom hook to manage cart operations
 * Handles both Guest (LocalStorage/GuestId) and Authenticated (UserId) states
 */
export const useCart = () => {
    const dispatch = useDispatch();
    
    // Selectors
    const { cart, guestId, loading, error } = useSelector((state) => state.cart);
    const { user } = useSelector((state) => state.auth || {});

    /**
     * Fetch current cart contents
     */
    const handleGetCart = useCallback(async (page = 1, limit = 10) => {
        dispatch(setLoading());
        try {
            // Send both if available; backend prioritizes UserId but falls back to GuestId
            const params = { page, limit };
            if (guestId) params.guestId = guestId;
            
            const response = await cartApi.getCart(params);
            dispatch(setCart(response.data));
            return response.data;
        } catch (err) {
            const message = err.response?.data?.message || "Failed to load cart";
            dispatch(setError(message));
            throw err;
        }
    }, [dispatch, guestId]);

    /**
     * Add a product to cart
     */
    const handleAddCart = async (productId, size, quantity = 1) => {
        dispatch(setLoading());
        try {
            const data = { productId, size, quantity };
            if (guestId) data.guestId = guestId;

            const response = await cartApi.addToCart(data);
            dispatch(setCart(response.data));
            return { success: true, cart: response.data };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to add item to cart";
            dispatch(setError(message));
            return { success: false, message };
        }
    };

    /**
     * Remove a product from cart completely
     */
    const handleRemoveCart = async (productId, size) => {
        dispatch(setLoading());
        try {
            const data = { productId, size };
            if (guestId) data.guestId = guestId;

            const response = await cartApi.removeFromCart(data);
            dispatch(setCart(response.data));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to remove item";
            dispatch(setError(message));
            return { success: false, message };
        }
    };

    /**
     * Update quantity or size of an item
     */
    const handleUpdateCart = async (productId, size, quantity, newSize) => {
        dispatch(setLoading());
        try {
            const data = { productId, size, quantity, newSize };
            if (guestId) data.guestId = guestId;

            const response = await cartApi.updateCartItem(data);
            dispatch(setCart(response.data));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to update item";
            dispatch(setError(message));
            return { success: false, message };
        }
    };

    /**
     * Merge guest items into user account (Call this after login)
     */
    const handleMergeCart = useCallback(async () => {
        if (!guestId) return;
        
        dispatch(setLoading());
        try {
            const response = await cartApi.mergeCart(guestId);
            dispatch(setCart(response.data));
            return { success: true };
        } catch (err) {
            const message = err.response?.data?.message || "Failed to sync cart";
            dispatch(setError(message));
            return { success: false, message };
        }
    }, [dispatch, guestId]);

    // Derived State
    const cartItems = cart?.items || [];
    const itemCount = cart?.pagination?.totalItems || cartItems.length;
    const totalPrice = cart?.totalPrice || { amount: 0, currency: 'INR' };

    return {
        // State
        cart,
        cartItems,
        itemCount,
        totalPrice,
        loading,
        error,

        // Actions (Renamed per user request)
        handleGetCart,
        handleAddCart,
        handleRemoveCart,
        handleUpdateCart,
        handleMergeCart
    };
};
