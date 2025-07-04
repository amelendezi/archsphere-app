import React, { useState } from 'react';

function UploadState({ nextStep, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
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
      <div className="UploadState-buttons-row">
        <button className="UploadState-button UploadState-button-close" onClick={onClose}>Close</button>
        <button className="UploadState-button UploadState-button-next" onClick={nextStep}>Next</button>
      </div>
    </div>
  );
}

export default UploadState;