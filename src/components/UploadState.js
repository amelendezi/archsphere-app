import React, { useState } from 'react';
import { parseStateJson } from '../utils/parseStateJson';
import { useIndexedDB } from '../hooks/useIndexedDB';
import UploadEnvironmentFile from './UploadEnvironmentFile';

function UploadState({ nextStep, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadedCount, setLoadedCount] = useState(null);
  const { addApplications } = useIndexedDB();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setLoadedCount(null);

    if (file) {
      parseStateJson(file, async (applications) => {
        await addApplications(applications, 'env_applications');
        setLoadedCount(applications.length);
      });
    }
  };

  const handleNext = () => {
    if (selectedFile) {
      onClose();
    }
  };

  return (
    <div>
      <h2>Setup Environment</h2>
      <div style={{ borderBottom: '1px solid grey', width: '80%', margin: '0 auto 20px auto' }}></div>
      <UploadEnvironmentFile
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        loadedCount={loadedCount}
      />
      <div style={{ flexGrow: 1 }}></div> {/* This will push the content to the bottom */}
      <div style={{ borderBottom: '1px solid grey', width: '80%', margin: '20px auto 0 auto' }}></div>
      <div className="UploadState-buttons-row">
        <button className="UploadState-button UploadState-button-close" onClick={onClose}>Close</button>
        <button
          className="UploadState-button UploadState-button-next"
          onClick={handleNext}
          disabled={!selectedFile}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UploadState;