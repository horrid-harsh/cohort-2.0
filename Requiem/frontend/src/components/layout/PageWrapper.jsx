import Sidebar from "./Sidebar";
import styles from "./PageWrapper.module.scss";

const PageWrapper = ({ children }) => {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <main className={styles.main}>{children}</main>
    </div>
  );
};

export default PageWrapper;
