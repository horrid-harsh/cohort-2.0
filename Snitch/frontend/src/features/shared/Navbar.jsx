import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useSelector } from 'react-redux';
import { selectUser, selectIsAuthenticated } from '../auth/state/auth.slice';
import { useAuth } from '../auth/hooks/useAuth';
import styles from './Navbar.module.scss';
import Button from './Button';

const Navbar = ({ variant = 'default', dashboardAction }) => {
  const user = useSelector(selectUser);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Focus navigation on gender-based categories
  const genderCategories = [
    { name: "Men", path: "/shop?gender=men" },
    { name: "Women", path: "/shop?gender=women" },
    { name: "Kids", path: "/shop?gender=kids" },
    { name: "Unisex", path: "/shop?gender=unisex" },
  ];

  // Specific product categories (primarily for sidebar/discovery)
  const productCategories = [
    { name: "Shirts", path: "/shop?category=shirts" },
    { name: "T-Shirts", path: "/shop?category=t-shirts" },
    { name: "Jeans", path: "/shop?category=jeans" },
    { name: "Trousers", path: "/shop?category=trousers" },
    { name: "Jackets", path: "/shop?category=jackets" },
    { name: "Co-ords", path: "/shop?category=co-ords" },
    { name: "Accessories", path: "/shop?category=accessories" },
    { name: "Shorts", path: "/shop?category=shorts" },
  ];

  // Combined for sidebar
  const allCategories = [...genderCategories, ...productCategories];

  return (
    <>
      {/* ── Sidebar Drawer ─────────────────────────────────────────── */}
      <div className={`${styles.sidebarOverlay} ${isSidebarOpen ? styles.active : ''}`} onClick={() => setIsSidebarOpen(false)}></div>
      <aside className={`${styles.sidebar} ${isSidebarOpen ? styles.open : ''}`}>
        <div className={styles.sidebarHeader}>
          <div className={styles.sidebarUser}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <circle cx="12" cy="8" r="5" />
              <path d="M20 21a8 8 0 1 0-16 0" />
            </svg>
            <span>{isAuthenticated ? user?.name?.split(' ')[0] : 'Sign In'}</span>
          </div>
          <button className={styles.closeSidebar} onClick={() => setIsSidebarOpen(false)}>&times;</button>
        </div>

        <div className={styles.sidebarContent}>
          <div className={styles.sidebarSection}>
            <h3>Trending</h3>
            <Link to="/new-arrivals" onClick={() => setIsSidebarOpen(false)}>New Arrivals</Link>
            <Link to="/bestsellers" onClick={() => setIsSidebarOpen(false)}>Bestsellers</Link>
          </div>

          <div className={styles.sidebarSection}>
            <h3>Shop By Category</h3>
            {allCategories.map((cat) => (
              <Link key={cat.name} to={cat.path} onClick={() => setIsSidebarOpen(false)}>
                {cat.name}
              </Link>
            ))}
          </div>

          <div className={styles.sidebarSection}>
            <h3>Help & Settings</h3>
            <Link to="/profile" onClick={() => setIsSidebarOpen(false)}>Your Account</Link>
            <Link to="/support" onClick={() => setIsSidebarOpen(false)}>Customer Service</Link>
            {isAuthenticated && (
              <button onClick={handleLogout} className={styles.sideLogout}>Sign Out</button>
            )}
          </div>
        </div>
      </aside>

      {/* ── Main Navbar ───────────────────────────────────────────── */}
      <nav className={styles.navbar}>
        <div className={styles.mainHeader}>
          <div className={styles.leftGroup}>
            <button 
              className={styles.burgerMenu} 
              aria-label="Open Menu"
              onClick={() => setIsSidebarOpen(true)}
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="3" y1="12" x2="21" y2="12"></line>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <line x1="3" y1="18" x2="21" y2="18"></line>
              </svg>
            </button>
            <Link to="/" className={styles.logo}>SNITCH</Link>
          </div>
          
          {/* Search bar is persistent for both default and seller modes as per user request */}
          <div className={styles.searchBar}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
            <input 
              type="text" 
              placeholder={variant === 'seller' ? "Search inventory, titles, references..." : "Search for shirts, jeans, t-shirts..."} 
            />
          </div>

          <div className={styles.userActions}>
            {variant === 'seller' ? (
              <div className={styles.dashboardActionWrapper}>
                {dashboardAction}
              </div>
            ) : (
              <>
                {isAuthenticated ? (
                  <div 
                    className={styles.userProfile}
                    onMouseEnter={() => setIsDropdownOpen(true)}
                    onMouseLeave={() => setIsDropdownOpen(false)}
                  >
                    <div className={styles.userTrigger}>
                      <span className={styles.greeting}>Account</span>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={isDropdownOpen ? styles.rotated : ''}>
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>

                    {isDropdownOpen && (
                      <div className={styles.dropdown}>
                        <div className={styles.dropdownHeader}>Your Account</div>
                        {user?.role === 'seller' && (
                          <Link to="/seller/dashboard" className={styles.dropdownItem}>Seller Dashboard</Link>
                        )}
                        <Link to="/orders" className={styles.dropdownItem}>My Orders</Link>
                        <Link to="/profile" className={styles.dropdownItem}>Profile Settings</Link>
                        <div className={styles.divider}></div>
                        <button onClick={handleLogout} className={styles.logoutBtn}>Sign Out</button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link to="/login" className={styles.loginLink}>Login</Link>
                )}
                
                <div className={styles.cartIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z"></path>
                    <line x1="3" y1="6" x2="21" y2="6"></line>
                    <path d="M16 10a4 4 0 0 1-8 0"></path>
                  </svg>
                  <span className={styles.badge}>0</span>
                </div>
              </>
            )}
          </div>
        </div>

        {variant === 'default' && (
          <div className={styles.secondaryHeader}>
            <div className={styles.categoryNav}>
              <span className={styles.shopByLabel}>Shop By</span>
              <ul className={styles.categoryList}>
                {genderCategories.map(cat => (
                  <li key={cat.name}><Link to={cat.path}>{cat.name}</Link></li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
