import React, { useState, useEffect } from 'react';
import { useIndexedDB } from '../hooks/useIndexedDB';
import { getNewApplicationsCount, addAllNewApplications, undoAddAllNewApplications, assumeAllConflicts, getUnresolvedConflictCount } from '../utils/reconciliationUtility';

function Reconciliation({ onBack, onClose }) {
  const { getStoreCount } = useIndexedDB();
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
  const [conflictCount, setConflictCount] = useState(0);
  const [showTooltipNewApplications, setShowTooltipNewApplications] = useState(false);
  const [showTooltipConflicts, setShowTooltipConflicts] = useState(false);
  const [showTooltipEnvironmentApplications, setShowTooltipEnvironmentApplications] = useState(false);
  const [showUndoButton, setShowUndoButton] = useState(false);

  const handleAddAllNewApplications = async () => {
    await addAllNewApplications();
    const totalAppCount = await getStoreCount('env_applications');
    setTotalApplicationsCount(totalAppCount);
    const newAppCount = await getNewApplicationsCount();
    setNewApplicationsCount(newAppCount);
    setShowUndoButton(true);
  };

  const handleUndoAddAllNewApplications = async () => {
    await undoAddAllNewApplications();
    const totalAppCount = await getStoreCount('env_applications');
    setTotalApplicationsCount(totalAppCount);
    const newAppCount = await getNewApplicationsCount();
    setNewApplicationsCount(newAppCount);
    setShowUndoButton(false);
  };

  const handleAssumeAllConflicts = async () => {
    await assumeAllConflicts();
    const unresolvedConflicts = await getUnresolvedConflictCount();
    setConflictCount(unresolvedConflicts);
    const totalAppCount = await getStoreCount('env_applications');
    setTotalApplicationsCount(totalAppCount);
  };

  useEffect(() => {
    const fetchCountsAndConflicts = async () => {
      const newAppCount = await getNewApplicationsCount();
      setNewApplicationsCount(newAppCount);

      const totalAppCount = await getStoreCount('env_applications');
      setTotalApplicationsCount(totalAppCount);

      const unresolvedConflicts = await getUnresolvedConflictCount();
      setConflictCount(unresolvedConflicts);
    };
    fetchCountsAndConflicts();
  }, [getStoreCount]);
  return (
    <div style={{ backgroundColor: '#f8f8f8', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: 'black' }}>Reconcile New Applications</h2>      
      <table style={{ width: '80%', borderCollapse: 'collapse', border: '1px solid #ddd', margin: '0 auto' }}>
        <thead>
          <tr>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'normal' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                <div
                  style={{ position: 'relative', display: 'inline-block', marginRight: '5px' }}
                  onMouseEnter={() => setShowTooltipNewApplications(true)}
                  onMouseLeave={() => setShowTooltipNewApplications(false)}
                >
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #4285F4', textAlign: 'center', lineHeight: '14px', fontSize: '12px', fontWeight: 'bold', cursor: 'help', color: '#4285F4' }}>i</span>
                  <span style={{
                    width: '250px',
                    backgroundColor: '#E0E0E0',
                    color: '#000',
                    textAlign: 'left',
                    borderRadius: '6px',
                    padding: '10px',
                    position: 'absolute',
                    zIndex: '1',
                    bottom: '125%',
                    left: '50%',
                    marginLeft: '-125px',
                    opacity: showTooltipNewApplications ? '1' : '0',
                    visibility: showTooltipNewApplications ? 'visible' : 'hidden',
                    transition: 'opacity 0.375s',
                    border: '1px solid #E0E0E0',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    fontSize: '0.8em'
                  }}>
                    Number of new applications that can be added to the environment applications, that posses no conflict with any existing applications.
                  </span>
                </div>
                New Applications
              </div>
            </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'normal' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                <div
                  style={{ position: 'relative', display: 'inline-block', marginRight: '5px' }}
                  onMouseEnter={() => setShowTooltipConflicts(true)}
                  onMouseLeave={() => setShowTooltipConflicts(false)}
                >
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #4285F4', textAlign: 'center', lineHeight: '14px', fontSize: '12px', fontWeight: 'bold', cursor: 'help', color: '#4285F4' }}>i</span>
                  <span style={{
                    width: '250px',
                    backgroundColor: '#E0E0E0',
                    color: '#000',
                    textAlign: 'left',
                    borderRadius: '6px',
                    padding: '10px',
                    position: 'absolute',
                    zIndex: '1',
                    bottom: '125%',
                    left: '50%',
                    marginLeft: '-125px',
                    opacity: showTooltipConflicts ? '1' : '0',
                    visibility: showTooltipConflicts ? 'visible' : 'hidden',
                    transition: 'opacity 0.375s',
                    border: '1px solid #E0E0E0',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    fontSize: '0.8em'
                  }}>
                    Number of applications that posses conflicting values with environment applications.
                  </span>
                </div>
                Conflicts
              </div>
            </th>
            <th style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'normal' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', justifyContent: 'center' }}>
                <div
                  style={{ position: 'relative', display: 'inline-block', marginRight: '5px' }}
                  onMouseEnter={() => setShowTooltipEnvironmentApplications(true)}
                  onMouseLeave={() => setShowTooltipEnvironmentApplications(false)}
                >
                  <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #4285F4', textAlign: 'center', lineHeight: '14px', fontSize: '12px', fontWeight: 'bold', cursor: 'help', color: '#4285F4' }}>i</span>
                  <span style={{
                    width: '250px',
                    backgroundColor: '#E0E0E0',
                    color: '#000',
                    textAlign: 'left',
                    borderRadius: '6px',
                    padding: '10px',
                    position: 'absolute',
                    zIndex: '1',
                    bottom: '125%',
                    left: '50%',
                    marginLeft: '-125px',
                    opacity: showTooltipEnvironmentApplications ? '1' : '0',
                    visibility: showTooltipEnvironmentApplications ? 'visible' : 'hidden',
                    transition: 'opacity 0.375s',
                    border: '1px solid #E0E0E0',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                    fontSize: '0.8em'
                  }}>
                    Number of applications currently in the environment.
                  </span>
                </div>
                Environment Applications
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{newApplicationsCount}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{conflictCount}</td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{totalApplicationsCount}</td>
          </tr>
          <tr>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              {showUndoButton ? (
                <button className="reconciliationButtonPrimary" style={{ backgroundColor: 'grey' }} onClick={handleUndoAddAllNewApplications}>
                  Undo Add All
                </button>
              ) : (
                <button className="reconciliationButtonPrimary" onClick={handleAddAllNewApplications}>
                  Add All
                </button>
              )}
            </td>
            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
              <button className="reconciliationButtonPrimary" onClick={handleAssumeAllConflicts}>
                Assume All
              </button>
            </td>
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