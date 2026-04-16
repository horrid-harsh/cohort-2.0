import React from 'react'
import { Link } from 'react-router'
import styles from './AuthLayout.module.scss'

/**
 * AuthLayout — shared two-panel layout for Register & Login pages.
 * Left: form panel | Right: editorial image panel
 *
 * Props:
 *  - imageUrl: string  (URL for the right panel background image)
 *  - quote: { label, heading } (editorial text overlay on image)
 *  - children: React.ReactNode (the form content)
 */
const AuthLayout = ({ imageUrl, quote, children }) => {
  return (
    <div className={styles.layout}>

      {/* ── Left: Form Panel ── */}
      <div className={styles.formPanel}>
        <header className={styles.header}>
          <Link to="/" className={styles.brand}>SNITCH</Link>
        </header>

        <main className={styles.formContent}>
          {children}
        </main>

        <footer className={styles.footer}>
          <span>© 2026 Snitch Atelier</span>
          <div className={styles.footerLinks}>
            <Link to="/privacy">Privacy</Link>
            <Link to="/terms">Terms</Link>
          </div>
        </footer>
      </div>

      {/* ── Right: Editorial Image Panel ── */}
      <div
        className={styles.imagePanel}
        style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : 'none' }}
      >
        <div className={styles.imagePanelInner}>
          {quote && (
            <div className={styles.quote}>
              <span className={styles.quoteLabel}>{quote.label}</span>
              <h2 className={styles.quoteHeading}>{quote.heading}</h2>
            </div>
          )}
        </div>
      </div>

    </div>
  )
}

export default AuthLayout
