import styles from "./SaveSkeleton.module.scss";

const SaveSkeleton = () => {
  return (
    <div className={styles.skeletonCard}>
      <div className={styles.thumbnail} />
      <div className={styles.body}>
        <div className={styles.siteInfo} />
        <div className={styles.title} />
        <div className={styles.note} />
        <div className={styles.tags}>
          <div className={styles.tag} />
          <div className={styles.tag} />
        </div>
      </div>
      <div className={styles.actions} />
    </div>
  );
};

export default SaveSkeleton;
