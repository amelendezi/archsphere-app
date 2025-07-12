import React from 'react';
import './ApplicationListHeader.css';

const ApplicationListHeader = ({ headers }) => {
  return (
    <div className="application-list-header">
      {headers.map((header, index) => (
        <div key={index} className="application-list-header-cell">
          {header}
        </div>
      ))}
    </div>
  );
};

export default ApplicationListHeader;