import React from 'react';
import { Link } from "react-router";
import Navbar from "../../shared/Navbar";
import Footer from "../../shared/Footer";
import Button from "../../shared/Button";
import styles from "./Home.module.scss";
import heroImg from "../../../assets/hero-model.png"

const Home = () => {
  // Cinematic editorial image that commands attention
  const HERO_IMG = heroImg;
  const CAT_NEW = "https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=800&auto=format&fit=crop";
  const CAT_WOMEN = "https://images.unsplash.com/photo-1541099649105-364718cd7e33?q=80&w=800&auto=format&fit=crop";
  const CAT_JEANS = "https://images.unsplash.com/photo-1541099649105-df39338f4aae?q=80&w=600&auto=format&fit=crop";
  const CAT_SHIRTS = "https://images.unsplash.com/photo-1596755094514-f87034a7a241?q=80&w=600&auto=format&fit=crop";

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
          <div className={styles.largeTile}>
            <img src={CAT_NEW} alt="New Arrivals" />
            <div className={styles.tileContent}>
              <h2>NEW ARRIVALS</h2>
              <Link to="/new-arrivals">SHOP NOW</Link>
            </div>
          </div>

          <div className={styles.midTile}>
            <img src={CAT_WOMEN} alt="Women's Collection" />
            <div className={styles.tileContent}>
              <h2>WOMEN</h2>
              <Link to="/category/women">EXPLORE</Link>
            </div>
          </div>

          <div className={styles.sideCol}>
            <div className={styles.smallTile}>
              <img src={CAT_JEANS} alt="Jeans Collection" />
              <div className={styles.tileContent}>
                <h2>JEANS</h2>
                <Link to="/category/jeans">BROWSE</Link>
              </div>
            </div>
            <div className={styles.smallTile}>
              <img src={CAT_SHIRTS} alt="Shirts Collection" />
              <div className={styles.tileContent}>
                <h2>SHIRTS</h2>
                <Link to="/category/shirts">VIEW ALL</Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── Trending Section ───────────────────────────────────────── */}
        <section className={styles.trendingSection}>
          <div className={styles.sectionHeader}>
            <h2>TRENDING NOW</h2>
            <Link to="/trending" className={styles.viewAll}>VIEW ALL</Link>
          </div>

          <div className={styles.productCarousel}>
            {/* Placeholder Trending Products */}
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className={styles.productCard}>
                <div className={styles.imgWrapper}>
                  <img src={`https://images.unsplash.com/photo-1591047139829-d91aec16adcd?q=80&w=400&auto=format&fit=crop`} alt="Product" />
                </div>
                <h3>Classic Wool Overcoat</h3>
                <div className={styles.priceRow}>
                  <span className={styles.price}>₹4,999</span>
                  <span className={styles.oldPrice}>₹7,999</span>
                </div>
              </div>
            ))}
          </div>
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
