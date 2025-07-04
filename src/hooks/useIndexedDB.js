
import { openDB } from 'idb';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 7;

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('env_applications')) {
      db.createObjectStore('env_applications', { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains('new_applications')) {
      db.createObjectStore('new_applications', { keyPath: 'ID' });
    }
  },
});

export const useIndexedDB = () => {
  const addApplications = async (applications, storeName) => {
    console.log('useIndexedDB: addApplications called with:', applications, 'to store:', storeName);
    const db = await dbPromise;
    console.log('useIndexedDB: Database opened.');
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    for (const app of applications) {
      if (app.ID !== undefined && app.ID !== null) {
        console.log('useIndexedDB: Putting application:', app.ID);
        await store.put(app);
      } else {
        console.error('useIndexedDB: Application is missing a valid ID and cannot be stored:', app);
      }
    }
    await tx.done;
    console.log('useIndexedDB: Transaction completed.');
  };

  const addNewApplications = async (applications) => {
    console.log('useIndexedDB: addNewApplications called with:', applications);
    const db = await dbPromise;
    console.log('useIndexedDB: Database opened.');
    const tx = db.transaction('new_applications', 'readwrite');
    const store = tx.objectStore('new_applications');
    console.log('useIndexedDB: Transaction and object store created for new apps.');
    for (const app of applications) {
      if (app.ID !== undefined && app.ID !== null) {
        console.log('useIndexedDB: Putting new application:', app.ID);
        await store.put(app);
      } else {
        console.error('useIndexedDB: New application is missing a valid ID and cannot be stored:', app);
      }
    }
    await tx.done;
    console.log('useIndexedDB: New applications transaction completed.');
  };

  return { addApplications, addNewApplications };
};
