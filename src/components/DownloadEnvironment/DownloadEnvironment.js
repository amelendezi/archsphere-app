import React, { useState } from 'react';
import './DownloadEnvironment.css';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { SETUP_ENV_APPLICATIONS_STORE_NAME } from '../../config/dbConfig';

const DownloadEnvironment = ({ onClose }) => {
  const [includeApplications, setIncludeApplications] = useState(true);
  const { getAllApplications } = useIndexedDB();

  const handleDownload = async () => {
    if (includeApplications) {
      const applications = await getAllApplications(SETUP_ENV_APPLICATIONS_STORE_NAME);
      const data = { applications };
      const json = JSON.stringify(data, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'environment.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    onClose();
  };

  return (
    <div className="download-environment-dialog-overlay">
      <div className="download-environment-dialog">
        <p>Download the environment.json to use next time you work with the app. This contains all the changes.</p>
        <div>
          <input
            type="checkbox"
            id="applications-checkbox"
            checked={includeApplications}
            onChange={() => setIncludeApplications(!includeApplications)}
          />
          <label htmlFor="applications-checkbox">Applications</label>
        </div>
        <button onClick={handleDownload}>Download</button>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default DownloadEnvironment;