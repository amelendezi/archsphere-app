import { openDB } from 'idb';
import { DB_NAME, DB_VERSION, SETUP_CONFLICTS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const getAllConflictsQuery = async () => {
  const db = await getDbPromise();
  const tx = db.transaction(SETUP_CONFLICTS_STORE_NAME, 'readonly');
  const store = tx.objectStore(SETUP_CONFLICTS_STORE_NAME);
  const allConflicts = await store.getAll();
  return allConflicts;
};
