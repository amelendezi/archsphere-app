import React from 'react';
import ItemList from '../../ItemListComponent/ItemList';
import { getAllConflictsQuery } from '../../../services/query/getAllConflictsQuery';

function ConflictsTable({ refreshTrigger }) {
  const conflictColumns = [
    {
      key: 'Business Application ID',
      header: 'Business Application ID',
      minWidth: '120px',
      flexGrow: 2,
    },
    {
      key: 'Name',
      header: 'Name',
      minWidth: '100px',
      flexGrow: 2,
    },
    {
      key: 'Property Name',
      header: 'Property Name',
      minWidth: '100px',
      flexGrow: 1,
    },
    {
      key: 'Old Value',
      header: 'Old Value',
      minWidth: '80px',
      flexGrow: 1,
    },
    {
      key: 'New Value',
      header: 'New Value',
      minWidth: '80px',
      flexGrow: 1,
    },
    {
      key: 'Status',
      header: 'Status',
      minWidth: '80px',
      maxWidth: '100px',
      flexGrow: 0,
    },
  ];

  const conflictDataFetcher = async () => {
    return await getAllConflictsQuery();
  };

  return (
    <div style={{ marginTop: '20px', backgroundColor: '#f8f8f8', borderRadius: '8px', padding: '0px 20px 20px 20px' }}>
      <h3 style={{ color: 'black', padding: '20px 0px 0px 0px' }}>Conflict Details</h3>
      <ItemList
        dataFetcher={conflictDataFetcher}
        columns={conflictColumns}
        listMaxWidth="100%"
        refreshTrigger={refreshTrigger}
        headerStyle={{
          border: '1px solid #ddd',
          padding: '8px',
          fontWeight: 'bold',
          fontSize: '0.9em',
          backgroundColor: '#f2f2f2',
        }}
        rowStyle={{
          border: '1px solid #ddd',
        }}
        cellStyle={{
          border: '1px solid #ddd',
          padding: '8px',
          fontSize: '0.8em',
        }}
      />
    </div>
  );
}

export default ConflictsTable;
