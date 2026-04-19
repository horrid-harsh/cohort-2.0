import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],
  sellerProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    setSellerProducts: (state, action) => {
      state.sellerProducts = action.payload;
      state.loading = false;
    },
    setCurrentProduct: (state, action) => {
      state.currentProduct = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    addProductToState: (state, action) => {
      state.products = [action.payload, ...state.products];
      state.sellerProducts = [action.payload, ...state.sellerProducts];
    },
    clearProductError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setProducts,
  setSellerProducts,
  setCurrentProduct,
  setLoading,
  setError,
  addProductToState,
  clearProductError,
} = productSlice.actions;

export default productSlice.reducer;
