import React, { useState } from 'react';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { SETUP_ENV_APPLICATIONS_STORE_NAME, APP_ANNOTATIONS_STORE_NAME } from '../../config/dbConfig';
import './DownloadEnvironment.css';

const DownloadEnvironment = ({ onClose }) => {
  const [includeAnnotations, setIncludeAnnotations] = useState(false);
  const { getAllApplications, getAllStoreData } = useIndexedDB();

  const handleDownload = async () => {
    try {
      const applications = await getAllApplications(SETUP_ENV_APPLICATIONS_STORE_NAME);
      let dataToDownload = { applications };

      if (includeAnnotations) {
        const annotations = await getAllStoreData(APP_ANNOTATIONS_STORE_NAME);
        dataToDownload.application_annotations = annotations;
      }

      const json = JSON.stringify(dataToDownload, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'environment.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onClose();
    } catch (error) {
      console.error("Failed to download environment:", error);
    }
  };

  return (
    <div className="download-environment-dialog-overlay">
      <div className="download-environment-dialog">
        <h3>Download Options</h3>
        <div className="checkbox-container">
          <input 
            type="checkbox" 
            id="include-annotations" 
            checked={includeAnnotations} 
            onChange={() => setIncludeAnnotations(!includeAnnotations)} 
          />
          <label htmlFor="include-annotations">Application Annotations</label>
        </div>
        <div className="button-container">
          <button className="reconciliationButtonPrimary" onClick={handleDownload}>Download</button>
          <button className="reconciliationButtonPrimary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default DownloadEnvironment;