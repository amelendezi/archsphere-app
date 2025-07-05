import React from 'react';

function Reconciliation({ onBack, onClose }) {
  return (
    <div style={{ backgroundColor: '#f8f8f8', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: 'black' }}>Reconcile New Applications</h2>
      <div style={{ borderBottom: '1px solid grey', width: '80%', margin: '20px auto 0 auto' }}></div>
      <div style={{ flexGrow: 1 }}></div>
      <div style={{ borderBottom: '1px solid grey', width: '80%', margin: '20px auto 0 auto' }}></div>
      <div className="UploadState-buttons-row">
        <button className="UploadState-button UploadState-button-close" onClick={onBack}>Back</button>
        <button
          className="UploadState-button UploadState-button-next"
          onClick={onClose}
        >
          Finish
        </button>
      </div>
    </div>
  );
}

export default Reconciliation;