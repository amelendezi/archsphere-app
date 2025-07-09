import { openDB } from 'idb';
import { DB_NAME, DB_VERSION, SETUP_CONFLICTS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const unresolveByIgnoringSingleApplicationConflictCommand = async (applicationId, propertyName) => {
  const db = await getDbPromise();
  const tx = db.transaction(SETUP_CONFLICTS_STORE_NAME, 'readwrite');
  const store = tx.objectStore(SETUP_CONFLICTS_STORE_NAME);

  const conflictId = `${applicationId}-${propertyName}`;
  const conflict = await store.get(conflictId);

  if (conflict) {
    conflict.Status = 'unresolved';
    await store.put(conflict);
  }
  await tx.done;
};
