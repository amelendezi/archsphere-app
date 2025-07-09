import React, { useState, useCallback } from 'react';
import ItemList from '../../ItemListComponent/ItemList';
import { handleAction as handleConflictAction, conflictDataFetcher } from './ConflictsTableController';

function ConflictsTable({ refreshTrigger, setRefreshConflictsTable }) {
  const [rowActionStates, setRowActionStates] = useState(new Map());
  const conflictColumns = [
    {
      key: 'Business Application ID',
      header: 'ID',
      minWidth: '60px',
      maxWidth: '65px',
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
      header: 'Property',
      minWidth: '100px',
      flexGrow: 1,
    },
    {
      key: 'Old Value',
      header: 'Old',
      minWidth: '80px',
      flexGrow: 1,
    },
    {
      key: 'New Value',
      header: 'New',
      minWidth: '80px',
      flexGrow: 1,
    },
    {
      key: 'Status',
      header: 'Status',
      minWidth: '110px',
      flexGrow: 0,
      cellConditionalStyle: (item, columnKey) => {
        if (columnKey === 'Status') {
          return {
            color: item.Status === 'resolved' ? 'green' : 'red',
          };
        }
        return {};
      },
    },
  ];

  const handleAction = useCallback((actionType, item) => {
    handleConflictAction(actionType, item, setRowActionStates, setRefreshConflictsTable);
  }, [setRefreshConflictsTable]);

  const actionsColumn = {
    header: 'Actions',
    width: '200px', // Fixed width for actions column
    renderCell: (item, onAction) => {
      const conflictId = `${item['Business Application ID']}-${item['Property Name']}`;
      const currentStatus = rowActionStates.get(conflictId) || item.Status; // Use local state or item status

      if (currentStatus === 'resolved' || currentStatus === 'ignored') {
        const undoActionType = currentStatus === 'resolved' ? 'undoResolve' : 'undoIgnore';
        return (
          <button className="reconciliationButtonPrimary" style={{ backgroundColor: 'grey' }} onClick={() => onAction(undoActionType, item)}>Undo</button>
        );
      } else {
        return (
          <>
            <button className="reconciliationButtonPrimary" onClick={() => onAction('resolve', item)}>Resolve</button>
            <button className="reconciliationButtonPrimary" onClick={() => onAction('ignore', item)} style={{ marginLeft: '5px', backgroundColor: 'white', color: 'black' }}>Ignore</button>
          </>
        );
      }
    },
    onAction: handleAction, // Pass the handler to ItemList
  };

  return (
    <div style={{ marginTop: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
      <h3 style={{ color: 'black', padding: '20px 0px 0px 0px', fontSize: '1em', fontWeight: 'normal', textAlign: 'left' }}>Conflict Details</h3>
      <ItemList
        dataFetcher={conflictDataFetcher}
        columns={conflictColumns}
        listMaxWidth="100%"
        refreshTrigger={refreshTrigger}
        actionsColumn={actionsColumn} // Pass the actionsColumn here
        headerStyle={{
          border: '1px solid #ddd',
          padding: '8px 20px',
          fontWeight: 'bold',
          fontSize: '0.9em',
          backgroundColor: '#f2f2f2',
        }}
        rowStyle={{
          border: '1px solid #ddd',
        }}
        cellStyle={{
          border: '1px solid #ddd',
          padding: '8px 20px',
          fontSize: '0.8em',
        }}
      />
    </div>
  );
}

export default ConflictsTable;
