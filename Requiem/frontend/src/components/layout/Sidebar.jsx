import { NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/requiem-logo-wordmark-v2.png";
import { useCollections } from "../../features/collections/hooks/useCollections";
import { useTags } from "../../features/tags/hooks/useTags";
import { useLogout } from "../../features/auth/hooks/useAuth";
import useAuthStore from "../../features/auth/store/auth.store";
import styles from "./Sidebar.module.scss";

const NAV_ITEMS = [
  {
    label: "All saves",
    to: "/",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Favorites",
    to: "/favorites",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    label: "Graph",
    to: "/graph",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="18" cy="5" r="3" />
        <circle cx="6" cy="12" r="3" />
        <circle cx="18" cy="19" r="3" />
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
      </svg>
    ),
  },
  {
    label: "Archive",
    to: "/archive",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="21 8 21 21 3 21 3 8" />
        <rect x="1" y="3" width="22" height="5" />
        <line x1="10" y1="12" x2="14" y2="12" />
      </svg>
    ),
  },
  {
    label: "Clusters",
    to: "/clusters",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l9 4.9V17.1l-9 4.9l-9-4.9V6.9L12 2z" />
      </svg>
    ),
  },
];

const Sidebar = () => {
  const { user } = useAuthStore();
  const { data: collections = [], isLoading: colLoading } = useCollections();
  const { data: tags = [], isLoading: tagLoading } = useTags();
  const { mutate: logout } = useLogout();

  return (
    <aside className={styles.sidebar}>
      <NavLink to="/" className={`${styles.logo} no-select`}>
        <img src={logo} alt="Requiem" />
      </NavLink>

      <nav className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === "/"}
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ""}`
            }
          >
            <span className={`${styles.navIcon} no-select`}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.section}>
        <div className={`${styles.sectionHeader} no-select`}>
          <span>Collections</span>
        </div>
        {colLoading ? (
          <div className={styles.empty}>Loading...</div>
        ) : collections.length === 0 ? (
          <div className={styles.empty}>No collections yet</div>
        ) : (
          <div className={styles.collectionsList} data-lenis-prevent>
            {collections.map((col) => (
              <NavLink
                key={col._id}
                to={`/collections/${col._id}`}
                className={({ isActive }) =>
                  `${styles.navItem} ${isActive ? styles.active : ""}`
                }
              >
                <span className={styles.navIcon}>{col.emoji}</span>
                <span className={`${styles.navLabel} select-text`}>{col.name}</span>
                <span className={styles.count}>{col.saveCount}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <div className={styles.section}>
        <div className={`${styles.sectionHeader} no-select`}>
          <span>Tags</span>
        </div>
        {tagLoading ? (
          <div className={styles.empty}>Loading...</div>
        ) : tags.length === 0 ? (
          <div className={styles.empty}>No tags yet</div>
        ) : (
          <div className={styles.tagsList} data-lenis-prevent>
            {tags.map((tag) => (
              <NavLink
                key={tag._id}
                to={`/tags/${tag._id}`}
                className={({ isActive }) =>
                  `${styles.tagItem} ${isActive ? styles.active : ""}`
                }
              >
                <span
                  className={styles.tagDot}
                  style={{ background: tag.color }}
                />
                <span className="select-text">{tag.name}</span>
                <span className={styles.count}>{tag.saveCount}</span>
              </NavLink>
            ))}
          </div>
        )}
      </div>

      <div className={styles.bottom}>
        <div className={styles.userRow}>
          <div className={styles.avatar}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <span className={styles.userName}>{user?.name}</span>
          <button
            className={styles.logoutBtn}
            onClick={() => logout()}
            title="Logout"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
