import { useEffect, useRef, useState } from "react";
import "./navbar.scss";
import AppleIcon from "../assets/cursors/apple.svg";
import MenuDropdown from "./MenuDropdown";
import DateTime from "./DateTime"

const MENU = [
    {
    title: "Apple",
    icon: AppleIcon,
    items: ["About This Mac", "System Settings", "Sleep", "Restart", "Shut Down"],
  },
  {
    title: "Finder",
    items: ["About Finder", "Preferences", "Empty Trash"],
    className: "finder",
  },
  {
    title: "File",
    items: ["New Window", "Open", "Close Window"],
  },
  {
    title: "Edit",
    items: ["Undo", "Redo", "Cut", "Copy", "Paste"],
  },
  {
    title: "View",
    items: ["Show Toolbar", "Hide Sidebar"],
  },
  {
    title: "Go",
    items: ["Show Toolbar", "Hide Sidebar"],
  },
  {
    title: "Window",
    items: ["Show Toolbar", "Hide Sidebar"],
  },
  {
    title: "Help",
    items: ["Show Toolbar", "Hide Sidebar"],
  },
  
];

export default function Navbar() {
  const [activeMenu, setActiveMenu] = useState(null);
  const [menuMode, setMenuMode] = useState(false);
  const [menuRect, setMenuRect] = useState(null);

  const navRef = useRef(null);

  // Close on outside click
  useEffect(() => {
     const closeMenu = () => {
      setActiveMenu(null);
      setMenuMode(false);
    };

    const handleClickOutside = (e) => {
      if (navRef.current && !navRef.current.contains(e.target)) {
        setActiveMenu(null);
        setMenuMode(false);
      }
    };

    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setActiveMenu(null);
        setMenuMode(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, []);

  const handleClick = (title, e) => {
    setActiveMenu(title);
    setMenuMode(true);
    setMenuRect(e.currentTarget.getBoundingClientRect());
  };

  const handleHover = (title, e) => {
    if (menuMode) {
      setActiveMenu(title);
      setMenuRect(e.currentTarget.getBoundingClientRect());
    }
  };

  return (
    <nav className="mac-navbar" ref={navRef}>
      <div className="menu-bar">
        <div className="menu-left">

        {MENU.map((menu) => (
          <div
            key={menu.title}
            className={`menu-item ${
              activeMenu === menu.title ? "active" : ""
            } ${menu.className || ""} ${menu.icon ? "apple-menu" : ""}`}
            onClick={(e) => handleClick(menu.title, e)}
            onMouseEnter={(e) => handleHover(menu.title, e)}
          >
            {menu.icon ? (
                // <img src={menu.icon} alt="Apple" className="apple-icon" />
                <svg className="apple-icon" viewBox="0 0 24 24" width="1.2em" height="1.2em"><path fill="currentColor" d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47c-1.34.03-1.77-.79-3.29-.79c-1.53 0-2 .77-3.27.82c-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51c1.28-.02 2.5.87 3.29.87c.78 0 2.26-1.07 3.81-.91c.65.03 2.47.26 3.64 1.98c-.09.06-2.17 1.28-2.15 3.81c.03 3.02 2.65 4.03 2.68 4.04c-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5c.13 1.17-.34 2.35-1.04 3.19c-.69.85-1.83 1.51-2.95 1.42c-.15-1.15.41-2.35 1.05-3.11"></path></svg>
            ) : (
                menu.title
            )}

          </div>
        ))}
        </div>

        <div className="menu-right">
          <div className="status-item">
            <img className="wifi-icon" src="../nav-icons/wifi-dark.svg" alt="" />
          </div>

          <div className="status-item">
            <DateTime />
          </div>
        </div>

        {menuMode && activeMenu && (
            <MenuDropdown rect={menuRect}>
                {MENU.find((m) => m.title === activeMenu)?.items.map((item) => (
                <div key={item} className="dropdown-item">
                    {item}
                </div>
                ))}
            </MenuDropdown>
        )}
      </div>
    </nav>
  );
}
