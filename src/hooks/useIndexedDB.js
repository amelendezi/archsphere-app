import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, SETUP_ENV_APPLICATIONS_STORE_NAME, SETUP_NEW_APPLICATIONS_STORE_NAME, SETUP_CONFLICTS_STORE_NAME, SETUP_ADDED_APPLICATIONS_STORE_NAME, APP_ANNOTATIONS_STORE_NAME } from '../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(SETUP_ENV_APPLICATIONS_STORE_NAME)) {
      db.createObjectStore(SETUP_ENV_APPLICATIONS_STORE_NAME, { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains(SETUP_NEW_APPLICATIONS_STORE_NAME)) {
      db.createObjectStore(SETUP_NEW_APPLICATIONS_STORE_NAME, { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains(SETUP_CONFLICTS_STORE_NAME)) {
      db.createObjectStore(SETUP_CONFLICTS_STORE_NAME, { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains(SETUP_ADDED_APPLICATIONS_STORE_NAME)) {
      db.createObjectStore(SETUP_ADDED_APPLICATIONS_STORE_NAME, { keyPath: 'ID' });
    }
    if (!db.objectStoreNames.contains(APP_ANNOTATIONS_STORE_NAME)) {
      db.createObjectStore(APP_ANNOTATIONS_STORE_NAME);
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
    const tx = db.transaction(SETUP_NEW_APPLICATIONS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(SETUP_NEW_APPLICATIONS_STORE_NAME);
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
    const tx = db.transaction(SETUP_CONFLICTS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(SETUP_CONFLICTS_STORE_NAME);
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

  const getAllApplications = async (storeName) => {
    const db = await getDbPromise();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const allApplications = await store.getAll();
    await tx.done;
    return allApplications;
  };

  const getAnnotations = async (applicationId) => {
    const db = await getDbPromise();
    const tx = db.transaction(APP_ANNOTATIONS_STORE_NAME, 'readonly');
    const store = tx.objectStore(APP_ANNOTATIONS_STORE_NAME);
    const annotations = await store.get(applicationId);
    await tx.done;
    return annotations;
  };

  const addAnnotation = async (applicationId, annotationText) => {
    const db = await getDbPromise();
    const tx = db.transaction(APP_ANNOTATIONS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(APP_ANNOTATIONS_STORE_NAME);
    const user = "Admin";
    const timestamp = new Date().toISOString();
    const newAnnotation = {
      comment: annotationText,
      user,
      timestamp,
    };
    const existingAnnotations = await store.get(applicationId) || [];
    const updatedAnnotations = [...existingAnnotations, newAnnotation];
    await store.put(updatedAnnotations, applicationId);
    await tx.done;
  };

  const deleteAnnotation = async (applicationId, annotationToDelete) => {
    const db = await getDbPromise();
    const tx = db.transaction(APP_ANNOTATIONS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(APP_ANNOTATIONS_STORE_NAME);
    const existingAnnotations = await store.get(applicationId) || [];
    const updatedAnnotations = existingAnnotations.filter(annotation => annotation.timestamp !== annotationToDelete.timestamp);
    await store.put(updatedAnnotations, applicationId);
    await tx.done;
  };

  const getAllStoreData = async (storeName) => {
    const db = await getDbPromise();
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const keys = await store.getAllKeys();
    const values = await store.getAll();
    return keys.map((key, index) => ({ id: key, annotations: values[index] }));
  };

  const loadAnnotations = async (annotationsData) => {
    const db = await getDbPromise();
    const tx = db.transaction(APP_ANNOTATIONS_STORE_NAME, 'readwrite');
    const store = tx.objectStore(APP_ANNOTATIONS_STORE_NAME);
    await store.clear();
    for (const item of annotationsData) {
      await store.put(item.annotations, item.id);
    }
    await tx.done;
  };

  return { addApplications, addNewApplications, getStoreCount, addConflict, clearStore, clearStores, getAllApplications, getAnnotations, addAnnotation, deleteAnnotation, getAllStoreData, loadAnnotations };
};
