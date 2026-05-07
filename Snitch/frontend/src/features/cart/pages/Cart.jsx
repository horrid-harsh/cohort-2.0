import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Trash2, Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import CustomDropdown from '../../products/components/CustomDropdown';
import Navbar from '../../shared/Navbar';
import Footer from '../../shared/Footer';
import styles from './Cart.module.scss';
import toast from 'react-hot-toast';

const Cart = () => {
    const navigate = useNavigate();
    const { user } = useSelector((state) => state.auth || {});
    const { 
        cartItems, 
        totalPrice, 
        loading, 
        itemCount,
        handleGetCart, 
        handleRemoveCart,
        handleUpdateCart
    } = useCart();

    const [isRecsOpen, setIsRecsOpen] = useState(true);

    // Fetch latest cart data on mount
    useEffect(() => {
        handleGetCart();
    }, [handleGetCart]);

    const onUpdateQuantity = async (productId, size, newQty) => {
        const res = await handleUpdateCart(productId, size, newQty);
        if (res.success) {
            toast.success("Bag updated");
        } else {
            toast.error(res.message);
        }
    };

    const onUpdateSize = async (productId, currentSize, newSize) => {
        if (currentSize === newSize) return;
        const res = await handleUpdateCart(productId, currentSize, undefined, newSize);
        if (res.success) {
            toast.success("Size updated");
        } else {
            toast.error(res.message);
        }
    };

    const onRemoveItem = async (productId, size) => {
        const res = await handleRemoveCart(productId, size);
        if (res.success) {
            toast.success("Item removed");
        } else {
            toast.error(res.message);
        }
    };

    // Dummy Recommendations
    const recommendations = [
        { id: 'rec1', title: 'OVERSIZED T-SHIRT', price: { amount: 999, currency: 'INR' }, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80' },
        { id: 'rec2', title: 'SLIM FIT JEANS', price: { amount: 2499, currency: 'INR' }, image: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&q=80' },
        { id: 'rec3', title: 'LINEN SHIRT', price: { amount: 1899, currency: 'INR' }, image: 'https://images.unsplash.com/photo-1596755094514-f87034a2612d?w=400&q=80' },
        { id: 'rec4', title: 'CARGO PANTS', price: { amount: 2199, currency: 'INR' }, image: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=400&q=80' },
        { id: 'rec5', title: 'DENIM JACKET', price: { amount: 3499, currency: 'INR' }, image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80' },
    ];

    const popularCategories = [
        { name: "SHIRTS", link: "/shop?category=shirts" },
        { name: "JEANS", link: "/shop?category=jeans" },
        { name: "TROUSERS", link: "/shop?category=trousers" },
        { name: "JACKETS", link: "/shop?category=jackets" },
        { name: "T-SHIRTS", link: "/shop?category=t-shirts" },
        { name: "SHORTS", link: "/shop?category=shorts" },
    ];

    const renderEmptyCart = () => (
        <div className={styles.emptyCartWrapper}>
            <h2>Your shopping cart is empty.</h2>
            <p>Please add something soon, carts have feelings too.</p>

            <div className={styles.categoriesBox}>
                <h3>Popular Categories</h3>
                <div className={styles.categoryTags}>
                    {popularCategories.map((cat, idx) => (
                        <Link key={idx} to={cat.link} className={styles.tag}>
                            {cat.name}
                        </Link>
                    ))}
                </div>
            </div>

            <div className={styles.emptyActions}>
                <button 
                    className={`${styles.actionBtn} ${styles.outline}`}
                    onClick={() => navigate('/shop')}
                >
                    CONTINUE SHOPPING
                </button>
                {!user && (
                    <button 
                        className={`${styles.actionBtn} ${styles.primary}`}
                        onClick={() => navigate('/login')}
                    >
                        LOGIN
                    </button>
                )}
            </div>
        </div>
    );

    return (
        <div className={styles.cartPage}>
            <Navbar />
            
            <div className={styles.pageContainer}>
                {/* ── Progress Indicator ────────────────────────────────── */}
                <div className={styles.progressContainer}>
                    <span className={`${styles.step} ${styles.active}`}>MY BAG</span>
                    <div className={styles.divider}></div>
                    <span className={styles.step}>ADDRESS</span>
                    <div className={styles.divider}></div>
                    <span className={styles.step}>PAYMENT</span>
                </div>

                {!loading && itemCount === 0 ? (
                    renderEmptyCart()
                ) : (
                    <div className={styles.cartLayout}>
                        {/* ── Left Column: Items ────────────────────────────── */}
                        <div className={styles.mainContent}>
                            <div className={styles.cartHeader}>
                                <h2>1/1 ITEM SELECTED <span>({totalPrice.currency} {totalPrice.amount?.toLocaleString()})</span></h2>
                            </div>
                            {/* ... Rest of the cart items ... */}

                        <div className={styles.itemList}>
                            {cartItems.map((item) => (
                                <div key={`${item.product.id}-${item.size}`} className={styles.cartItem}>
                                    <div className={styles.imageWrapper} onClick={() => navigate(`/product/${item.product.id}`)}>
                                        <img src={item.product.images?.[0]?.url} alt={item.product.title} />
                                    </div>

                                    <div className={styles.itemDetails}>
                                        <div className={styles.itemTop}>
                                            <div className={styles.brandInfo}>
                                                <h3 onClick={() => navigate(`/product/${item.product.id}`)}>
                                                    {item.product.title}
                                                </h3>
                                                <p>{item.product.attributes?.category || 'Apparel'}</p>
                                            </div>
                                            <div className={styles.itemPrice}>
                                                <span className={styles.amount}>
                                                    {item.subtotal.currency} {item.subtotal.amount?.toLocaleString()}
                                                </span>
                                                <span className={styles.taxNote}>MRP incl. of all taxes</span>
                                            </div>
                                        </div>

                                        <div className={styles.itemMeta}>
                                            <div className={styles.metaField}>
                                                <label>Size:</label>
                                                <div style={{ width: '80px' }}>
                                                    <CustomDropdown 
                                                        name="size"
                                                        value={item.size}
                                                        options={(Array.isArray(item.product.attributes?.sizes) 
                                                            ? item.product.attributes.sizes 
                                                            : [item.size]).map(s => ({ label: s, value: s }))
                                                        }
                                                        onChange={(e) => onUpdateSize(item.product.id, item.size, e.target.value)}
                                                        variant="compact"
                                                    />
                                                </div>
                                            </div>
                                            <div className={styles.metaField}>
                                                <label>Qty:</label>
                                                <div style={{ width: '80px' }}>
                                                    <CustomDropdown 
                                                        name="quantity"
                                                        value={item.quantity}
                                                        options={[...Array(10)].map((_, i) => ({ label: (i + 1).toString(), value: i + 1 }))}
                                                        onChange={(e) => onUpdateQuantity(item.product.id, item.size, e.target.value)}
                                                        variant="compact"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className={styles.itemActions}>
                                            <button 
                                                className={styles.removeBtn}
                                                onClick={() => onRemoveItem(item.product.id, item.size)}
                                            >
                                                REMOVE
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* ── Recommendations Section ──────────────────────── */}
                        <div className={styles.recommendations}>
                            <button 
                                className={styles.recToggle}
                                onClick={() => setIsRecsOpen(!isRecsOpen)}
                            >
                                YOU MAY ALSO LIKE
                                <ChevronDown className={isRecsOpen ? styles.rotate : ''} />
                            </button>

                            <AnimatePresence>
                                {isRecsOpen && (
                                    <motion.div 
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className={styles.sliderContainer}
                                    >
                                        <div className={styles.sliderTrack}>
                                            {recommendations.map((rec) => (
                                                <div key={rec.id} className={styles.recItem} onClick={() => navigate('/shop')}>
                                                    <div className={styles.recImage}>
                                                        <img src={rec.image} alt={rec.title} />
                                                    </div>
                                                    <div className={styles.recInfo}>
                                                        <h4>{rec.title}</h4>
                                                        <p>{rec.price.currency} {rec.price.amount}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    {/* ── Right Column: Summary ────────────────────────── */}
                    <div className={styles.summaryWrapper}>
                        <div className={styles.stickySummary}>
                            <h3>Billing Details</h3>
                            
                            <div className={styles.summaryRow}>
                                <span>Cart Total (incl. of all taxes)</span>
                                <span>{totalPrice.currency} {totalPrice.amount?.toLocaleString()}</span>
                            </div>
                            
                            <div className={styles.summaryRow}>
                                <span>Shipping Charges</span>
                                <span className={styles.free}>FREE</span>
                            </div>

                            <div className={`${styles.summaryRow} ${styles.total}`}>
                                <span>Total Amount</span>
                                <span>{totalPrice.currency} {totalPrice.amount?.toLocaleString()}</span>
                            </div>

                            <button 
                                className={styles.checkoutBtn}
                                onClick={() => toast.success("Checkout flow coming soon!")}
                            >
                                PLACE ORDER
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>

            <Footer />
        </div>
    );
};

export default Cart;