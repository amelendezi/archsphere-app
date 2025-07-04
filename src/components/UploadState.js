import React from 'react';

function UploadState({ nextStep, onClose }) {
  return (
    <div>
      <h2>Upload saved work</h2>
      {/* Add your upload form/content here */}
      <button onClick={onClose}>Close</button>
      <button onClick={nextStep}>Next</button>
    </div>
  );
}

export default UploadState;