import { createSlice } from "@reduxjs/toolkit";

// Helper to get or create a Guest ID for unauthenticated sessions
const getGuestId = () => {
    let guestId = localStorage.getItem("snitch_guest_id");
    if (!guestId) {
        guestId = crypto.randomUUID();
        localStorage.setItem("snitch_guest_id", guestId);
    }
    return guestId;
};

const initialState = {
    cart: null,           // This will hold the entire cart object from backend
    guestId: getGuestId(), // Persisted in localStorage
    loading: false,
    error: null,
};

const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        // Sync the entire cart from backend response
        setCart: (state, action) => {
            state.cart = action.payload;
            state.loading = false;
            state.error = null;
        },
        
        // Reset cart (on logout)
        clearCart: (state) => {
            state.cart = null;
            state.error = null;
        },

        setLoading: (state) => {
            state.loading = true;
        },

        setError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        }
    }
});

export const { setCart, clearCart, setLoading, setError } = cartSlice.actions;
export default cartSlice.reducer;
