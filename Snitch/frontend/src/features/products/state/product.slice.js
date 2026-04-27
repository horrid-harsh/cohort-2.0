import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  products: [],         // Latest/New Arrivals
  exploreProducts: [],  // Paginated discovery items
  sellerProducts: [],
  currentProduct: null,
  loading: false,
  error: null,
  explorePagination: {
    page: 1,
    hasNextPage: false,
  },
  listingProducts: [], // For category/search listing pages
  listingPagination: {
    page: 1,
    hasNextPage: false,
    totalProducts: 0,
    totalPages: 0
  }
};

const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.loading = false;
    },
    setExploreProducts: (state, action) => {
      state.exploreProducts = action.payload.products;
      state.explorePagination = action.payload.pagination;
      state.loading = false;
    },
    appendExploreProducts: (state, action) => {
      state.exploreProducts = [...state.exploreProducts, ...action.payload.products];
      state.explorePagination = action.payload.pagination;
      state.loading = false;
    },
    setListingProducts: (state, action) => {
      state.listingProducts = action.payload.products;
      state.listingPagination = action.payload.pagination;
      state.loading = false;
    },
    appendListingProducts: (state, action) => {
      state.listingProducts = [...state.listingProducts, ...action.payload.products];
      state.listingPagination = action.payload.pagination;
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
  setExploreProducts,
  appendExploreProducts,
  setSellerProducts,
  setCurrentProduct,
  setLoading,
  setError,
  addProductToState,
  clearProductError,
  setListingProducts,
  appendListingProducts,
} = productSlice.actions;

export const selectExploreProducts = (state) => state.product.exploreProducts;
export const selectExplorePagination = (state) => state.product.explorePagination;
export const selectListingProducts = (state) => state.product.listingProducts;
export const selectListingPagination = (state) => state.product.listingPagination;
export const selectIsLoading = (state) => state.product.loading;
export const selectProductError = (state) => state.product.error;
export const selectCurrentProduct = (state) => state.product.currentProduct;


export default productSlice.reducer;
