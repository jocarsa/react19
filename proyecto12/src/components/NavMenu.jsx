// src/components/NavMenu.jsx
import React, { useEffect, useState } from 'react';
import { useStore } from 'effector-react';
import { $menuData, $activeMenu, setActiveMenu, fetchMenuFx, fetchTableFx } from '../stores';
import './NavMenu.css'; // optional separate css

const NavMenu = () => {
  const menuData = useStore($menuData);
  const activeMenu = useStore($activeMenu);

  const [menuVisible, setMenuVisible] = useState(true);

  useEffect(() => {
    // on mount, fetch menu if not already loaded
    if (menuData.length === 0) {
      fetchMenuFx();
    }

    // retrieve nav state from localStorage
    const storedState = localStorage.getItem('jocarsa_menu');
    if (storedState === 'false') {
      setMenuVisible(false);
    }
  }, [menuData.length]);

  const toggleMenu = () => {
    setMenuVisible(!menuVisible);
    localStorage.setItem('jocarsa_menu', !menuVisible);
  };

  const handleMenuClick = (etiqueta) => {
    setActiveMenu(etiqueta);
    fetchTableFx(etiqueta);
  };

  return (
    <nav style={{ width: menuVisible ? '200px' : '55px' }}>
      <div className="enlaces">
        {menuData.map((item, idx) => {
          const isActive = activeMenu === item.etiqueta;
          return (
            <div
              key={idx}
              className={`menu-item ${isActive ? 'activo' : ''}`}
              onClick={() => handleMenuClick(item.etiqueta)}
            >
              <span className="icono relieve">{item.etiqueta[0]}</span>
              <span style={{ display: menuVisible ? 'inline' : 'none' }}>
                {item.etiqueta}
              </span>
            </div>
          );
        })}
      </div>
      <div className="operaciones">
        <div id="ocultar" onClick={toggleMenu}>
          <span
            className="icono relieve"
            style={{ transform: menuVisible ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            &gt;
          </span>
          <span style={{ display: menuVisible ? 'inline' : 'none' }}>Ocultar</span>
        </div>
      </div>
    </nav>
  );
};

export default NavMenu;
