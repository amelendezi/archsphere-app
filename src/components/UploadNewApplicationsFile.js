import React from 'react';

function UploadNewApplicationsFile({ selectedFile, handleFileChange, loadedCount, fileInputId }) {
  return (
    <>
      <div className="UploadState-file-selection-row">
        <span style={{ color: 'black', marginRight: '10px' }}>(Optional) Upload new applications.</span>
        <label htmlFor={fileInputId} className="UploadState-button UploadState-button-choose-file">
          Choose File
        </label>
        <input id={fileInputId} type="file" accept=".json" style={{ display: 'none' }} onChange={handleFileChange} />
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

export default UploadNewApplicationsFile;