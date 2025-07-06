import { addAllNewApplicationsCommand } from '../../../services/command/addAllNewApplicationsCommand';
import { undoAddAllNewApplicationsCommand } from '../../../services/command/undoAllNewApplicationsCommand';
import { resolveAssumeAllApplicationConflictsCommand } from '../../../services/command/resolveAssumeAllApplicationConflictsCommand';
import { unresolveAssumeAllApplicationConflictsCommand } from '../../../services/command/unresolveAssumeAllApplicationConflictsCommand';
import { countUnresolvedConflictsQuery } from '../../../services/query/countUnresolvedConflictsQuery';
import { countNewApplicationsQuery } from '../../../services/query/countNewApplicationsQuery';
import { ENV_APPLICATIONS_STORE_NAME, NEW_APPLICATIONS_STORE_NAME, NEW_ENV_CONFLICTS_STORE_NAME, REC_NEW_APPLICATIONS_STORE_NAME } from '../../../config/dbConfig';

export const onAddAllNewApplications = async (getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton) => {
  await addAllNewApplicationsCommand();
  const totalAppCount = await getStoreCount(ENV_APPLICATIONS_STORE_NAME);
  setTotalApplicationsCount(totalAppCount);
  const newAppCount = await countNewApplicationsQuery();
  setNewApplicationsCount(newAppCount);
  setShowUndoButton(true);
};

export const onUndoAddAllNewApplications = async (getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton) => {
  await undoAddAllNewApplicationsCommand();
  const totalAppCount = await getStoreCount(ENV_APPLICATIONS_STORE_NAME);
  setTotalApplicationsCount(totalAppCount);
  const newAppCount = await countNewApplicationsQuery();
  setNewApplicationsCount(newAppCount);
  setShowUndoButton(false);
};

export const onAssumeAllConflicts = async (getStoreCount, setConflictCount, setTotalApplicationsCount, setShowUndoAssumeAllButton) => {
  await resolveAssumeAllApplicationConflictsCommand();
  const unresolvedConflicts = await countUnresolvedConflictsQuery();
  setConflictCount(unresolvedConflicts);
  const totalAppCount = await getStoreCount(ENV_APPLICATIONS_STORE_NAME);
  setTotalApplicationsCount(totalAppCount);
  setShowUndoAssumeAllButton(true);
};

export const onUndoAssumeAllConflicts = async (getStoreCount, setConflictCount, setTotalApplicationsCount, setShowUndoAssumeAllButton) => {
  await unresolveAssumeAllApplicationConflictsCommand();
  const unresolvedConflicts = await countUnresolvedConflictsQuery();
  setConflictCount(unresolvedConflicts);
  const totalAppCount = await getStoreCount(ENV_APPLICATIONS_STORE_NAME);
  setTotalApplicationsCount(totalAppCount);
  setShowUndoAssumeAllButton(false);
};

export const onBackFromReconciliation = async (clearStores, onBack, setSelectedFile, setSelectedNewApplicationsFile, setLoadedCount, setLoadedNewApplicationsCount, setIsNewApplicationsFileValid) => {
  await clearStores([ENV_APPLICATIONS_STORE_NAME, NEW_APPLICATIONS_STORE_NAME, NEW_ENV_CONFLICTS_STORE_NAME, REC_NEW_APPLICATIONS_STORE_NAME]);
  setSelectedFile(null);
  setSelectedNewApplicationsFile(null);
  setLoadedCount(null);
  setLoadedNewApplicationsCount(null);
  setIsNewApplicationsFileValid(false);
  onBack();
};
