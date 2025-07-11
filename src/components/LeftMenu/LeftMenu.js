import React from 'react';
import './LeftMenu.css';

const LeftMenu = () => {
  const menuItems = ["Applications", "Assessments", "Tag Management"];

  return (
    <nav className="left-menu-nav">
      <ul className="left-menu-list">
        {menuItems.map((item) => (
          <li key={item} className="left-menu-item">
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LeftMenu;
