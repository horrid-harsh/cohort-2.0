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
    ><div className="m-d-container">
      {children}

    </div>
    </div>,
    document.body
  );
}
