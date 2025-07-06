import { openDB } from 'idb';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const getDbPromise = () => openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains('env_applications')) {
      db.createObjectStore('env_applications', { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains('new_applications')) {
      db.createObjectStore('new_applications', { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains('new_env_conflicts')) {
      db.createObjectStore('new_env_conflicts', { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains('rec_new_applications')) {
      db.createObjectStore('rec_new_applications', { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains('old_env_applications')) {
      db.createObjectStore('old_env_applications', { keyPath: 'ID' });
    }
  },
});

export const useIndexedDB = () => {
  const addApplications = async (applications, storeName) => {
    const db = await getDbPromise();
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
  };

  const addNewApplications = async (applications) => {
    const db = await getDbPromise();
    const tx = db.transaction('new_applications', 'readwrite');
    const store = tx.objectStore('new_applications');
    for (const app of applications) {
      if (app.ID !== undefined && app.ID !== null) {
        console.log('useIndexedDB: Putting new application:', app.ID);
        await store.put(app);
      } else {
        console.error('useIndexedDB: New application is missing a valid ID and cannot be stored:', app);
      }
    }
    await tx.done;
  };

  const getStoreCount = async (storeName) => {
    const db = await getDbPromise();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const count = await store.count();
    await tx.done;
    return count;
  };

  const addConflict = async (conflict) => {
    const db = await getDbPromise();
    const tx = db.transaction('new_env_conflicts', 'readwrite');
    const store = tx.objectStore('new_env_conflicts');
    await store.put(conflict);
    await tx.done;
  };

  const clearStore = async (storeName) => {
    const db = await getDbPromise();
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    await store.clear();
    await tx.done;
  };

  const clearStores = async (storeNames) => {
    const db = await getDbPromise();
    for (const storeName of storeNames) {
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await store.clear();
      await tx.done;
    }
  };

  return { addApplications, addNewApplications, getStoreCount, addConflict, clearStore, clearStores };
};
