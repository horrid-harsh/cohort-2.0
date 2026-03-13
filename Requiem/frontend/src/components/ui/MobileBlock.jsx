import styles from "./MobileBlock.module.scss";
import textClip from "../../assets/text-clip.png";

const MobileBlock = () => (
  <div className={styles.wrap}>
    <h1 
      className={styles.logo} 
      style={{ backgroundImage: `url(${textClip})` }}
    >
      REQUIEM
    </h1>
    <p className={styles.message}>
      For the best experience,<br />
      please open Requiem on<br />
      a <strong>desktop browser</strong>.
    </p>
  </div>
);

export default MobileBlock;
