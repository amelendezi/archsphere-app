import React from 'react';
import './ApplicationListCell.css';

const ApplicationListCell = ({ value }) => {
  return (
    <div className="application-list-cell">
      {value}
    </div>
  );
};

export default ApplicationListCell;