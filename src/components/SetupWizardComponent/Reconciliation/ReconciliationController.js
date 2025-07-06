import { addAllNewApplications, undoAddAllNewApplications, assumeAllConflicts } from '../../../utils/reconciliationUtility';
import { countUnresolvedConflictsQuery } from '../../../services/query/countUnresolvedConflictsQuery';
import { countNewApplicationsQuery } from '../../../services/query/countNewApplicationsQuery';

export const onAddAllNewApplications = async (getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton) => {
  await addAllNewApplications();
  const totalAppCount = await getStoreCount('env_applications');
  setTotalApplicationsCount(totalAppCount);
  const newAppCount = await countNewApplicationsQuery();
  setNewApplicationsCount(newAppCount);
  setShowUndoButton(true);
};

export const onUndoAddAllNewApplications = async (getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton) => {
  await undoAddAllNewApplications();
  const totalAppCount = await getStoreCount('env_applications');
  setTotalApplicationsCount(totalAppCount);
  const newAppCount = await countNewApplicationsQuery();
  setNewApplicationsCount(newAppCount);
  setShowUndoButton(false);
};

export const onAssumeAllConflicts = async (getStoreCount, setConflictCount, setTotalApplicationsCount) => {
  await assumeAllConflicts();
  const unresolvedConflicts = await countUnresolvedConflictsQuery();
  setConflictCount(unresolvedConflicts);
  const totalAppCount = await getStoreCount('env_applications');
  setTotalApplicationsCount(totalAppCount);
};

export const onBackFromReconciliation = async (clearStores, onBack, setSelectedFile, setSelectedNewApplicationsFile, setLoadedCount, setLoadedNewApplicationsCount, setIsNewApplicationsFileValid) => {
  await clearStores(['env_applications', 'new_applications', 'new_env_conflicts', 'rec_new_applications']);
  setSelectedFile(null);
  setSelectedNewApplicationsFile(null);
  setLoadedCount(null);
  setLoadedNewApplicationsCount(null);
  setIsNewApplicationsFileValid(false);
  onBack();
};
