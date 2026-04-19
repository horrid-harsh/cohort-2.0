import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createProduct, getSellerProducts } from "../services/product.api";
import {
  setSellerProducts,
  setLoading,
  setError,
  addProductToState,
  clearProductError,
} from "../state/product.slice";

export const useProducts = () => {
  const dispatch = useDispatch();
  const { products, sellerProducts, loading, error } = useSelector(
    (state) => state.product
  );

  // ─── Create product ────────────────────────────────────────────────
  const handleCreateProduct = async (productData) => {
    dispatch(setLoading(true));
    dispatch(clearProductError());
    try {
      const response = await createProduct(productData);
      dispatch(addProductToState(response.data));
      return response;
    } catch (err) {
      // ✅ Preserve full error object so callers can access err.errors for RHF
      const errMsg =
        err?.message || err?.data?.message || "Failed to create product";
      dispatch(setError(errMsg));
      throw err; // re-throw so page-level catch can handle navigation guard
    } finally {
      // ✅ Always reset loading — even on failure
      dispatch(setLoading(false));
    }
  };

  // ─── Fetch seller's own products ───────────────────────────────────
  const handleFetchSellerProducts = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(clearProductError());
    try {
      const response = await getSellerProducts();
      dispatch(setSellerProducts(response.data));
      return response.data;
    } catch (err) {
      const errMsg =
        err?.message || err?.data?.message || "Failed to fetch products";
      dispatch(setError(errMsg));
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    handleCreateProduct,
    handleFetchSellerProducts,
    products,
    sellerProducts,
    isLoading: loading,
    error,
  };
};
