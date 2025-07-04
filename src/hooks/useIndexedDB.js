
import { openDB } from 'idb';

const DB_NAME = 'ArchSphereDB';
const STORE_NAME = 'applications';
const DB_VERSION = 1;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'ID' });
    }
  },
});

export const useIndexedDB = () => {
  const addApplications = async (applications) => {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    for (const app of applications) {
      if (app.ID !== undefined && app.ID !== null) {
        await store.put(app);
      } else {
        console.error('Application is missing a valid ID and cannot be stored:', app);
      }
    }
    await tx.done;
  }

  return { addApplications };
};
