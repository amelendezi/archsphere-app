import logo from '../archsphere160.png';
import '../App.css';
import React, { useState } from 'react';
import SetupInitialState from '../components/SetupWizardComponent/SetupInitialState';
import AppMenuPage from './AppMenuPage';

function AppMainPage() {
  const [showSetup, setShowSetup] = useState(false);
  const [showAppLists, setShowAppLists] = useState(false);

  const handleButtonClick = () => {
    setShowSetup(true);
  };

  const handleCloseSetup = () => {
    setShowSetup(false);
  };

  const handleSetupComplete = () => {
    setShowSetup(false);
    setShowAppLists(true);
  };

  return (
    <div className="App">
      {!showSetup && !showAppLists && (
        <header className="App-header">
          <div className="App-content">
            <img src={logo} className="App-logo" alt="logo" />
            <div className="App-text">
              <h1>ArchSphere</h1>
              <p>Supporting architects with application landscape context.</p>
              <button className="App-button" onClick={handleButtonClick}>
                Let's get started ... <span className="arrow">&#9658;</span>
              </button>
            </div>
          </div>
        </header>
      )}
      {showSetup && <SetupInitialState onClose={handleCloseSetup} onSetupComplete={handleSetupComplete} />}
      {showAppLists && <AppMenuPage />}
    </div>
  );
}

export default AppMainPage;