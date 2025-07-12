import React from 'react';
import ApplicationListCell from './ApplicationListCell';
import './ApplicationListRow.css';

const ApplicationListRow = ({ record, onRowClick }) => {
  return (
    <div className="application-list-row" onClick={() => onRowClick(record)}>
      {Object.values(record).map((value, index) => (
        <ApplicationListCell key={index} value={value} />
      ))}
    </div>
  );
};

export default ApplicationListRow;