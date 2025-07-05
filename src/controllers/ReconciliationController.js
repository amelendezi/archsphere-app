import { addAllNewApplications, getNewApplicationsCount, undoAddAllNewApplications, assumeAllConflicts, getUnresolvedConflictCount } from '../utils/reconciliationUtility';

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
