import React, { useState } from 'react';
import './ApplicationsListSection.css';
import ItemList from '../ItemListComponent/ItemList';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { SETUP_ENV_APPLICATIONS_STORE_NAME } from '../../config/dbConfig';

const ApplicationsListSection = () => {
  const { getAllApplications } = useIndexedDB();
  const [selectedApplication, setSelectedApplication] = useState(null);

  const dataFetcher = async () => {
    return await getAllApplications(SETUP_ENV_APPLICATIONS_STORE_NAME);
  };

  const columns = [
    { key: 'Business Application ID', header: 'Business Application ID', minWidth: '150px', flexGrow: 1 },
    { key: 'Name', header: 'Name', minWidth: '150px', flexGrow: 2 },
    { key: 'Business Application Status', header: 'Business Application Status', minWidth: '150px', flexGrow: 1 },
  ];

  const handleRowClick = (item) => {
    setSelectedApplication(item);
  };

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
          <ItemList dataFetcher={dataFetcher} columns={columns} onRowClick={handleRowClick} selectedItem={selectedApplication} />
        </div>
      </div>

      {/* Applications Detail Pane */}
      <div className="applications-detail-pane">
        {selectedApplication ? (
          <>
            <h2>{selectedApplication.Name}</h2>
            <div className="application-details">
              {Object.entries(selectedApplication).map(([key, value]) => (
                key !== 'Name' && <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
            </div>
          </>
        ) : (
          <h3>Applications Detail</h3>
        )}
      </div>
    </div>
  );
};

export default ApplicationsListSection;
