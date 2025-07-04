import React from 'react';

function UploadEnvironmentFile({ selectedFile, handleFileChange, loadedCount }) {
  return (
    <>
      <div className="UploadState-file-selection-row">
        <span style={{ color: 'black', marginRight: '10px' }}>(Optional) Upload a saved environment.</span>
        <label htmlFor="file-upload" className="UploadState-button UploadState-button-choose-file">
          Choose File
        </label>
        <input id="file-upload" type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />
        <span className="UploadState-file-name">
          {selectedFile ? selectedFile.name : 'No file selected'}
        </span>
          {loadedCount !== null && (
            <span style={{ color: 'green', marginLeft: 'auto' }}>
              {loadedCount} applications
            </span>
          )}
      </div>
    </>
  );
}

export default UploadEnvironmentFile;