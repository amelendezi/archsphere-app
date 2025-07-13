import React from 'react';
import './DownloadEnvironment.css';

const DownloadEnvironment = ({ onClose }) => {
  return (
    <div className="download-environment-dialog-overlay">
      <div className="download-environment-dialog">
        <p>Download the environment.json to use next time you work with the app. This contains all the changes.</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DownloadEnvironment;