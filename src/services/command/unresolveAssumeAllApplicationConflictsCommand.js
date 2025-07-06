import { openDB } from 'idb';
import { unresolveSingleApplicationConflictCommand } from './unresolveSingleApplicationConflictCommand';

import { DB_NAME, DB_VERSION, ENV_APPLICATIONS_STORE_NAME, NEW_ENV_CONFLICTS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const unresolveAssumeAllApplicationConflictsCommand = async () => {
  const db = await getDbPromise();
  const tx = db.transaction([NEW_ENV_CONFLICTS_STORE_NAME, ENV_APPLICATIONS_STORE_NAME], 'readwrite');
  const newEnvConflictsStore = tx.objectStore(NEW_ENV_CONFLICTS_STORE_NAME);

  const conflicts = await newEnvConflictsStore.getAll();

  let unresolvedConflictsCount = 0;
  for (const conflict of conflicts) {
    if (conflict.Status === 'resolved') {
      await unresolveSingleApplicationConflictCommand(tx, conflict['Business Application ID'], conflict['Property Name'], conflict['Old Value']);
      unresolvedConflictsCount++;
    }
  }

  await tx.done;
  return unresolvedConflictsCount;
};
