import styles from "./MobileBlock.module.scss";
import logo from "../../assets/requiem-logo-wordmark-v2.png";

const MobileBlock = () => (
  <div className={styles.wrap}>
    <div className={styles.logoContainer}>
      <img src={logo} alt="Requiem" className={styles.logo} />
    </div>
    <p className={styles.message}>
      For the best experience,<br />
      please open Requiem on<br />
      a <strong>desktop browser</strong>.
    </p>
  </div>
);

export default MobileBlock;
