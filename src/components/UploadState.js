import React, { useState } from 'react';
import { parseStateJson } from '../utils/parseStateJson';
import { useIndexedDB } from '../hooks/useIndexedDB';

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
        await addApplications(applications);
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
      <h2>Upload your previous work saved in state.json</h2>
      <div className="UploadState-file-selection-row">
        <label htmlFor="file-upload" className="UploadState-button UploadState-button-choose-file">
          Choose File
        </label>
        <input id="file-upload" type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />
        <span className="UploadState-file-name">
          {selectedFile ? selectedFile.name : 'No file selected'}
        </span>
      </div>
      {loadedCount !== null && (
        <p style={{ textAlign: 'center', marginTop: '1rem' }}>
          Number of applications loaded: {loadedCount}
        </p>
      )}
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