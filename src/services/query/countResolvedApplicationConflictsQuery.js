import { openDB } from 'idb';

import { DB_NAME, DB_VERSION } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const countResolvedApplicationConflictsQuery = async () => {
  const db = await getDbPromise();
  const tx = db.transaction('new_env_conflicts', 'readonly');
  const store = tx.objectStore('new_env_conflicts');
  return store.count();
};