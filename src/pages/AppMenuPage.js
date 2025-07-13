
import React, { useState } from 'react';
import './AppMenuPage.css';
import LeftMenuHeader from '../components/LeftMenuHeader/LeftMenuHeader';
import LeftMenu from '../components/LeftMenu/LeftMenu';
import Applications from '../components/Applications/Applications';
import Assessments from '../components/Assessments/Assessments';
import TagManagement from '../components/TagManagement/TagManagement';
import AssetComponent from '../components/AssetComponent/AssetComponent';
import { FaDownload } from 'react-icons/fa';

const AppMenuPage = () => {
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
        return <Applications />;
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
          <div className="session-profile-icon-container">
            <span className="session-profile-icon"><FaDownload style={{ color: '#3367D6', fill: 'white' }} /></span>
            <span className="session-profile-tooltip">Download saved work</span>
          </div>
          <div className="session-profile-icon-container">
            <span className="session-profile-icon">?</span>
            <span className="session-profile-tooltip">Here will be the settings icon</span>
          </div>
        </div>

        {/* Main Content Pane */}
        <div className="main-content-pane">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
};

export default AppMenuPage;
