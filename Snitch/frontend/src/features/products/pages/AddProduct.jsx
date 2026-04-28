import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { useProducts } from "../hooks/useProducts";
import styles from "./AddProduct.module.scss";
import CustomDropdown from "../components/CustomDropdown";
import Button from "../../shared/Button";
import { Star, Link as LinkIcon } from "lucide-react";

const MAX_IMAGES = 7;

const AddProduct = () => {
  const navigate = useNavigate();
  const { state } = useLocation();
  const { handleCreateProduct, isLoading, error: apiError } = useProducts();
  const fileInputRef = useRef();
  
  const [previews, setPreviews] = useState([]);
  const [imageError, setImageError] = useState("");
  const [thumbnailIdx, setThumbnailIdx] = useState(0);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    setError,
    formState: { errors },
  } = useForm({
    defaultValues: {
      title: state?.baseProduct?.title || "",
      description: state?.baseProduct?.description || "",
      priceAmount: "",
      priceCurrency: "INR",
      category: state?.baseProduct?.category || "shirts",
      gender: state?.baseProduct?.gender || "men",
      tags: state?.baseProduct?.tags || "",
      images: [],
      groupId: state?.groupId || "",
      color: "",
      sizes: [],
      stock: "50",
    },
  });

  // ✅ Register images field with RHF validation
  register("images", {
    validate: (files) =>
      files.length > 0 || "At least one product image is required",
  });

  const currentImages = watch("images");
  const isVariantMode = !!state?.groupId;

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    if (currentImages.length + files.length > MAX_IMAGES) {
      setImageError(`You can upload a maximum of ${MAX_IMAGES} images.`);
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
    
    if (index === thumbnailIdx) {
      setThumbnailIdx(0);
    } else if (index < thumbnailIdx) {
      setThumbnailIdx(prev => prev - 1);
    }
  };

  const onSubmit = async (data) => {
    try {
      const reorderedImages = [...data.images];
      if (thumbnailIdx > 0 && thumbnailIdx < reorderedImages.length) {
        const [thumb] = reorderedImages.splice(thumbnailIdx, 1);
        reorderedImages.unshift(thumb);
      }
      
      // ✅ Construct attributes and submission data
      const submissionData = {
        ...data,
        images: reorderedImages,
        attributes: JSON.stringify({
          color: data.color || "Default",
          sizes: data.sizes?.length ? data.sizes : ["ONE SIZE"]
        })
      };

      await handleCreateProduct(submissionData);
      navigate("/seller/dashboard");
    } catch (err) {
      const errorData = err?.response?.data || err?.data;
      if (errorData?.errors) {
        Object.entries(errorData.errors).forEach(([field, message]) => {
          setError(field, { type: "server", message });
        });
      }
    }
  };

  const categoryOptions = [
    { label: "Shirts", value: "shirts" },
    { label: "Jeans", value: "jeans" },
    { label: "Trousers", value: "trousers" },
    { label: "Jackets", value: "jackets" },
    { label: "T-Shirts", value: "t-shirts" },
    { label: "Co-ords", value: "co-ords" },
    { label: "Shorts", value: "shorts" },
  ];

  const genderOptions = [
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Kids", value: "kids" },
    { label: "Unisex", value: "unisex" },
  ];

  return (
    <div className={styles.container}>
      <form className={styles.card} onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.header}>
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)} 
            className={styles.backBtn}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            Back
          </Button>
          <h1>{isVariantMode ? "Add Variant" : "Create Product"}</h1>
          {isVariantMode && (
            <div className={styles.variantNotice}>
              <LinkIcon size={14} /> Linking as variant to <strong>{state.baseProduct.title}</strong>
            </div>
          )}
          <p>Fill in the details below to list your item.</p>
        </div>

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
            {errors.title && <span className={styles.fieldError}>{errors.title.message}</span>}
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
            {errors.description && <span className={styles.fieldError}>{errors.description.message}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Color</label>
              <input {...register("color")} type="text" placeholder="e.g. Midnight Blue" />
            </div>
            <div className={styles.formGroup}>
              <label>Sizes Available</label>
              <div className={styles.sizeCheckboxes}>
                {["XS", "S", "M", "L", "XL", "XXL", "XXXL"].map((sizeOption) => (
                  <label key={sizeOption} className={styles.checkboxLabel}>
                    <input
                      type="checkbox"
                      value={sizeOption}
                      {...register("sizes")}
                    />
                    <span>{sizeOption}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className={styles.priceRow}>
            <div className={styles.formGroup}>
              <label>Price (₹)</label>
              <input
                {...register("priceAmount", {
                  required: "Price is required",
                  min: { value: 1, message: "Price must be > 0" },
                })}
                type="number"
                placeholder="0.00"
              />
              {errors.priceAmount && <span className={styles.fieldError}>{errors.priceAmount.message}</span>}
            </div>
            <div className={styles.formGroup}>
              <label>Stock Count</label>
              <input {...register("stock")} type="number" placeholder="50" />
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
                <CustomDropdown {...field} options={categoryOptions} onChange={(e) => field.onChange(e.target.value)} />
              )}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Gender</label>
            <Controller
              name="gender"
              control={control}
              render={({ field }) => (
                <CustomDropdown {...field} options={genderOptions} onChange={(e) => field.onChange(e.target.value)} />
              )}
            />
          </div>

          <div className={styles.formGroup}>
            <label>Tags</label>
            <input {...register("tags")} type="text" placeholder="cotton, slim-fit" />
          </div>

          <div className={styles.formGroup}>
            <label>Images ({currentImages.length}/{MAX_IMAGES})</label>
            <div
              className={styles.imageUploadArea}
              onClick={() => fileInputRef.current.click()}
            >
              <svg fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p>Upload Photos</p>
              <input type="file" ref={fileInputRef} multiple accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />
            </div>

            <div className={styles.imagesScrollContainer}>
              <div className={styles.previewGrid}>
                {previews.map((url, idx) => (
                  <div key={idx} className={`${styles.previewItem} ${thumbnailIdx === idx ? styles.thumbnailActive : ""}`} onClick={() => setThumbnailIdx(idx)}>
                    <img src={url} alt="Preview" />
                    {thumbnailIdx === idx && (
                      <div className={styles.thumbnailBadge}><Star size={10} fill="currentColor" /> THUMBNAIL</div>
                    )}
                    <button type="button" className={styles.removeBtn} onClick={(e) => { e.stopPropagation(); removeImage(idx); }}>×</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className={styles.submitWrapper}>
          <Button type="submit" fullWidth isLoading={isLoading}>
            {isVariantMode ? "Add Variant to Group" : "List Product Now"}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddProduct;
