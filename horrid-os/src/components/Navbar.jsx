import { useEffect, useRef, useState } from "react";
import "./navbar.scss";
import AppleIcon from "../assets/cursors/apple.svg";
import MenuDropdown from "./MenuDropdown";

const MENU = [
    {
    title: "Apple",
    icon: AppleIcon,
    items: ["About This Mac", "System Settings", "Sleep", "Restart", "Shut Down"],
  },
  {
    title: "Finder",
    items: ["About Finder", "Preferences", "Empty Trash"],
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
        {MENU.map((menu) => (
          <div
            key={menu.title}
            className={`menu-item ${
              activeMenu === menu.title ? "active" : ""
            } ${menu.icon ? "apple-menu" : ""}`}
            onClick={(e) => handleClick(menu.title, e)}
            onMouseEnter={(e) => handleHover(menu.title, e)}
          >
            {menu.icon ? (
                <img src={menu.icon} alt="Apple" className="apple-icon" />
            ) : (
                menu.title
            )}

          </div>
        ))}
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
