import { useEffect, useRef, useState } from "react";
import "./navbar.scss";
import AppleIcon from "./AppleIcon";
import MenuDropdown from "./MenuDropdown";
import DateTime from "./DateTime"

const MENU = [
    {
    title: "Apple",
    items: ["About This Mac", "System Settings", "Sleep", "Restart...", "Shut Down..."],
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
    items: ["As Icons", "As List", "As Gallery", "Use Stacks", "Sort By", "Customize Toolbar", "Show View Options", "Enter Full Screen"],
  },
  {
    title: "Go",
    items: ["Back", "Forward", "Recents", "Documents", "Desktop", "Downloads", "Home", "Go To Folder"],
  },
  {
    title: "Window",
    items: ["Minimize", "Zoom", "Move Window to Left Side of Screen", "Move Window to Right Side of Screen", "Cycle Through Windows"],
  },
  {
    title: "Help",
    items: ["Send Finder Feedback", "macOS Help"],
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
            {menu.title === "Apple" ? (
                <AppleIcon />
            ) : (
                menu.title
            )}

          </div>
        ))}
        </div>

        <div className="menu-right">

          <div className="status-item">
            <svg xmlns="http://www.w3.org/2000/svg" fill="#111" viewBox="0 0 351 348" width="15" height="15">
            <path stroke="currentColor" d="M87.75 46.2c9.31 0 18.237 3.245 24.819 9.021 6.583 5.776 10.281 13.61 10.281 21.779s-3.698 16.003-10.281 21.779c-6.582 5.776-15.51 9.021-24.819 9.021-9.31 0-18.237-3.245-24.82-9.021C56.349 93.003 52.65 85.169 52.65 77s3.698-16.003 10.28-21.779c6.583-5.776 15.51-9.021 24.82-9.021zM263.25 0c23.273 0 45.592 8.112 62.049 22.553C341.755 36.993 351 56.578 351 77c0 20.422-9.245 40.007-25.701 54.447C308.842 145.888 286.523 154 263.25 154H87.75c-23.273 0-45.592-8.112-62.049-22.553C9.245 117.007 0 97.422 0 77c0-20.422 9.245-40.007 25.701-54.447C42.158 8.113 64.477 0 87.75 0h175.5zM87.75 30.8c-13.964 0-27.355 4.867-37.23 13.532C40.648 52.996 35.1 64.747 35.1 77s5.547 24.004 15.42 32.668c9.875 8.665 23.266 13.532 37.23 13.532h175.5c13.964 0 27.355-4.867 37.229-13.532C310.353 101.004 315.9 89.253 315.9 77s-5.547-24.004-15.421-32.668C290.605 35.667 277.214 30.8 263.25 30.8H87.75zM263.25 194H87.75c-23.273 0-45.592 8.112-62.049 22.553C9.245 230.993 0 250.578 0 271c0 20.422 9.245 40.007 25.701 54.447C42.158 339.888 64.477 348 87.75 348h175.5c23.273 0 45.592-8.112 62.049-22.553C341.755 311.007 351 291.422 351 271c0-20.422-9.245-40.007-25.701-54.447C308.842 202.112 286.523 194 263.25 194v0zm0 123.2c-13.964 0-27.355-4.867-37.229-13.532-9.874-8.664-15.421-20.415-15.421-32.668s5.547-24.004 15.421-32.668c9.874-8.665 23.265-13.532 37.229-13.532 13.964 0 27.355 4.867 37.229 13.532 9.874 8.664 15.421 20.415 15.421 32.668s-5.547 24.004-15.421 32.668c-9.874 8.665-23.265 13.532-37.229 13.532z"></path>
            </svg>
          </div>
          <div className="status-item">
            <svg stroke="white" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="m1 9 2 2c4.97-4.97 13.03-4.97 18 0l2-2C16.93 2.93 7.08 2.93 1 9zm8 8 3 3 3-3a4.237 4.237 0 0 0-6 0zm-4-4 2 2a7.074 7.074 0 0 1 10 0l2-2C15.14 9.14 8.87 9.14 5 13z"></path></svg>
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
