import { NavLink, useNavigate } from "react-router-dom";
import { useCollections } from "../../features/collections/hooks/useCollections";
import { useTags } from "../../features/tags/hooks/useTags";
import { useLogout } from "../../features/auth/hooks/useAuth";
import useAuthStore from "../../features/auth/store/auth.store";
import styles from "./Sidebar.module.scss";

const NAV_ITEMS = [
  { label: "All saves", to: "/", icon: "◈" },
  { label: "Favorites", to: "/favorites", icon: "♡" },
  { label: "Graph", to: "/graph", icon: "◎" },
  { label: "Archive", to: "/archive", icon: "▤" },
];

const Sidebar = () => {
  const { user } = useAuthStore();
  const { data: collections = [], isLoading: colLoading } = useCollections();
  const { data: tags = [], isLoading: tagLoading } = useTags();
  const { mutate: logout } = useLogout();

  return (
    <aside className={styles.sidebar}>
      <NavLink to="/" className={styles.logo}>
        RE<span>QUIEM</span>
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
            <span className={styles.navIcon}>{item.icon}</span>
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Collections</span>
        </div>
        {colLoading ? (
          <div className={styles.empty}>Loading...</div>
        ) : collections.length === 0 ? (
          <div className={styles.empty}>No collections yet</div>
        ) : (
          collections.map((col) => (
            <NavLink
              key={col._id}
              to={`/collections/${col._id}`}
              className={({ isActive }) =>
                `${styles.navItem} ${isActive ? styles.active : ""}`
              }
            >
              <span className={styles.navIcon}>{col.emoji}</span>
              <span className={styles.navLabel}>{col.name}</span>
              <span className={styles.count}>{col.saveCount}</span>
            </NavLink>
          ))
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <span>Tags</span>
        </div>
        {tagLoading ? (
          <div className={styles.empty}>Loading...</div>
        ) : tags.length === 0 ? (
          <div className={styles.empty}>No tags yet</div>
        ) : (
          <div className={styles.tagsList}>
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
                {tag.name}
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
          <button className={styles.logoutBtn} onClick={() => logout()} title="Logout">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
