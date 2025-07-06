import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, ENV_APPLICATIONS_STORE_NAME, NEW_APPLICATIONS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const countNewApplicationsQuery = async () => {
  const db = await getDbPromise();

  const newApplicationsTx = db.transaction(NEW_APPLICATIONS_STORE_NAME, 'readonly');
  const newApplicationsStore = newApplicationsTx.objectStore(NEW_APPLICATIONS_STORE_NAME);
  const newApplications = await newApplicationsStore.getAll();
  await newApplicationsTx.done;

  const envApplicationsTx = db.transaction(ENV_APPLICATIONS_STORE_NAME, 'readonly');
  const envApplicationsStore = envApplicationsTx.objectStore(ENV_APPLICATIONS_STORE_NAME);
  const envApplications = await envApplicationsStore.getAll();
  await envApplicationsTx.done;

  const envApplicationsIds = new Set(envApplications.map(app => app.ID));

  const newOnlyApplications = newApplications.filter(app => !envApplicationsIds.has(app.ID));

  return newOnlyApplications.length;
};