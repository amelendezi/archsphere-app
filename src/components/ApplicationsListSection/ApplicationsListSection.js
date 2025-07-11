import React from 'react';
import './ApplicationsListSection.css';

const ApplicationsListSection = () => {
  return (
    <div className="applications-list-container">
      {/* Applications List Pane */}
      <div className="applications-list-pane">
        {/* Applications Header Container */}
        <div className="applications-header-container">
          <h3>Applications Header</h3>
        </div>
        {/* Applications List Container */}
        <div className="applications-list-container-inner">
          <p>Applications List Content</p>
        </div>
      </div>

      {/* Applications Detail Pane */}
      <div className="applications-detail-pane">
        <h3>Applications Detail</h3>
      </div>
    </div>
  );
};

export default ApplicationsListSection;
