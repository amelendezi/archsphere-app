import React from 'react';
import logo from '../../archsphere160.png'; // Adjust path as needed
import './LeftMenuHeader.css';

const LeftMenuHeader = () => {
  return (
    <div className="left-menu-header-container">
      <img src={logo} alt="ArchSphere Logo" className="left-menu-header-logo" />
      <h3 className="left-menu-header-title">ArchSphere</h3>
    </div>
  );
};

export default LeftMenuHeader;
