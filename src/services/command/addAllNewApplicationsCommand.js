import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, SETUP_ENV_APPLICATIONS_STORE_NAME, SETUP_NEW_APPLICATIONS_STORE_NAME, SETUP_ADDED_APPLICATIONS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const addAllNewApplicationsCommand = async () => {
  const db = await getDbPromise();

  const newApplicationsTx = db.transaction(SETUP_NEW_APPLICATIONS_STORE_NAME, 'readonly');
  const newApplicationsStore = newApplicationsTx.objectStore(SETUP_NEW_APPLICATIONS_STORE_NAME);
  const newApplications = await newApplicationsStore.getAll();
  await newApplicationsTx.done;

  const envApplicationsTx = db.transaction(SETUP_ENV_APPLICATIONS_STORE_NAME, 'readonly');
  const envApplicationsStore = envApplicationsTx.objectStore(SETUP_ENV_APPLICATIONS_STORE_NAME);
  const envApplications = await envApplicationsStore.getAll();
  await envApplicationsTx.done;

  const envApplicationsIds = new Set(envApplications.map(app => app.ID));

  const applicationsToAdd = newApplications.filter(app => !envApplicationsIds.has(app.ID));

  const envApplicationsWriteTx = db.transaction(SETUP_ENV_APPLICATIONS_STORE_NAME, 'readwrite');
  const envApplicationsWriteStore = envApplicationsWriteTx.objectStore(SETUP_ENV_APPLICATIONS_STORE_NAME);
  for (const app of applicationsToAdd) {
    await envApplicationsWriteStore.put(app);
  }
  await envApplicationsWriteTx.done;

  const recNewApplicationsTx = db.transaction(SETUP_ADDED_APPLICATIONS_STORE_NAME, 'readwrite');
  const recNewApplicationsStore = recNewApplicationsTx.objectStore(SETUP_ADDED_APPLICATIONS_STORE_NAME);
  for (const app of applicationsToAdd) {
    await recNewApplicationsStore.put(app);
  }
  await recNewApplicationsTx.done;

  return applicationsToAdd.length;
};