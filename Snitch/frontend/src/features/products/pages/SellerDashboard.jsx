import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useProducts } from "../hooks/useProducts";
import CustomDropdown from "../components/CustomDropdown";
import Button from "../../shared/Button";
import Navbar from "../../shared/Navbar";
import ConfirmationModal from "../../shared/ConfirmationModal";
import styles from "./SellerDashboard.module.scss";

const ProductActionMenu = ({ product, onEdit, onDelete, onAddVariant }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className={styles.actionMenuWrapper} ref={menuRef}>
      <button
        className={styles.menuTrigger}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Actions"
      >
        <svg viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
        </svg>
      </button>

      {isOpen && (
        <div className={styles.menuDropdown}>
          <Button
            variant="ghost"
            onClick={() => {
              onEdit(product);
              setIsOpen(false);
            }}
          >
            Edit Product
          </Button>
          <Button
            variant="ghost"
            onClick={() => {
              onAddVariant(product);
              setIsOpen(false);
            }}
          >
            Add Variant
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              onDelete(product);
              setIsOpen(false);
            }}
          >
            Delete
          </Button>
        </div>
      )}
    </div>
  );
};

const SellerDashboard = () => {
  const navigate = useNavigate();
  const { 
    handleFetchSellerProducts, 
    handleDeleteProduct,
    sellerProducts, 
    isLoading, 
    error 
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  useEffect(() => {
    handleFetchSellerProducts();
  }, [handleFetchSellerProducts]);

  // Filtering logic
  const filteredProducts = sellerProducts.filter((product) => {
    const matchesSearch = product.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "all" || product.category === selectedCategory;
    const matchesGender =
      selectedGender === "all" || product.gender === selectedGender;
    return matchesSearch && matchesCategory && matchesGender;
  });

  const categoryOptions = [
    { label: "All Categories", value: "all" },
    { label: "Shirts", value: "shirts" },
    { label: "Jeans", value: "jeans" },
    { label: "Trousers", value: "trousers" },
    { label: "Jackets", value: "jackets" },
    { label: "T-Shirts", value: "t-shirts" },
    { label: "Co-ords", value: "co-ords" },
    { label: "Shorts", value: "shorts" },
  ];

  const genderOptions = [
    { label: "All Genders", value: "all" },
    { label: "Men", value: "men" },
    { label: "Women", value: "women" },
    { label: "Unisex", value: "unisex" },
  ];

  const getStatusInfo = (inventory) => {
    if (inventory <= 0) return { label: "Sold Out", class: styles.outOfStock };
    if (inventory < 20) return { label: "Limited", class: styles.limited };
    return { label: "In Stock", class: styles.inStock };
  };

  const handleEdit = (product) => {
    navigate(`/seller/edit-product/${product._id}`);
  };
  
  const handleAddVariant = (product) => {
    navigate("/seller/add-product", { 
      state: { 
        groupId: product.groupId,
        baseProduct: {
          title: product.title,
          description: product.description,
          category: product.category,
          gender: product.gender,
          tags: product.tags?.join(", ") || ""
        }
      } 
    });
  };

  const initiateDelete = (product) => {
    setProductToDelete(product);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (productToDelete) {
      try {
        await handleDeleteProduct(productToDelete._id);
        setIsModalOpen(false);
        setProductToDelete(null);
      } catch (err) {
        console.error("Delete failed:", err);
      }
    }
  };

  return (
    <div className={styles.container}>
      <Navbar 
        variant="seller" 
        dashboardAction={
          <Button variant="primary" onClick={() => navigate("/seller/add-product")}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ width: '18px', marginRight: '8px' }}>
              <line x1="12" y1="5" x2="12" y2="19"></line>
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
            <span>Add<span className={styles.hideMobile}> New Product</span></span>
          </Button>
        }
      />

      <main className={styles.contentBody}>
        <div className={styles.controls}>
          <div className={styles.dashboardMeta}>
            <h1>Showroom Inventory</h1>
            <p>Curating your collection at SNITCH.</p>
          </div>

          <div className={styles.filterBar}>
            <div className={styles.filterLabel}>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <line x1="4" y1="21" x2="4" y2="14" />
                <line x1="4" y1="10" x2="4" y2="3" />
                <line x1="12" y1="21" x2="12" y2="12" />
                <line x1="12" y1="8" x2="12" y2="3" />
                <line x1="20" y1="21" x2="20" y2="16" />
                <line x1="20" y1="12" x2="20" y2="3" />
                <line x1="1" y1="14" x2="7" y2="14" />
                <line x1="9" y1="8" x2="15" y2="8" />
                <line x1="17" y1="16" x2="23" y2="16" />
              </svg>
              FILTER BY:
            </div>
            <div className={styles.dropdowns}>
              <CustomDropdown
                options={categoryOptions}
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              />
              <CustomDropdown
                options={genderOptions}
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
              />
            </div>
          </div>
        </div>

        {error && <div className={styles.error}>{error}</div>}

        <section className={styles.statsGrid}>
          <div className={styles.statCard}>
            <h3>Total Collection</h3>
            <div className={styles.value}>{sellerProducts.length}</div>
          </div>
          <div className={styles.statCard}>
            <h3>Stock Health</h3>
            <div className={styles.value}>
              {sellerProducts.length > 0 ? "Optimal" : "No Data"}
            </div>
          </div>
          <div className={styles.statCard}>
            <h3>Market Status</h3>
            <div className={styles.value}>Live</div>
          </div>
        </section>

        <section className={styles.productSection}>
          {isLoading && sellerProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <p>Fetching your collection...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.emptyState}>
              <h3>No items found.</h3>
              <p>Adjust your curated filters or search to broaden the list.</p>
            </div>
          ) : (
            <div className={styles.productGrid}>
              {filteredProducts.map((product) => {
                const status = getStatusInfo(product.inventory);
                return (
                  <div key={product._id} className={styles.productCard}>
                    <div className={styles.imageWrapper}>
                      {product.images?.[0] ? (
                        <img src={product.images[0].url} alt={product.title} />
                      ) : (
                        <div className={styles.placeholder} />
                      )}
                    </div>

                    <div className={styles.info}>
                      <div className={styles.infoTopRow}>
                        <div className={styles.textGroup}>
                          <span className={styles.category}>
                            {product.category} • {product.gender}
                          </span>
                          <h4 className={styles.title}>{product.title}</h4>
                        </div>
                        <ProductActionMenu
                          product={product}
                          onEdit={handleEdit}
                          onDelete={initiateDelete}
                          onAddVariant={handleAddVariant}
                        />
                      </div>

                      <div className={styles.priceWrapper}>
                        <span className={styles.mainPrice}>
                          ₹{(product.price?.amount || 0).toLocaleString()}
                        </span>
                        {product.price?.currency === "INR" && (
                          <span className={styles.subPrice}>
                            / ${((product.price?.amount || 0) / 83).toFixed(0)}{" "}
                            USD
                          </span>
                        )}
                      </div>

                      <div className={styles.footer}>
                        <div className={`${styles.status} ${status.class}`}>
                          <span className={styles.dot} />
                          {status.label}
                        </div>
                        <div className={styles.units}>
                          {product.inventory || 0} Units
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </main>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Remove Product"
        message={
          <>
            Are you sure you want to remove{" "}
            <span style={{
              fontWeight: 800,
              color: "#b91c1c",
              backgroundColor: "#fef2f2",
              padding: "0.2rem 0.4rem",
              borderRadius: "4px",
              display: "inline-block",
              margin: "0 0.2rem"
            }}>
              '{productToDelete?.title}'
            </span>
            ? This will permanently delete the product and its associated images from our system.
          </>
        }
        onConfirm={confirmDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setProductToDelete(null);
        }}
        confirmText="Delete Product"
        isLoading={isLoading}
      />
    </div>
  );
};

export default SellerDashboard;
