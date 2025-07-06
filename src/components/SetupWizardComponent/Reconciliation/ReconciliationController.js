import { addAllNewApplicationsCommand } from '../../../services/command/addAllNewApplicationsCommand';
import { undoAddAllNewApplicationsCommand } from '../../../services/command/undoAllNewApplicationsCommand';
import { resolveAssumeAllApplicationConflictsCommand } from '../../../services/command/resolveAssumeAllApplicationConflictsCommand';
import { unresolveAssumeAllApplicationConflictsCommand } from '../../../services/command/unresolveAssumeAllApplicationConflictsCommand';
import { countUnresolvedConflictsQuery } from '../../../services/query/countUnresolvedConflictsQuery';
import { countNewApplicationsQuery } from '../../../services/query/countNewApplicationsQuery';
import { SETUP_ENV_APPLICATIONS_STORE_NAME, SETUP_NEW_APPLICATIONS_STORE_NAME, SETUP_CONFLICTS_STORE_NAME, SETUP_ADDED_APPLICATIONS_STORE_NAME } from '../../../config/dbConfig';

export const onAddAllNewApplications = async (getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton) => {
  await addAllNewApplicationsCommand();
  const totalAppCount = await getStoreCount(SETUP_ENV_APPLICATIONS_STORE_NAME);
  setTotalApplicationsCount(totalAppCount);
  const newAppCount = await countNewApplicationsQuery();
  setNewApplicationsCount(newAppCount);
  setShowUndoButton(true);
};

export const onUndoAddAllNewApplications = async (getStoreCount, setTotalApplicationsCount, setNewApplicationsCount, setShowUndoButton) => {
  await undoAddAllNewApplicationsCommand();
  const totalAppCount = await getStoreCount(SETUP_ENV_APPLICATIONS_STORE_NAME);
  setTotalApplicationsCount(totalAppCount);
  const newAppCount = await countNewApplicationsQuery();
  setNewApplicationsCount(newAppCount);
  setShowUndoButton(false);
};

export const onAssumeAllConflicts = async (getStoreCount, setConflictCount, setTotalApplicationsCount, setShowUndoAssumeAllButton, setRefreshConflictsTable) => {
  await resolveAssumeAllApplicationConflictsCommand();
  const unresolvedConflicts = await countUnresolvedConflictsQuery();
  setConflictCount(unresolvedConflicts);
  const totalAppCount = await getStoreCount(SETUP_ENV_APPLICATIONS_STORE_NAME);
  setTotalApplicationsCount(totalAppCount);
  setShowUndoAssumeAllButton(true);
  setRefreshConflictsTable(prev => !prev);
};

export const onUndoAssumeAllConflicts = async (getStoreCount, setConflictCount, setTotalApplicationsCount, setShowUndoAssumeAllButton, setRefreshConflictsTable) => {
  await unresolveAssumeAllApplicationConflictsCommand();
  const unresolvedConflicts = await countUnresolvedConflictsQuery();
  setConflictCount(unresolvedConflicts);
  const totalAppCount = await getStoreCount(SETUP_ENV_APPLICATIONS_STORE_NAME);
  setTotalApplicationsCount(totalAppCount);
  setShowUndoAssumeAllButton(false);
  setRefreshConflictsTable(prev => !prev);
};

export const onBackFromReconciliation = async (clearStores, onBack, setSelectedFile, setSelectedNewApplicationsFile, setLoadedCount, setLoadedNewApplicationsCount, setIsNewApplicationsFileValid) => {
  await clearStores([SETUP_ENV_APPLICATIONS_STORE_NAME, SETUP_NEW_APPLICATIONS_STORE_NAME, SETUP_CONFLICTS_STORE_NAME, SETUP_ADDED_APPLICATIONS_STORE_NAME]);
  setSelectedFile(null);
  setSelectedNewApplicationsFile(null);
  setLoadedCount(null);
  setLoadedNewApplicationsCount(null);
  setIsNewApplicationsFileValid(false);
  onBack();
};
