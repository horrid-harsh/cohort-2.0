import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router";
import { useProducts } from "../hooks/useProducts";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import styles from "./ProductDetails.module.scss";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const ProductDetails = () => {
  const { productId } = useParams();
  const { handleFetchProductById, currentProduct, isLoading, error } = useProducts();
  
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState("M");
  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
    if (productId) {
      handleFetchProductById(productId);
    }
  }, [productId, handleFetchProductById]);

  // Reset active image when product changes
  useEffect(() => {
    setActiveImageIdx(0);
  }, [currentProduct]);

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
  const sizes = ["S", "M", "L", "XL"];

  const handlePrev = () => {
    setActiveImageIdx((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveImageIdx((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const toggleAccordion = (id) => {
    setOpenAccordion(openAccordion === id ? null : id);
  };

  return (
    <div className={styles.productPage}>
      <Navbar />
      <div className={styles.pageContainer}>
        {/* Breadcrumbs */}
        <nav className={styles.breadcrumbs}>
          <Link to="/">HOME</Link> / <Link to="/shop">COLLECTIONS</Link> / <span>{currentProduct.title?.toUpperCase()}</span>
        </nav>

        <div className={styles.productLayout}>
          {/* Left: Thumbnails */}
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

          {/* Center: Main Image */}
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

          {/* Right: Info */}
          <div className={styles.infoColumn}>
            <div className={styles.stickyContent}>
              <p className={styles.editionTag}>EDITION 01</p>
              <h1 className={styles.title}>{currentProduct.title}</h1>
              <p className={styles.price}>
                {currentProduct.price?.currency} {currentProduct.price?.amount?.toLocaleString()}
              </p>

              <div className={styles.divider}></div>

              <p className={styles.description}>{currentProduct.description}</p>

              <div className={styles.sizeSelector}>
                <p className={styles.sectionLabel}>SELECT SIZE</p>
                <div className={styles.sizeGrid}>
                  {sizes.map((size) => (
                    <button
                      key={size}
                      className={`${styles.sizeBtn} ${selectedSize === size ? styles.activeSize : ""}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))}
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
                        <p>100% Pure Linen. Dry clean only. Iron at medium temperature.</p>
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
                        <p>Free standard shipping on orders over INR 2,000. Returns accepted within 15 days.</p>
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
