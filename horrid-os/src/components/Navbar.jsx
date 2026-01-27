import DateTime from './DateTime'
import './navbar.scss'
import { useState, useRef, useEffect } from 'react';

const Navbar = () => {

    const [menuPosition, setMenuPosition] = useState({ left: 0, top: 0 });
    const [activeMenu, setActiveMenu] = useState(null);
    const menuRef = useRef(null);

    const menuItems = [
        {
            label: 'File',
            options: ['New Window', 'Open...', 'Close Window']
        },
        {
            label: 'Edit',
            options: ['Undo', 'Redo', 'Cut', 'Copy', 'Paste']
        },
        {
            label: 'View',
            options: ['Show Sidebar', 'Hide Sidebar', 'Enter Full Screen']
        },
        {
            label: 'Go',
            options: ['Back', 'Forward', 'Go to Folder...']
        },
        {
            label: 'Window',
            options: ['Minimize', 'Zoom', 'Bring All to Front']
        },
        {
            label: 'Help',
            options: ['Search', 'Documentation']
        },
        {
            label: 'Terminal',
            options: ['New Tab', 'New Window', 'Settings']
        }
    ];


useEffect(() => {
  const handleClickOutside = (e) => {
    if (menuRef.current && !menuRef.current.contains(e.target)) {
      setActiveMenu(null);
    }
  };

  const handleEsc = (e) => {
    if (e.key === 'Escape') setActiveMenu(null);
  };

  document.addEventListener('mousedown', handleClickOutside);
  document.addEventListener('keydown', handleEsc);

  return () => {
    document.removeEventListener('mousedown', handleClickOutside);
    document.removeEventListener('keydown', handleEsc);
  };
}, []);


  return (
    <nav>
        <div className='left'>
            <div className='nav-item apple-icon'>
                <img src="../nav-icons/apple.svg" alt="" />
            </div>
            <div className='nav-item'>
                <p style={{fontWeight: 'bold'}}>Harshwardhan</p>
            </div>
            {menuItems.map(item => (
                <div
                    key={item.label}
                    className={`nav-item ${activeMenu === item.label ? 'active' : ''}`}
                    onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMenuPosition({
                        left: rect.left,
                        top: rect.bottom
                    });
                    setActiveMenu(item.label);
                    }}
                    onMouseEnter={(e) => {
                    if (!activeMenu) return;
                    const rect = e.currentTarget.getBoundingClientRect();
                    setMenuPosition({
                        left: rect.left,
                        top: rect.bottom
                    });
                    setActiveMenu(item.label);
                    }}
                >
                    {item.label}
                </div>
            ))}


            {activeMenu && (
                <div
                    className="menu-dropdown"
                    ref={menuRef}
                    style={{
                    left: menuPosition.left + 8,
                    top: menuPosition.top + 5
                    }}
                >
                    {menuItems
                    .find(item => item.label === activeMenu)
                    ?.options.map(option => (
                        <p key={option}>{option}</p>
                    ))}
                </div>
            )}

        </div>

        <div className='right'>
            <div className='nav-icon'>
                <img src="../nav-icons/wifi.svg" alt="" />
            </div>

            <div className='nav-item'>
                <DateTime />
            </div>
        </div>
    </nav>
  )
}

export default Navbar