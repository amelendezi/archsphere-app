
import React, { useState } from 'react';
import './AppListsPage.css';
import LeftMenuHeader from '../components/LeftMenuHeader/LeftMenuHeader';
import LeftMenu from '../components/LeftMenu/LeftMenu';
import ApplicationsList from '../components/ApplicationsList/ApplicationsList';
import Assessments from '../components/Assessments/Assessments';
import TagManagement from '../components/TagManagement/TagManagement';
import AssetComponent from '../components/AssetComponent/AssetComponent';

const AppListsPage = () => {
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(true);
  const [selectedMenuItem, setSelectedMenuItem] = useState('Applications'); // Default selected item

  const toggleLeftMenu = () => {
    setIsLeftMenuOpen(!isLeftMenuOpen);
  };

  const handleMenuItemClick = (menuItem) => {
    setSelectedMenuItem(menuItem);
  };

  const renderMainContent = () => {
    if (selectedMenuItem.startsWith('Asset:')) {
      const assetName = selectedMenuItem.split(':')[1];
      return <AssetComponent assetName={assetName} />;
    }

    switch (selectedMenuItem) {
      case 'Applications':
        return <ApplicationsList />;
      case 'Assessments':
        return <Assessments />;
      case 'Tag Management':
        return <TagManagement />;
      default:
        return <h1>Select an option from the menu</h1>;
    }
  };

  return (
    <div className="app-lists-page-container">
      {/* Left Menu Pane */}
      <div className={`left-menu-pane ${isLeftMenuOpen ? 'open' : 'closed'}`}>
        <div className="left-menu-header">
          <LeftMenuHeader />
        </div>
        <div className="left-menu-content">
          <LeftMenu onMenuItemClick={handleMenuItemClick} selectedMenuItem={selectedMenuItem} />
        </div>
      </div>

      {/* Toggle Button */}
      <button className={`toggle-button ${isLeftMenuOpen ? 'left-menu-open' : 'left-menu-closed'}`} onClick={toggleLeftMenu}>
        <span className="arrow-icon">{isLeftMenuOpen ? '❮' : '❯'}</span>
      </button>

      {/* Main Content Wrapper */}
      <div className={`main-content-wrapper ${isLeftMenuOpen ? 'left-menu-open' : 'left-menu-closed'}`}>
        {/* Header Menu Pane */}
        <div className="header-menu-pane">
          <h4>Header Menu Pane</h4>
        </div>

        {/* Main Content Pane */}
        <div className="main-content-pane">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default AppListsPage;
