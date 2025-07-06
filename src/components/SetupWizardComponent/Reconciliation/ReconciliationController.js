import { addAllNewApplicationsCommand } from '../../../services/command/addAllNewApplicationsCommand';
import { undoAddAllNewApplicationsCommand } from '../../../services/command/undoAllNewApplicationsCommand';
import { resolveAssumeAllApplicationConflictsCommand } from '../../../services/command/resolveAssumeAllApplicationConflictsCommand';
import { unresolveAssumeAllApplicationConflictsCommand } from '../../../services/command/unresolveAssumeAllApplicationConflictsCommand';
import { countUnresolvedConflictsQuery } from '../../../services/query/countUnresolvedConflictsQuery';
import { countNewApplicationsQuery } from '../../../services/query/countNewApplicationsQuery';

export const onAddAllNewApplications = async (getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton) => {
  await addAllNewApplicationsCommand();
  const totalAppCount = await getStoreCount('env_applications');
  setTotalApplicationsCount(totalAppCount);
  const newAppCount = await countNewApplicationsQuery();
  setNewApplicationsCount(newAppCount);
  setShowUndoButton(true);
};

export const onUndoAddAllNewApplications = async (getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton) => {
  await undoAddAllNewApplicationsCommand();
  const totalAppCount = await getStoreCount('env_applications');
  setTotalApplicationsCount(totalAppCount);
  const newAppCount = await countNewApplicationsQuery();
  setNewApplicationsCount(newAppCount);
  setShowUndoButton(false);
};

export const onAssumeAllConflicts = async (getStoreCount, setConflictCount, setTotalApplicationsCount, setShowUndoAssumeAllButton) => {
  await resolveAssumeAllApplicationConflictsCommand();
  const unresolvedConflicts = await countUnresolvedConflictsQuery();
  setConflictCount(unresolvedConflicts);
  const totalAppCount = await getStoreCount('env_applications');
  setTotalApplicationsCount(totalAppCount);
  setShowUndoAssumeAllButton(true);
};

export const onUndoAssumeAllConflicts = async (getStoreCount, setConflictCount, setTotalApplicationsCount, setShowUndoAssumeAllButton) => {
  await unresolveAssumeAllApplicationConflictsCommand();
  const unresolvedConflicts = await countUnresolvedConflictsQuery();
  setConflictCount(unresolvedConflicts);
  const totalAppCount = await getStoreCount('env_applications');
  setTotalApplicationsCount(totalAppCount);
  setShowUndoAssumeAllButton(false);
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
