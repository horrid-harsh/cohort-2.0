import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router";
import { useProducts } from "../hooks/useProducts";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import styles from "./ProductDetails.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const ProductDetails = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { handleFetchProductById, currentProduct, isLoading, error } = useProducts();
  
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [openAccordion, setOpenAccordion] = useState(null);
  const [selectedSize, setSelectedSize] = useState("");

  useEffect(() => {
    if (productId) {
      handleFetchProductById(productId);
    }
  }, [productId, handleFetchProductById]);

  useEffect(() => {
    setActiveImageIdx(0);
  }, [currentProduct]);

  const currentAttributes = currentProduct?.attributes || {};
  const availableSizes = Array.isArray(currentAttributes.sizes) 
    ? currentAttributes.sizes 
    : (currentAttributes.size ? [currentAttributes.size] : []);

  // Set default selected size when sizes load
  useEffect(() => {
    if (availableSizes.length > 0 && !selectedSize) {
      setSelectedSize(availableSizes[0]);
    }
  }, [availableSizes, selectedSize]);

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loader}></div>
      </div>
    );
  }

  if (error || !currentProduct) {
    return (
      <div className={styles.errorContainer}>
        <h2>Oops!</h2>
        <p>{error || "Product not found."}</p>
        <Link to="/shop" className={styles.backBtn}>Back to Shop</Link>
      </div>
    );
  }

  const images = currentProduct.images || [];
  
  // Combine current product and variants into one list
  const allVariants = [
    { 
      _id: currentProduct._id, 
      attributes: currentProduct.attributes || {}, 
      price: currentProduct.price,
      images: currentProduct.images 
    },
    ...(currentProduct.variants || [])
  ].map(v => ({
    ...v,
    attributes: v.attributes || {}
  }));

  // 1. Logic for "VARIANTS" images: 
  // We want to show unique products in the group as images (max 6).
  // The user wants to see EVERY variant as an image.
  const displayVariants = allVariants.slice(0, 6);

  // 2. Logic for "SELECT SIZE":
  // We read the sizes array directly from the current product's attributes.
  // We use local state to track the user's selected size.

  const handlePrev = () => {
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  const handleVariantSwitch = (targetId) => {
    if (targetId !== currentProduct._id) {
      navigate(`/product/${targetId}`);
    }
  };

  return (
    <div className={styles.productPage}>
      <Navbar />
      <div className={styles.pageContainer}>
        <nav className={styles.breadcrumbs}>
          <Link to="/">HOME</Link> / <Link to="/shop">COLLECTIONS</Link> / <span>{currentProduct.title?.toUpperCase()}</span>
        </nav>

        <div className={styles.productLayout}>
          <div className={styles.thumbnailColumn}>
            {images.map((img, idx) => (
              <div 
                key={idx} 
                className={`${styles.thumbnail} ${activeImageIdx === idx ? styles.activeThumb : ""}`}
                onClick={() => setActiveImageIdx(idx)}
              >
                <img src={img.url} alt={`Thumbnail ${idx}`} />
              </div>
            ))}
          </div>

          <div className={styles.mainImageColumn}>
            <div className={styles.imageViewer}>
              <AnimatePresence mode="wait">
                <motion.img
                  key={activeImageIdx}
                  src={images[activeImageIdx]?.url}
                  alt={currentProduct.title}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              
              <button className={`${styles.navBtn} ${styles.prev}`} onClick={handlePrev}>
                <ChevronLeft />
              </button>
              <button className={`${styles.navBtn} ${styles.next}`} onClick={handleNext}>
                <ChevronRight />
              </button>
            </div>
          </div>

          <div className={styles.infoColumn}>
            <div className={styles.stickyContent}>
              <p className={styles.editionTag}>EDITION 01</p>
              <h1 className={styles.title}>{currentProduct.title}</h1>
              <p className={styles.price}>
                {currentProduct.price?.currency} {currentProduct.price?.amount?.toLocaleString()}
              </p>

              <div className={styles.divider}></div>

              <p className={styles.description}>{currentProduct.description}</p>

              {/* Variants Section (Images) */}
              {displayVariants.length > 1 && (
                <div className={styles.variantSelector}>
                  <p className={styles.sectionLabel}>VARIANTS</p>
                  <div className={styles.colorGrid}>
                    {displayVariants.map((v) => (
                      <button
                        key={v._id}
                        className={`${styles.colorBtn} ${currentProduct._id === v._id || (v.attributes.color && v.attributes.color === currentAttributes.color) ? styles.activeColor : ""}`}
                        onClick={() => handleVariantSwitch(v._id)}
                      >
                        <img src={v.images?.[0]?.url} alt="Variant" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              <div className={styles.sizeSelector}>
                <p className={styles.sectionLabel}>SELECT SIZE</p>
                <div className={styles.sizeGrid}>
                  {availableSizes.length > 0 ? (
                    availableSizes.map((sizeOption) => (
                      <button
                        key={sizeOption}
                        className={`${styles.sizeBtn} ${selectedSize === sizeOption ? styles.activeSize : ""}`}
                        onClick={() => setSelectedSize(sizeOption)}
                      >
                        {sizeOption}
                      </button>
                    ))
                  ) : (
                    <button className={`${styles.sizeBtn} ${styles.activeSize}`} disabled>
                      ONE SIZE
                    </button>
                  )}
                </div>
              </div>

              <div className={styles.actions}>
                <button className={styles.addToCart}>ADD TO CART</button>
                <button className={styles.buyNow}>BUY NOW</button>
              </div>

              <div className={styles.accordions}>
                <div className={styles.accordionItem}>
                  <button onClick={() => toggleAccordion("composition")}>
                    COMPOSITION & CARE <ChevronDown className={openAccordion === "composition" ? styles.rotate : ""} />
                  </button>
                  <AnimatePresence>
                    {openAccordion === "composition" && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={styles.accordionContent}
                      >
                        <p>100% Cotton / Premium Blend. Machine wash cold. Tumble dry low.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className={styles.accordionItem}>
                  <button onClick={() => toggleAccordion("shipping")}>
                    SHIPPING & RETURNS <ChevronDown className={openAccordion === "shipping" ? styles.rotate : ""} />
                  </button>
                  <AnimatePresence>
                    {openAccordion === "shipping" && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className={styles.accordionContent}
                      >
                        <p>Standard delivery in 3-5 business days. Free returns within 7 days.</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ProductDetails;
