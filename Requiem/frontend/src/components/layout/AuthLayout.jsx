import logo from "../../assets/logo-requiem-auth.png";
import styles from "./AuthLayout.module.scss";

const AuthLayout = ({ children }) => {
  return (
    <div className={styles.layout}>
      <div className={styles.overlay} />
      
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.brand}>
            <img src={logo} alt="Requiem" className={styles.logo} />
          </div>
        </div>
        
        <div className={styles.content}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
