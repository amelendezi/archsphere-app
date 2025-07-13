import React, { useState, useEffect } from 'react';
import './Applications.css';

import ApplicationList from './ApplicationList';
import ApplicationDetail from './ApplicationDetail';

const Applications = () => {
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [isDetailViewOpen, setIsDetailViewOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // This will be the immediate input value
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState(''); // This will be the debounced value

  // New useEffect for debouncing
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300); // 300ms debounce delay

    // Cleanup function: clear the timeout if searchTerm changes before the delay
    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]); // Re-run effect only when searchTerm changes

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
        <ApplicationList
          onApplicationSelect={handleApplicationSelect}
          selectedApplication={selectedApplication}
          searchTerm={debouncedSearchTerm} // <-- Changed to debouncedSearchTerm
          onSearchTermChange={handleSearchTermChange}
        />
      </div>
      <div className={`application-detail-wrapper ${isDetailViewOpen ? 'open' : ''}`}>
        <ApplicationDetail key={selectedApplication.ID} application={selectedApplication} />
      </div>
    </div>
  );
};

export default Applications;
