import React, { useState } from 'react';
import './Applications.css';

import ApplicationList from './ApplicationList';
import ApplicationDetail from './ApplicationDetail';

const Applications = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);

  const handleApplicationSelect = (application) => {
    setSelectedApplication(application);
  };

  return (
    <div className="applications-container">
      <div className="application-list-wrapper">
        <ApplicationList onApplicationSelect={handleApplicationSelect} />
      </div>
      <div className="application-detail-wrapper">
        <ApplicationDetail application={selectedApplication} />
      </div>
    </div>
  );
};

export default Applications;
