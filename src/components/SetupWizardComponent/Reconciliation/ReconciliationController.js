import { addAllNewApplications, getNewApplicationsCount, undoAddAllNewApplications, assumeAllConflicts, getUnresolvedConflictCount } from '../../../utils/reconciliationUtility';

export const handleAddAllNewApplications = async (getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton) => {
  await addAllNewApplications();
  const totalAppCount = await getStoreCount('env_applications');
  setTotalApplicationsCount(totalAppCount);
  const newAppCount = await getNewApplicationsCount();
  setNewApplicationsCount(newAppCount);
  setShowUndoButton(true);
};

export const handleUndoAddAllNewApplications = async (getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton) => {
  await undoAddAllNewApplications();
  const totalAppCount = await getStoreCount('env_applications');
  setTotalApplicationsCount(totalAppCount);
  const newAppCount = await getNewApplicationsCount();
  setNewApplicationsCount(newAppCount);
  setShowUndoButton(false);
};

export const handleAssumeAllConflicts = async (getStoreCount, setConflictCount, setTotalApplicationsCount) => {
  await assumeAllConflicts();
  const unresolvedConflicts = await getUnresolvedConflictCount();
  setConflictCount(unresolvedConflicts);
  const totalAppCount = await getStoreCount('env_applications');
  setTotalApplicationsCount(totalAppCount);
};

export const handleBackFromReconciliation = async (clearStores, onBack, setSelectedFile, setSelectedNewApplicationsFile, setLoadedCount, setLoadedNewApplicationsCount, setIsNewApplicationsFileValid) => {
  await clearStores(['env_applications', 'new_applications', 'new_env_conflicts', 'rec_new_applications']);
  setSelectedFile(null);
  setSelectedNewApplicationsFile(null);
  setLoadedCount(null);
  setLoadedNewApplicationsCount(null);
  setIsNewApplicationsFileValid(false);
  onBack();
};
