import { openDB } from 'idb';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const countUnresolvedConflictsQuery = async () => {
  const db = await getDbPromise();
  const tx = db.transaction('new_env_conflicts', 'readonly');
  const store = tx.objectStore('new_env_conflicts');
  const allConflicts = await store.getAll();
  return allConflicts.filter(conflict => conflict.Status === 'unresolved').length;
};