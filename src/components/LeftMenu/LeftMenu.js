import React, { useState } from 'react';
import './LeftMenu.css';
import useDummyAssets from '../../hooks/useDummyAssets';

const LeftMenu = ({ onMenuItemClick, selectedMenuItem }) => {
  const { assets, loading, error } = useDummyAssets();
  const [showAssetsSubMenu, setShowAssetsSubMenu] = useState(false);

  const menuItems = [
    "Applications", 
    "Assessments", 
    "Tag Management"
  ];

  const handleItemClick = (item) => {
    if (item === "Assets") {
      setShowAssetsSubMenu(!showAssetsSubMenu);
    } else {
      onMenuItemClick(item);
      setShowAssetsSubMenu(false); // Close sub-menu when another main item is clicked
    }
  };

  const handleAssetSubMenuItemClick = (assetName) => {
    onMenuItemClick(`Asset:${assetName}`); // Prefix to differentiate asset clicks
  };

  return (
    <nav className="left-menu-nav">
      <ul className="left-menu-list">
        <li 
          key="Assets" 
          className={`left-menu-item ${selectedMenuItem.startsWith('Asset:') ? 'selected' : ''}`}
          onClick={() => handleItemClick("Assets")}
        >
          <span>Assets</span>
          <span className="arrow-indicator">{showAssetsSubMenu ? '▲' : '▼'}</span>
        </li>
        {showAssetsSubMenu && !loading && !error && (
          <ul className={`left-menu-sub-list ${showAssetsSubMenu ? 'open' : ''}`}>
            {assets.map((asset) => (
              <li 
                key={asset.id} 
                className={`left-menu-sub-item ${selectedMenuItem === `Asset:${asset.name}` ? 'selected' : ''}`}
                onClick={(e) => {
                  e.stopPropagation(); // Prevent parent li click
                  handleAssetSubMenuItemClick(asset.name);
                }}
              >
                {asset.name}
              </li>
            ))}
          </ul>
        )}
        {menuItems.map((item) => (
          <li 
            key={item} 
            className={`left-menu-item ${selectedMenuItem === item ? 'selected' : ''}`}
            onClick={() => handleItemClick(item)}
          >
            {item}
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default LeftMenu;
