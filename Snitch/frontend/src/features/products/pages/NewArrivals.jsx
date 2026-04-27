import React, { useEffect } from 'react';
import { Link } from 'react-router';
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import styles from "./NewArrivals.module.scss";
import { useProducts } from '../hooks/useProducts';
import Loader from "../../shared/Loader";

const NewArrivals = () => {
  const { handleFetchLatestProducts, products, isLoading } = useProducts();

  useEffect(() => {
    // Only fetch if we don't have products yet (prevents re-fetching on mount)
    if (products.length === 0) {
      handleFetchLatestProducts();
    }
  }, [handleFetchLatestProducts, products.length]);

  return (
    <div className={styles.container}>
      <Navbar />
      
      <main className={styles.main}>
        <header className={styles.header}>
          <h1>New Arrivals</h1>
          <p>The latest 8 pieces to join our curated collection.</p>
        </header>

        {isLoading ? (
          <div className={styles.loader}>
            <Loader text="Loading the latest..." />
          </div>
        ) : products.length > 0 ? (
          <div className={styles.productGrid}>
            {products.map((product) => (
              <Link to={`/product/${product._id}`} key={product._id} className={styles.productCard}>
                <div className={styles.imgWrapper}>
                  <img src={product.images[0]?.url} alt={product.title} />
                </div>
                <div className={styles.info}>
                  <h3>{product.title}</h3>
                  <p className={styles.price}>₹{product.price.amount.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className={styles.empty}>
            <p>Our latest collection is currently in transit. Check back soon.</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default NewArrivals;
