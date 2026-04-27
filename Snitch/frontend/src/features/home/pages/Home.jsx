import React, { useEffect } from 'react';
import { Link } from "react-router";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import Button from "../../shared/Button";
import styles from "./Home.module.scss";
import { useProducts } from "../../products/hooks/useProducts";
import Loader from "../../shared/Loader";

const Home = () => {
  const HERO_IMG = "https://i.pinimg.com/736x/e9/f1/9c/e9f19c0f6c24ed2572f2ec64e61e5983.jpg";
  const CAT_NEW = "https://i.pinimg.com/1200x/f4/3e/d7/f43ed7595252d9e72a10cbc9d72c0042.jpg";
  const CAT_WOMEN = "https://i.pinimg.com/736x/5f/15/80/5f15804b8229ee779eecc4a702a35d15.jpg";
  const CAT_JEANS = "https://i.pinimg.com/736x/b9/43/b2/b943b29e659dee93a0096f1093d71de2.jpg";
  const CAT_SHIRTS = "https://i.pinimg.com/736x/94/a0/aa/94a0aa3fcbee318796ccf5db2e585174.jpg";
  const { 
    handleFetchExploreProducts, 
    exploreProducts, 
    explorePagination, 
    isLoading 
  } = useProducts();

  useEffect(() => {
    // Only fetch if we don't have products yet (prevents re-fetching top 8 skip on mount)
    if (exploreProducts.length === 0) {
      handleFetchExploreProducts(1, true);
    }
  }, [handleFetchExploreProducts, exploreProducts.length]);

  const handleLoadMore = () => {
    if (explorePagination.hasNextPage) {
      handleFetchExploreProducts(explorePagination.page + 1, false);
    }
  };

  return (
    <div className={styles.home}>
      <Navbar />

      <main>
        {/* ── Hero Section ───────────────────────────────────────────── */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroContent}>
              <h1>The Curated<br />Atelier</h1>
              <p>Experience the intersection of architectural precision and timeless fashion. Hand-picked pieces for the modern aesthetic.</p>
              <Button variant="primary" className={styles.heroBtn}>SHOP COLLECTION</Button>
            </div>
            
            <div className={styles.heroImageWrapper}>
              <div className={styles.heroImageContainer}>
                <img src={HERO_IMG} alt="Premium Fashion Collection" />
              </div>
            </div>
          </div>
        </section>

        {/* ── Category Grid ──────────────────────────────────────────── */}
        <section className={styles.categoryGrid}>
          <Link to="/new-arrivals" className={styles.largeTile}>
            <img src={CAT_NEW} alt="New Arrivals" />
            <div className={styles.tileContent}>
              <h2>NEW ARRIVALS</h2>
              <span className={styles.tileLink}>SHOP NOW</span>
            </div>
          </Link>

          <Link to="/shop?gender=women" className={styles.midTile}>
            <img src={CAT_WOMEN} alt="Women's Collection" />
            <div className={styles.tileContent}>
              <h2>WOMEN</h2>
              <span className={styles.tileLink}>EXPLORE</span>
            </div>
          </Link>

          <div className={styles.sideCol}>
            <Link to="/shop?category=jeans" className={styles.smallTile}>
              <img src={CAT_JEANS} alt="Jeans Collection" />
              <div className={styles.tileContent}>
                <h2>JEANS</h2>
                <span className={styles.tileLink}>BROWSE</span>
              </div>
            </Link>
            <Link to="/shop?category=shirts" className={styles.smallTile}>
              <img src={CAT_SHIRTS} alt="Shirts Collection" />
              <div className={styles.tileContent}>
                <h2>SHIRTS</h2>
                <span className={styles.tileLink}>VIEW ALL</span>
              </div>
            </Link>
          </div>
        </section>

        {/* ── Explore More Section ───────────────────────────────────── */}
        <section className={styles.trendingSection}>
          <div className={styles.sectionHeader}>
            <h2>EXPLORE MORE</h2>
            <p className={styles.sectionSubtitle}>Discover pieces that define the modern wardrobe.</p>
          </div>

          {isLoading && exploreProducts.length === 0 ? (
            <div className={styles.loaderContainer}>
              <Loader text="Curating collection..." />
            </div>
          ) : exploreProducts.length > 0 ? (
            <>
              <div className={styles.productGrid}>
                {exploreProducts.map((product) => (
                  <Link to={`/product/${product._id}`} key={product._id} className={styles.productCard}>
                    <div className={styles.imgWrapper}>
                      <img src={product.images[0]?.url} alt={product.title} />
                    </div>
                    <h3>{product.title}</h3>
                    <div className={styles.priceRow}>
                      <span className={styles.price}>₹{product.price.amount.toLocaleString()}</span>
                      {product.price.oldAmount && (
                        <span className={styles.oldPrice}>₹{product.price.oldAmount.toLocaleString()}</span>
                      )}
                    </div>
                  </Link>
                ))}
              </div>

              {explorePagination.hasNextPage && (
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
            <div className={styles.noProducts}>
              <p>Check back soon for more arrivals.</p>
            </div>
          )}
        </section>

        {/* ── Feature Bar ───────────────────────────────────────────── */}
        <section className={styles.featureBar}>
          <div className={styles.feature}>
            <span className={styles.icon}>🚚</span>
            <div className={styles.text}>
              <strong>Free Shipping</strong>
              <p>On all orders above ₹999</p>
            </div>
          </div>
          <div className={styles.feature}>
            <span className={styles.icon}>🔄</span>
            <div className={styles.text}>
              <strong>Easy Returns</strong>
              <p>30-day hassle-free return policy</p>
            </div>
          </div>
          <div className={styles.feature}>
            <span className={styles.icon}>💎</span>
            <div className={styles.text}>
              <strong>Premium Quality</strong>
              <p>Hand-picked luxury fabrics</p>
            </div>
          </div>
          <div className={styles.feature}>
            <span className={styles.icon}>🛡️</span>
            <div className={styles.text}>
              <strong>Secure Payment</strong>
              <p>100% encrypted checkout</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Home;
