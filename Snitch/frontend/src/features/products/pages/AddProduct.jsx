import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useProducts } from "../hooks/useProducts";
import styles from "./AddProduct.module.scss";
import CustomDropdown from "../components/CustomDropdown";

const MAX_IMAGES = 7;

const AddProduct = () => {
  const navigate = useNavigate();
  const { handleCreateProduct, isLoading, error: apiError } = useProducts();
  const fileInputRef = useRef();
  const [previews, setPreviews] = useState([]);
  const [imageError, setImageError] = useState("");

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: "",
      description: "",
      priceAmount: "",
      priceCurrency: "INR",
      category: "shirts",
      gender: "unisex",
      tags: "",
      images: [],
    },
  });

  // ✅ Register images field with RHF validation
  register("images", {
    validate: (files) =>
      files.length > 0 || "At least one product image is required",
  });

  const currentImages = watch("images");

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    // ✅ UI error instead of alert()
    if (currentImages.length + files.length > MAX_IMAGES) {
      setImageError(`You can upload a maximum of ${MAX_IMAGES} images.`);
      // Reset input so same file can be re-selected after removing
      e.target.value = "";
      return;
    }

    setImageError("");
    const updatedImages = [...currentImages, ...files];
    setValue("images", updatedImages, { shouldValidate: true });

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews((prev) => [...prev, ...newPreviews]);
    e.target.value = "";
  };

  const removeImage = (index) => {
    const updatedImages = currentImages.filter((_, i) => i !== index);
    setValue("images", updatedImages, { shouldValidate: true });

    URL.revokeObjectURL(previews[index]);
    setPreviews((prev) => prev.filter((_, i) => i !== index));
    setImageError("");
  };

  const onSubmit = async (data) => {
    await handleCreateProduct(data);
    navigate("/seller/dashboard");
  };

  const categoryOptions = [
    { label: "Shirts", value: "shirts" },
    { label: "Jeans", value: "jeans" },
    { label: "Trousers", value: "trousers" },
    { label: "Jackets", value: "jackets" },
    { label: "T-Shirts", value: "t-shirts" },
    { label: "Co-ords", value: "co-ords" },
    { label: "Shorts", value: "shorts" },
    { label: "Accessories", value: "accessories" },
  ];

  const genderOptions = [
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Unisex", value: "unisex" },
  ];

  const currencyOptions = [
    { label: "INR", value: "INR" },
    { label: "USD", value: "USD" },
  ];

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.header}>
          <h1>Create Product</h1>
          <p>Fill in the details below to list your new item.</p>
        </div>

        {/* Server-level error banner */}
        {apiError && <div className={styles.error}>{apiError}</div>}

        {/* ── Left column ─────────────────────────────────────────────── */}
        <div className={styles.leftCol}>
          <div className={styles.formGroup}>
            <label>Product Title</label>
            <input
              {...register("title", {
                required: "Product name is required",
                minLength: { value: 3, message: "Title is too short" },
              })}
              type="text"
              placeholder="e.g. Vintage Denim Jacket"
            />
            {errors.title && (
              <span className={styles.fieldError}>{errors.title.message}</span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Description</label>
            <textarea
              {...register("description", {
                required: "Tell us about this product",
                minLength: { value: 10, message: "Description is too short" },
              })}
              placeholder="Tell us about the fabric, fit, and style..."
            />
            {errors.description && (
              <span className={styles.fieldError}>
                {errors.description.message}
              </span>
            )}
          </div>

          <div className={styles.formGroup}>
            <label>Tags <span style={{ fontWeight: 400, color: '#888' }}>(comma separated)</span></label>
            <input
              {...register("tags")}
              type="text"
              placeholder="e.g. cotton, slim-fit, summer"
            />
          </div>

          <div className={styles.priceRow}>
            <div className={styles.formGroup}>
              <label>Price</label>
              <input
                {...register("priceAmount", {
                  required: "Price is required",
                  min: { value: 1, message: "Price must be greater than 0" },
                })}
                type="number"
                placeholder="0.00"
                min="0"
              />
              {errors.priceAmount && (
                <span className={styles.fieldError}>
                  {errors.priceAmount.message}
                </span>
              )}
            </div>

            <div className={styles.formGroup}>
              <label>Currency</label>
              <Controller
                name="priceCurrency"
                control={control}
                render={({ field }) => (
                  <CustomDropdown
                    {...field}
                    options={currencyOptions}
                    onChange={(e) => field.onChange(e.target.value)}
                  />
                )}
              />
            </div>
          </div>
        </div>

        {/* ── Right column ─────────────────────────────────────────────── */}
        <div className={styles.rightCol}>
          <div className={styles.formGroup}>
            <label>Category</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  {...field}
                  options={categoryOptions}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <CustomDropdown
                  {...field}
                  options={genderOptions}
                  onChange={(e) => field.onChange(e.target.value)}
                />
              )}
            />
          </div>

          <div className={styles.formGroup}>
            <label>
              Product Images{" "}
              <span style={{ fontWeight: 400, color: "#888" }}>
                ({currentImages.length}/{MAX_IMAGES})
              </span>
            </label>

            <div
              className={styles.imageUploadArea}
              onClick={() => fileInputRef.current.click()}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === "Enter" && fileInputRef.current.click()}
              aria-label="Upload product images"
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              <p>Click to upload product photos</p>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </div>

            {/* ✅ UI error for image limit / missing images */}
            {(imageError || errors.images) && (
              <span className={styles.fieldError}>
                {imageError || errors.images?.message}
              </span>
            )}

            <div className={styles.previewGrid}>
              {previews.map((url, idx) => (
                <div key={idx} className={styles.previewItem}>
                  <img src={url} alt={`Preview ${idx + 1}`} />
                  <button
                    type="button"
                    className={styles.removeBtn}
                    onClick={() => removeImage(idx)}
                    aria-label={`Remove image ${idx + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
          disabled={isLoading}
        >
          {isLoading ? "Uploading Product..." : "List Product Now"}
        </button>
      </form>
    </div>
  );
};

export default AddProduct;
