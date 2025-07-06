import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, SETUP_ENV_APPLICATIONS_STORE_NAME, SETUP_NEW_APPLICATIONS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const countNewApplicationsQuery = async () => {
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

  const newOnlyApplications = newApplications.filter(app => !envApplicationsIds.has(app.ID));

  return newOnlyApplications.length;
};