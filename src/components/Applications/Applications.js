import React, { useState } from 'react';
import './Applications.css';

import ApplicationList from './ApplicationList';
import ApplicationDetail from './ApplicationDetail';
import ApplicationListSearch from './ApplicationListSearch';

const Applications = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleApplicationSelect = (application) => {
    if (selectedApplication && selectedApplication.ID === application.ID) {
      setIsDetailViewOpen(!isDetailViewOpen);
    } else {
      setSelectedApplication(application);
      setIsDetailViewOpen(true);
    }
  };

  const handleSearchTermChange = (term) => {
    setSearchTerm(term);
  };

  return (
    <div className={`applications-container ${isDetailViewOpen ? 'detail-view-open' : ''}`}>
      <div className="application-list-wrapper">
        <ApplicationList onApplicationSelect={handleApplicationSelect} selectedApplication={selectedApplication} searchTerm={searchTerm} onSearchTermChange={handleSearchTermChange} />
      </div>
      <div className={`application-detail-wrapper ${isDetailViewOpen ? 'open' : ''}`}>
        <ApplicationDetail application={selectedApplication} />
      </div>
    </div>
  );
};

export default Applications;
