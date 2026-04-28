import React, { useEffect, useMemo } from 'react';
import { useParams, useSearchParams } from 'react-router';
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import Button from "../../shared/Button";
import styles from "./ProductListing.module.scss";
import { useProducts } from '../hooks/useProducts';
import Loader from "../../shared/Loader";
import CustomDropdown from '../components/CustomDropdown';
import { Link } from 'react-router';

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const genderId = searchParams.get('gender');
  const categoryId = searchParams.get('category');
  const searchQuery = searchParams.get('q');

  const [selectedCategory, setSelectedCategory] = React.useState(categoryId || "all");

  const { 
    handleFetchListingProducts, 
    listingProducts, 
    listingPagination, 
    isLoading 
  } = useProducts();

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

  // Determine title and active filters based on URL
  const { title, subtitle } = useMemo(() => {
    if (searchQuery) return { title: `Search: ${searchQuery}`, subtitle: `Found ${listingPagination.totalProducts || 0} pieces` };
    if (genderId && categoryId) return { title: `${genderId}'s ${categoryId}`, subtitle: `Refined collection for ${genderId}` };
    if (genderId) return { title: genderId, subtitle: `Premium styles for ${genderId}` };
    if (categoryId) return { title: categoryId, subtitle: `Curated collection of ${categoryId}` };
    return { title: "The Collection", subtitle: "Architecture meets fashion in every piece." };
  }, [categoryId, genderId, searchQuery, listingPagination.totalProducts]);

  // Sync internal dropdown state with URL
  useEffect(() => {
    setSelectedCategory(categoryId || "all");
  }, [categoryId]);

  useEffect(() => {
    const params = {};
    if (genderId) params.gender = genderId;
    if (searchQuery) params.search = searchQuery;
    if (categoryId) params.category = categoryId;

    handleFetchListingProducts(params, true);
  }, [categoryId, genderId, searchQuery, handleFetchListingProducts]);

  const handleCategoryChange = (e) => {
    const newCategory = e.target.value;
    const newParams = new URLSearchParams(searchParams);
    
    if (newCategory === "all") {
      newParams.delete("category");
    } else {
      newParams.set("category", newCategory);
    }
    
    setSearchParams(newParams);
  };

  const handleLoadMore = () => {
    if (listingPagination.hasNextPage) {
      const params = { page: listingPagination.page + 1 };
      if (categoryId) params.category = categoryId;
      if (genderId) params.gender = genderId;
      if (searchQuery) params.search = searchQuery;
      
      handleFetchListingProducts(params, false);
    }
  };

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <h1>{title}</h1>
            <p>{subtitle}</p>
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
            <CustomDropdown
              options={categoryOptions}
              value={selectedCategory}
              onChange={handleCategoryChange}
            />
          </div>
        </header>

        {isLoading && listingProducts.length === 0 ? (
          <div className={styles.loader}>
            <Loader text="Curating collection..." />
          </div>
        ) : listingProducts.length > 0 ? (
          <>
            <div className={styles.productGrid}>
              {listingProducts.map((product) => (
                <Link to={`/product/${product._id}`} key={product._id} className={styles.productCard}>
                  <div className={styles.imgWrapper}>
                    <img src={product.images[0]?.url} alt={product.title} />
                  </div>
                  <div className={styles.info}>
                    <h3>{product.title}</h3>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>₹{product.price.amount.toLocaleString()}</span>
                      {product.price.oldAmount && (
                        <span className={styles.oldPrice}>₹{product.price.oldAmount.toLocaleString()}</span>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {listingPagination.hasNextPage && (
              <div className={styles.loadMoreContainer}>
                <Button 
                  variant="outline" 
                  onClick={handleLoadMore}
                  isLoading={isLoading}
                >
                  VIEW MORE
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className={styles.empty}>
            <h2>No pieces found</h2>
            <p>We couldn't find any products matching your selection. Check back soon for new arrivals.</p>
            <Link to="/" className={styles.backHome}>Back to Home</Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default ProductListing;
