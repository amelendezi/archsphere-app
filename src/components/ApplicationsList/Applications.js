import React from 'react';
import './Applications.css';

import ApplicationList from './ApplicationList';

const Applications = () => {
  return (
    <div className="applications-container">
      <div className="application-list-wrapper">
        <ApplicationList />
      </div>
      <div className="application-detail-wrapper">
        {/* Content for application details will go here */}
      </div>
    </div>
  );
};

export default Applications;
