import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, ENV_APPLICATIONS_STORE_NAME, NEW_APPLICATIONS_STORE_NAME, NEW_ENV_CONFLICTS_STORE_NAME, REC_NEW_APPLICATIONS_STORE_NAME } from '../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(ENV_APPLICATIONS_STORE_NAME)) {
      db.createObjectStore(ENV_APPLICATIONS_STORE_NAME, { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains(NEW_APPLICATIONS_STORE_NAME)) {
      db.createObjectStore(NEW_APPLICATIONS_STORE_NAME, { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains(NEW_ENV_CONFLICTS_STORE_NAME)) {
      db.createObjectStore(NEW_ENV_CONFLICTS_STORE_NAME, { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains(REC_NEW_APPLICATIONS_STORE_NAME)) {
      db.createObjectStore(REC_NEW_APPLICATIONS_STORE_NAME, { keyPath: 'ID' });
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
        await store.put(app);
      } else {
        console.error('useIndexedDB: Application is missing a valid ID and cannot be stored:', app);
      }
    }
    await tx.done;
  };

  const addNewApplications = async (applications) => {
    const db = await getDbPromise();
    const tx = db.transaction(NEW_APPLICATIONS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(NEW_APPLICATIONS_STORE_NAME);
    for (const app of applications) {
      if (app.ID !== undefined && app.ID !== null) {
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
    const tx = db.transaction(NEW_ENV_CONFLICTS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(NEW_ENV_CONFLICTS_STORE_NAME);
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
