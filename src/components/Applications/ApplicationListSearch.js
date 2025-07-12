import React from 'react';
import './ApplicationListSearch.css';

const ApplicationListSearch = ({ onSearchTermChange }) => {
  const handleInputChange = (event) => {
    onSearchTermChange(event.target.value);
  };

  return (
    <div className="application-list-search-container">
      <input
        type="text"
        placeholder="Search applications..."
        onChange={handleInputChange}
        className="application-list-search-input"
      />
    </div>
  );
};

export default ApplicationListSearch;