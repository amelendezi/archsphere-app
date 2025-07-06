import React, { useState, useEffect } from 'react';
import { openDB } from 'idb';
import { DB_NAME, DB_VERSION, SETUP_CONFLICTS_STORE_NAME } from '../../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

function ConflictsTable({ refreshTrigger }) {
  const [conflicts, setConflicts] = useState([]);

  useEffect(() => {
    const fetchConflicts = async () => {
      const db = await getDbPromise();
      const tx = db.transaction(SETUP_CONFLICTS_STORE_NAME, 'readonly');
      const store = tx.objectStore(SETUP_CONFLICTS_STORE_NAME);
      const allConflicts = await store.getAll();
      setConflicts(allConflicts);
    };

    fetchConflicts();
  }, [refreshTrigger]);

  return (
    <div style={{ marginTop: '20px', backgroundColor: '#f8f8f8', borderRadius: '8px' }}>
      <h3 style={{ color: 'black', padding: '20px 20px 0px 20px' }}>Conflict Details</h3>
      <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #ddd', padding: '0px 20px 20px 20px' }}>
        <thead>
          <tr>            
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', fontSize: '0.9em' }}>Business Application ID</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', fontSize: '0.9em' }}>Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', fontSize: '0.9em' }}>Property Name</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', fontSize: '0.9em' }}>Old Value</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', fontSize: '0.9em' }}>New Value</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', fontSize: '0.9em' }}>Status</th>
          </tr>
        </thead>
        <tbody>
          {conflicts.map((conflict) => (
            <tr key={conflict.ID}>              
              <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '0.8em' }}>{conflict['Business Application ID']}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '0.8em' }}>{conflict.Name}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '0.8em' }}>{conflict['Property Name']}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '0.8em' }}>{conflict['Old Value']}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '0.8em' }}>{conflict['New Value']}</td>
              <td style={{ border: '1px solid #ddd', padding: '8px', fontSize: '0.8em' }}>{conflict.Status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ConflictsTable;
