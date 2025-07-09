import { useState, useEffect } from 'react';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { countNewApplicationsQuery } from '../../../services/query/countNewApplicationsQuery';
import { countUnresolvedConflictsQuery } from '../../../services/query/countUnresolvedConflictsQuery';
import { countResolvedApplicationConflictsQuery } from '../../../services/query/countResolvedApplicationConflictsQuery';
import { onAddAllNewApplications, onUndoAddAllNewApplications, onAssumeAllConflicts, onUndoAssumeAllConflicts, onBackFromReconciliation } from './ReconciliationController';
import { SETUP_ENV_APPLICATIONS_STORE_NAME } from '../../../config/dbConfig';
import ConflictsTable from '../ConflictsTable/ConflictsTable';

function Reconciliation({ onBack, onClose, setSelectedFile, setSelectedNewApplicationsFile, setLoadedCount, setLoadedNewApplicationsCount, setIsNewApplicationsFileValid }) {
  const { getStoreCount, clearStores } = useIndexedDB();
  const [newApplicationsCount, setNewApplicationsCount] = useState(0);
  const [totalApplicationsCount, setTotalApplicationsCount] = useState(0);
  const [conflictCount, setConflictCount] = useState(0);
  const [resolvedConflictCount, setResolvedConflictCount] = useState(0);
  const [showTooltipNewApplications, setShowTooltipNewApplications] = useState(false);
  const [showTooltipConflicts, setShowTooltipConflicts] = useState(false);
  const [showTooltipEnvironmentApplications, setShowTooltipEnvironmentApplications] = useState(false);
  const [showUndoButton, setShowUndoButton] = useState(false);
  const [showUndoAssumeAllButton, setShowUndoAssumeAllButton] = useState(false);
  const [refreshConflictsTable, setRefreshConflictsTable] = useState(false);

  useEffect(() => {
    const fetchCountsAndConflicts = async () => {
      const newAppCount = await countNewApplicationsQuery();
      setNewApplicationsCount(newAppCount);
  
      const totalAppCount = await getStoreCount(SETUP_ENV_APPLICATIONS_STORE_NAME);
      setTotalApplicationsCount(totalAppCount);

      const unresolvedConflicts = await countUnresolvedConflictsQuery();
      setConflictCount(unresolvedConflicts);

      const resolvedConflicts = await countResolvedApplicationConflictsQuery();
      setResolvedConflictCount(resolvedConflicts);
    };
    fetchCountsAndConflicts();
  }, [getStoreCount, conflictCount, refreshConflictsTable]);

  useEffect(() => {
    if (conflictCount === 0 && resolvedConflictCount > 0) {
      setShowUndoAssumeAllButton(true);
    } else {
      setShowUndoAssumeAllButton(false);
    }
  }, [conflictCount, resolvedConflictCount]);
  return (
    <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px' }}>
      <h2 style={{ color: 'black' }}>Reconcile New Applications</h2>
      <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', textAlign: 'center', margin: '20px 0' }}>
        
        {/* New Applications Tile */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', width: '20%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <div
              style={{ position: 'relative', display: 'inline-block' }}
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
            <h3 style={{ fontWeight: 'normal', margin: 0 }}>New Applications</h3>
          </div>
          <p style={{ fontSize: '2.5em', margin: '10px 0' }}>{newApplicationsCount}</p>
          <div>
            {showUndoButton ? (
              <button className="reconciliationButtonPrimary" style={{ backgroundColor: 'grey' }} onClick={() => onUndoAddAllNewApplications(getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton)}>
                Undo Add All
              </button>
            ) : (
              <button className="reconciliationButtonPrimary" onClick={() => onAddAllNewApplications(getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton)}>
                Add All
              </button>
            )}
          </div>
        </div>

        {/* Conflicts Tile */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', width: '20%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <div
              style={{ position: 'relative', display: 'inline-block' }}
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
            <h3 style={{ fontWeight: 'normal', margin: 0 }}>Conflicts</h3>
          </div>
          <p style={{ fontSize: '2.5em', margin: '10px 0' }}>{conflictCount}</p>
          <div>
            {showUndoAssumeAllButton ? (
              <button className="reconciliationButtonPrimary" style={{ backgroundColor: 'grey' }} onClick={() => onUndoAssumeAllConflicts(getStoreCount, setConflictCount, setTotalApplicationsCount, setShowUndoAssumeAllButton, setRefreshConflictsTable)}>
                Undo Assume All
              </button>
            ) : (
              <button className="reconciliationButtonPrimary" onClick={() => onAssumeAllConflicts(getStoreCount, setConflictCount, setTotalApplicationsCount, setShowUndoAssumeAllButton, setRefreshConflictsTable)}>
                Assume All
              </button>
            )}
          </div>
        </div>

        {/* Environment Applications Tile */}
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', width: '20%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <div
              style={{ position: 'relative', display: 'inline-block' }}
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
            <h3 style={{ fontWeight: 'normal', margin: 0 }}>Environment Applications</h3>
          </div>
          <p style={{ fontSize: '2.5em', margin: '10px 0' }}>{totalApplicationsCount}</p>
          <div style={{ height: '30px' }}>{/* Placeholder for spacing, to match other tiles */}</div>
        </div>

      </div>
      
      <div style={{ width: '100%', margin: '0 auto' }}>
        <ConflictsTable refreshTrigger={refreshConflictsTable} setRefreshConflictsTable={setRefreshConflictsTable} />
      </div>
      <div style={{ flexGrow: 1 }}></div>
      <div style={{ borderBottom: '1px solid grey', width: '100%', margin: '20px auto 0 auto' }}></div>
      <div className="UploadState-buttons-row">
        <button className="UploadState-button UploadState-button-close" onClick={() => onBackFromReconciliation(clearStores, onBack, setSelectedFile, setSelectedNewApplicationsFile, setLoadedCount, setLoadedNewApplicationsCount, setIsNewApplicationsFileValid)}>Back</button>
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