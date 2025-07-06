import { openDB } from 'idb';
import { resolveSingleConflictCommand } from './resolveSingleApplicationConflictCommand';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const resolveAssumeAllApplicationConflictsCommand = async () => {
  const db = await getDbPromise();
  const tx = db.transaction(['new_env_conflicts', 'env_applications'], 'readwrite');
  const newEnvConflictsStore = tx.objectStore('new_env_conflicts');

  const conflicts = await newEnvConflictsStore.getAll();

  let resolvedConflictsCount = 0;
  for (const conflict of conflicts) {
    if (conflict.Status === 'unresolved') {
      await resolveSingleConflictCommand(tx, conflict['Business Application ID'], conflict['Property Name'], conflict['New Value']);
      resolvedConflictsCount++;
    }
  }

  await tx.done;
  return resolvedConflictsCount;
};