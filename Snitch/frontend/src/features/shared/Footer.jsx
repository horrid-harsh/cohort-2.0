import React, { useState } from 'react';
import { Link } from 'react-router';
import styles from './Footer.module.scss';

const Footer = () => {
  const [activeSections, setActiveSections] = useState({});

  const toggleSection = (section) => {
    setActiveSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const sections = [
    {
      id: 'shop',
      title: 'SHOP',
      links: [
        { label: 'Shirts', path: '/category/shirts' },
        { label: 'T-Shirts', path: '/category/t-shirts' },
        { label: 'Jeans', path: '/category/jeans' },
        { label: 'Pants', path: '/category/pants' },
        { label: 'Men', path: '/category/men' },
        { label: 'Women', path: '/category/women' },
      ]
    },
    {
      id: 'company',
      title: 'COMPANY',
      links: [
        { label: 'About Us', path: '/about' },
        { label: 'Careers', path: '/careers' },
        { label: 'Blog', path: '/blog' },
        { label: 'Sustainability', path: '/sustainability' },
        { label: 'Press', path: '/press' },
      ]
    },
    {
      id: 'help',
      title: 'HELP',
      links: [
        { label: 'Customer Support', path: '/support' },
        { label: 'Track Order', path: '/track' },
        { label: 'Returns & Refunds', path: '/returns' },
        { label: 'Shipping Policy', path: '/shipping' },
        { label: 'FAQs', path: '/faqs' },
      ]
    }
  ];

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.brandCol}>
          <Link to="/" className={styles.logo}>SNITCH</Link>
          <p>Modern clothing for the modern you. Premium quality, timeless style.</p>
          <div className={styles.socials}>
            <a href="#" aria-label="Instagram"><i className="ri-instagram-line"></i></a>
            <a href="#" aria-label="Facebook"><i className="ri-facebook-fill"></i></a>
            <a href="#" aria-label="Twitter"><i className="ri-twitter-x-line"></i></a>
            <a href="#" aria-label="YouTube"><i className="ri-youtube-line"></i></a>
          </div>
        </div>

        {sections.map(section => (
          <div key={section.id} className={`${styles.linkCol} ${activeSections[section.id] ? styles.active : ''}`}>
            <h3 onClick={() => toggleSection(section.id)}>
              {section.title}
              <i className="ri-arrow-down-s-line"></i>
            </h3>
            <ul className={styles.list}>
              {section.links.map(link => (
                <li key={link.label}>
                  <Link to={link.path}>{link.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div className={styles.newsletterCol}>
          <h3>NEWSLETTER</h3>
          <p>Subscribe to get updates on new arrivals and exclusive offers.</p>
          <form className={styles.form}>
            <input type="email" placeholder="Enter your email" />
            <button type="submit">SUBSCRIBE</button>
          </form>
        </div>
      </div>

      <div className={styles.bottomBar}>
        <div className={styles.bottomContent}>
          <p>© 2024 SNITCH. All rights reserved.</p>
          <div className={styles.legal}>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/terms">Terms & Conditions</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
