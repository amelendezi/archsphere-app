import React, { useState, useEffect } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { compareNewWithEnvironmentApplications } from '../utils/compareNewWithEnvironmentApplications';

function Reconciliation({ onBack, onClose }) {
  const { getStoreCount } = useIndexedDB();
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
  const [conflictCount, setConflictCount] = useState(0);

  useEffect(() => {
    const fetchCountsAndConflicts = async () => {
      const newAppCount = await getStoreCount('new_applications');
      setNewApplicationsCount(newAppCount);

      const totalAppCount = await getStoreCount('env_applications');
      setTotalApplicationsCount(totalAppCount);

      const conflictsFound = await compareNewWithEnvironmentApplications();
      setConflictCount(conflictsFound);
    };
    fetchCountsAndConflicts();
  }, [getStoreCount]);
  return (
    <div style={{ backgroundColor: '#f8f8f8', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: 'black' }}>Reconcile New Applications</h2>      
      <table style={{ width: '80%', borderCollapse: 'collapse', border: '1px solid #ddd', margin: '0 auto' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'normal' }}>New Applications</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'normal' }}>Conflicts</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'normal' }}>Total Applications</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{newApplicationsCount}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{conflictCount}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{totalApplicationsCount}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}></td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}></td>
          </tr>
        </tbody>
      </table>      
      <div style={{ flexGrow: 1 }}></div>
      <div style={{ borderBottom: '1px solid grey', width: '80%', margin: '20px auto 0 auto' }}></div>
      <div className="UploadState-buttons-row">
        <button className="UploadState-button UploadState-button-close" onClick={onBack}>Back</button>
        <button
          className="UploadState-button UploadState-button-next"
          onClick={onClose}
        >
          Finish
        </button>
      </div>
    </div>
  );
}

export default Reconciliation;