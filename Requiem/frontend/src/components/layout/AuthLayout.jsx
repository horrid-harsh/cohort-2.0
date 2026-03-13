import { Link } from "react-router-dom";
import styles from "./AuthLayout.module.scss";

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.left}>
        <div className={styles.logo}>
          re<span>quiem</span>
        </div>
        <div className={styles.formWrap}>{children}</div>
      </div>

      <div className={styles.right}>
        <img
          src="/auth-visual.webp"
          alt="Requiem visual"
          className={styles.image}
        />
        <div className={styles.scrim} />
        <div className={styles.textOverlay}>
          <h2>Your second brain.</h2>
          <p>Save anything from the web. Requiem organizes, connects and resurfaces it — automatically.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
