import { openDB } from 'idb';

import { DB_NAME, DB_VERSION } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const addAllNewApplicationsCommand = async () => {
  const db = await getDbPromise();

  const newApplicationsTx = db.transaction('new_applications', 'readonly');
  const newApplicationsStore = newApplicationsTx.objectStore('new_applications');
  const newApplications = await newApplicationsStore.getAll();
  await newApplicationsTx.done;

  const envApplicationsTx = db.transaction('env_applications', 'readonly');
  const envApplicationsStore = envApplicationsTx.objectStore('env_applications');
  const envApplications = await envApplicationsStore.getAll();
  await envApplicationsTx.done;

  const envApplicationsIds = new Set(envApplications.map(app => app.ID));

  const applicationsToAdd = newApplications.filter(app => !envApplicationsIds.has(app.ID));

  const envApplicationsWriteTx = db.transaction('env_applications', 'readwrite');
  const envApplicationsWriteStore = envApplicationsWriteTx.objectStore('env_applications');
  for (const app of applicationsToAdd) {
    await envApplicationsWriteStore.put(app);
  }
  await envApplicationsWriteTx.done;

  const recNewApplicationsTx = db.transaction('rec_new_applications', 'readwrite');
  const recNewApplicationsStore = recNewApplicationsTx.objectStore('rec_new_applications');
  for (const app of applicationsToAdd) {
    await recNewApplicationsStore.put(app);
  }
  await recNewApplicationsTx.done;

  return applicationsToAdd.length;
};