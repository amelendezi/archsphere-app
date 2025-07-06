import ItemList from '../../ItemListComponent/ItemList';
import { getAllApplicationConflictsQuery } from '../../../services/query/getAllApplicationConflictsQuery';

function ConflictsTable({ refreshTrigger }) {
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

  const conflictDataFetcher = async () => {
    return await getAllApplicationConflictsQuery();
  };

  return (
    <div style={{ marginTop: '20px', backgroundColor: 'white', borderRadius: '8px' }}>
      <h3 style={{ color: 'black', padding: '20px 0px 0px 0px', fontSize: '1em', fontWeight: 'normal', textAlign: 'left' }}>Conflict Details</h3>
      <ItemList
        dataFetcher={conflictDataFetcher}
        columns={conflictColumns}
        listMaxWidth="100%"
        refreshTrigger={refreshTrigger}
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
