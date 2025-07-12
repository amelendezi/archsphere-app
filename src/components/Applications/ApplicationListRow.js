import React from 'react';
import ApplicationListCell from './ApplicationListCell';
import './ApplicationListRow.css';

const ApplicationListRow = ({ record, onRowClick, isSelected }) => {
  return (
    <div className={`application-list-row ${isSelected ? 'selected' : ''}`} onClick={() => onRowClick(record)}>
      {Object.values(record).map((value, index) => (
        <ApplicationListCell key={index} value={value} />
      ))}
    </div>
  );
};

export default ApplicationListRow;