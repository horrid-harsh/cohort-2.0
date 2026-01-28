import { createPortal } from "react-dom";

export default function MenuDropdown({ rect, children }) {
  if (!rect) return null;

  return createPortal(
    <div
      className="menu-dropdown-portal"
      style={{
        top: rect.bottom,
        left: rect.left,
      }}
    >
      {children}
    </div>,
    document.body
  );
}
