import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { 
  createProduct, 
  getSellerProducts, 
  getLatestProducts, 
  getExploreProducts,
  getAllProducts
} from "../services/product.api";
import {
  setProducts,
  setExploreProducts,
  appendExploreProducts,
  setSellerProducts,
  setLoading,
  setError,
  addProductToState,
  clearProductError,
  selectExploreProducts,
  selectExplorePagination,
  setListingProducts,
  appendListingProducts,
  selectListingProducts,
  selectListingPagination,
} from "../state/product.slice";

export const useProducts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { products, sellerProducts, loading, error } = useSelector(
    (state) => state.product
  );
  const exploreProducts = useSelector(selectExploreProducts);
  const explorePagination = useSelector(selectExplorePagination);
  const listingProducts = useSelector(selectListingProducts);
  const listingPagination = useSelector(selectListingPagination);

  // ─── Create product ────────────────────────────────────────────────
  const handleCreateProduct = async (productData) => {
    dispatch(setLoading(true));
    dispatch(clearProductError());
    try {
      const response = await createProduct(productData);
      dispatch(addProductToState(response.data));
      toast.success("Product listed successfully!");
      return response;
    } catch (err) {
      // ✅ Preserve full error object so callers can access err.errors for RHF
      const errMsg =
        err?.message || err?.data?.message || "Failed to create product";
      dispatch(setError(errMsg));
      toast.error(errMsg);
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
      toast.error(errMsg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ─── Fetch latest products for homepage ────────────────────────────
  const handleFetchLatestProducts = useCallback(async () => {
    dispatch(setLoading(true));
    dispatch(clearProductError());
    try {
      const response = await getLatestProducts();
      dispatch(setProducts(response.data));
      return response.data;
    } catch (err) {
      const errMsg = err?.message || err?.data?.message || "Failed to fetch latest products";
      dispatch(setError(errMsg));
      toast.error(errMsg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ─── Fetch paginated explore products ──────────────────────────────
  const handleFetchExploreProducts = useCallback(async (page = 1, isInitial = false) => {
    if (isInitial) dispatch(setLoading(true));
    dispatch(clearProductError());
    try {
      const response = await getExploreProducts(page, 8);
      if (isInitial) {
        dispatch(setExploreProducts(response.data));
      } else {
        dispatch(appendExploreProducts(response.data));
      }
      return response.data;
    } catch (err) {
      const errMsg = err?.message || err?.data?.message || "Failed to fetch explore products";
      dispatch(setError(errMsg));
      toast.error(errMsg);
      throw err;
    } finally {
      if (isInitial) dispatch(setLoading(false));
    }
  }, [dispatch]);

  // ─── Fetch filtered listing products ──────────────────────────────
  const handleFetchListingProducts = useCallback(async (params = {}, isInitial = false) => {
    if (isInitial) dispatch(setLoading(true));
    dispatch(clearProductError());
    try {
      const response = await getAllProducts(params);
      if (isInitial) {
        dispatch(setListingProducts(response.data));
      } else {
        dispatch(appendListingProducts(response.data));
      }
      return response.data;
    } catch (err) {
      const errMsg = err?.message || err?.data?.message || "Failed to fetch products";
      dispatch(setError(errMsg));
      toast.error(errMsg);
      throw err;
    } finally {
      if (isInitial) dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    handleCreateProduct,
    handleFetchSellerProducts,
    handleFetchLatestProducts,
    handleFetchExploreProducts,
    handleFetchListingProducts,
    products,
    sellerProducts,
    exploreProducts,
    explorePagination,
    listingProducts,
    listingPagination,
    isLoading: loading,
    error,
  };
};
