import React from 'react';
import './ApplicationDetail.css';

const ApplicationDetail = ({ application }) => {
  if (!application) {
    return (
      <div className="application-detail-container">
        <h2>Select an application to see the details</h2>
      </div>
    );
  }

  return (
    <div className="application-detail-container">
      <h2>{application.Name}</h2>
      {Object.entries(application).map(([key, value]) => (
        <div key={key} className="detail-item">
          <span className="detail-label">{key}:</span>
          <span className="detail-value">{value}</span>
        </div>
      ))}
    </div>
  );
};

export default ApplicationDetail;