import { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { 
  createProduct, 
  getSellerProducts, 
  getLatestProducts, 
  getExploreProducts,
  getAllProducts,
  getProductById,
  deleteProduct
} from "../services/product.api";
import {
  setProducts,
  setExploreProducts,
  appendExploreProducts,
  setSellerProducts,
  setLoading,
  setError,
  addProductToState,
  removeProductFromState,
  clearProductError,
  selectExploreProducts,
  selectExplorePagination,
  setListingProducts,
  appendListingProducts,
  selectListingProducts,
  selectListingPagination,
  setCurrentProduct,
  selectCurrentProduct,
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
  const currentProduct = useSelector(selectCurrentProduct);

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
      const status = err?.response?.status || err?.status;
      const errorData = err?.response?.data || err?.data;
      const errMsg = errorData?.message || err?.message || "Failed to create product";
      
      // Only show global toast/error if it's NOT a validation error (422)
      if (status !== 422) {
        dispatch(setError(errMsg));
        toast.error(errMsg);
      }
      
      throw err;
    } finally {
      // ✅ Always reset loading — even on failure
      dispatch(setLoading(false));
    }
  };

  // ─── Delete product ────────────────────────────────────────────────
  const handleDeleteProduct = async (id) => {
    dispatch(setLoading(true));
    try {
      await deleteProduct(id);
      dispatch(removeProductFromState(id));
      toast.success("Product removed from inventory.");
    } catch (err) {
      const errMsg = err?.response?.data?.message || err?.message || "Failed to delete product";
      toast.error(errMsg);
      throw err;
    } finally {
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

  // ─── Fetch single product by ID ─────────────────────────────────────
  const handleFetchProductById = useCallback(async (id) => {
    dispatch(setLoading(true));
    dispatch(clearProductError());
    try {
      const response = await getProductById(id);
      dispatch(setCurrentProduct(response.data));
      return response.data;
    } catch (err) {
      const errMsg = err?.message || err?.data?.message || "Failed to fetch product details";
      dispatch(setError(errMsg));
      toast.error(errMsg);
      throw err;
    } finally {
      dispatch(setLoading(false));
    }
  }, [dispatch]);

  return {
    handleCreateProduct,
    handleDeleteProduct,
    handleFetchSellerProducts,
    handleFetchLatestProducts,
    handleFetchExploreProducts,
    handleFetchListingProducts,
    handleFetchProductById,
    products,
    sellerProducts,
    exploreProducts,
    explorePagination,
    listingProducts,
    listingPagination,
    currentProduct,
    isLoading: loading,
    error,
  };
};
