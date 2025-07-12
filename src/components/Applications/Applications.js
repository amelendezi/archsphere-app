import React, { useState } from 'react';
import './Applications.css';

import ApplicationList from './ApplicationList';
import ApplicationDetail from './ApplicationDetail';

const Applications = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const handleApplicationSelect = (application) => {
    if (selectedApplication && selectedApplication.ID === application.ID) {
      setIsDetailViewOpen(!isDetailViewOpen);
      if (isDetailViewOpen) { // If detail view is currently open and we are closing it
        setSelectedApplication(null);
      }
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
