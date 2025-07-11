
import React, { useState } from 'react';
import './AppListsPage.css';

const AppListsPage = () => {
  const [isLeftMenuOpen, setIsLeftMenuOpen] = useState(true);

  const toggleLeftMenu = () => {
    setIsLeftMenuOpen(!isLeftMenuOpen);
  };

  return (
    <div className="app-lists-page-container">
      {/* Left Menu Pane */}
      <div className={`left-menu-pane ${isLeftMenuOpen ? 'open' : 'closed'}`}>
        <h2>Left Menu Pane</h2>
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
          <h3>Main Content Pane</h3>
        </div>
      </div>
    </div>
  );
};

export default AppListsPage;
