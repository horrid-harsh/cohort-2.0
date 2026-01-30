import { useEffect, useRef, useState } from "react";
import "./navbar.scss";
import AppleIcon from "./icons/AppleIcon";
import MenuDropdown from "./MenuDropdown";
import DateTime from "./DateTime"
import ControlCenterIcon from "./icons/ControlCenterIcon";
import WifiIcon from "./icons/WifiIcon";

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
            <ControlCenterIcon />
          </div>
          <div className="status-item">
            <WifiIcon />
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
