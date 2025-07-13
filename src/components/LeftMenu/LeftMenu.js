import React, { useState } from 'react';
import './LeftMenu.css';
import useDummyAssets from '../../hooks/useDummyAssets';

const LeftMenu = ({ onMenuItemClick, selectedMenuItem }) => {
  const { assets, loading, error } = useDummyAssets();
  const [showAssetsSubMenu, setShowAssetsSubMenu] = useState(false);

  const menuItems = [
    "Applications", 
    "Assessments", 
    "Tag Management",
    "Assets"
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
        {menuItems.map((item) => (
          <React.Fragment key={item}>
            <li 
              className={`left-menu-item ${selectedMenuItem === item || (item === "Assets" && selectedMenuItem.startsWith('Asset:')) ? 'selected' : ''}`}
              onClick={() => handleItemClick(item)}
            >
              <span>{item}</span>
              {item === "Assets" && <span className="arrow-indicator">{showAssetsSubMenu ? '▲' : '▼'}</span>}
            </li>
            {item === "Assets" && showAssetsSubMenu && !loading && !error && (
              <ul className={`left-menu-sub-list ${showAssetsSubMenu ? 'open' : ''}`}>
                {assets.map((asset, index) => (
                  <li 
                    key={asset.id} 
                    className={`left-menu-sub-item ${selectedMenuItem === `Asset:${asset.name}` ? 'selected' : ''}`}
                    style={{ animationDelay: `${index * 0.1}s` }} /* Add animation delay */
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
          </React.Fragment>
        ))}
      </ul>
    </nav>
  );
};

export default LeftMenu;
