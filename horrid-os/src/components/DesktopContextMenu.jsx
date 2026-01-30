import { createPortal } from "react-dom";
import "./desktop-context-menu.scss";

const MENU_ITEMS = [
  "New Folder",
  "Get Info",
  "Change Desktop Background",
  "Use Stacks",
  "Sort By",
  "Clean Up",
  "Clean Up By",
  "Show View Options",
];

export default function DesktopContextMenu({ position, onClose }) {
  if (!position) return null;

  return createPortal(
    <div
      className="desktop-context-menu"
      style={{
        top: position.y,
        left: position.x,
      }}
    >
      <div className="d-c-container">
        {MENU_ITEMS.map((item) => (
          <div key={item} className="dropdown-item">
            {item}
          </div>
        ))}
      </div>
    </div>,
    document.body,
  );
}
