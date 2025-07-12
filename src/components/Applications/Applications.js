import React from 'react';
import './Applications.css';

import ApplicationList from './ApplicationList';
import ApplicationDetail from './ApplicationDetail';

const Applications = () => {
  return (
    <div className="applications-container">
      <div className="application-list-wrapper">
        <ApplicationList />
      </div>
      <div className="application-detail-wrapper">
        <ApplicationDetail />
      </div>
    </div>
  );
};

export default Applications;
