import React, { useState, useCallback } from 'react';
import ItemList from '../../ItemListComponent/ItemList';
import { getAllApplicationConflictsQuery } from '../../../services/query/getAllApplicationConflictsQuery';
import { resolveSingleApplicationConflictCommand } from '../../../services/command/resolveSingleApplicationConflictCommand';
import { unresolveSingleApplicationConflictCommand } from '../../../services/command/unresolveSingleApplicationConflictCommand';
import { resolveByIgnoringSingleApplicationConflictCommand } from '../../../services/command/resolveByIgnoringSingleApplicationConflictCommand';
import { unresolveByIgnoringSingleApplicationConflictCommand } from '../../../services/command/unresolveByIgnoringSingleApplicationConflictCommand';

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

  const handleAction = useCallback(async (actionType, item) => {
    const conflictId = `${item['Business Application ID']}-${item['Property Name']}`;
    let newStatus = '';

    switch (actionType) {
      case 'resolve':
        await resolveSingleApplicationConflictCommand(undefined, item['Business Application ID'], item['Property Name'], item['New Value']);
        newStatus = 'resolved';
        break;
      case 'ignore':
        await resolveByIgnoringSingleApplicationConflictCommand(item['Business Application ID'], item['Property Name']);
        newStatus = 'resolved';
        break;
      case 'undoResolve':
        await unresolveSingleApplicationConflictCommand(undefined, item['Business Application ID'], item['Property Name'], item['Old Value']);
        newStatus = 'unresolved';
        break;
      case 'undoIgnore':
        await unresolveByIgnoringSingleApplicationConflictCommand(item['Business Application ID'], item['Property Name']);
        newStatus = 'unresolved';
        break;
      default:
        return;
    }

    setRowActionStates(prev => {
      const newState = new Map(prev);
      newState.set(conflictId, newStatus);
      return newState;
    });

    // Trigger refresh of the ItemList
    // This will cause ItemList to re-fetch data and update the displayed status
    // and also re-render the action buttons based on new rowActionStates
    setRefreshConflictsTable(prev => !prev);
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
          <button onClick={() => onAction(undoActionType, item)}>Undo</button>
        );
      } else {
        return (
          <>
            <button onClick={() => onAction('resolve', item)}>Resolve</button>
            <button onClick={() => onAction('ignore', item)} style={{ marginLeft: '5px' }}>Ignore</button>
          </>
        );
      }
    },
    onAction: handleAction, // Pass the handler to ItemList
  };

  const conflictDataFetcher = useCallback(async () => {
    return await getAllApplicationConflictsQuery();
  }, []);

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
