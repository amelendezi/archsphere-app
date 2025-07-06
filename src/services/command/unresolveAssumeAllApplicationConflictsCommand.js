import { openDB } from 'idb';
import { unresolveSingleApplicationConflictCommand } from './unresolveSingleApplicationConflictCommand';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const unresolveAssumeAllApplicationConflictsCommand = async () => {
  const db = await getDbPromise();
  const tx = db.transaction(['new_env_conflicts', 'env_applications'], 'readwrite');
  const newEnvConflictsStore = tx.objectStore('new_env_conflicts');

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
