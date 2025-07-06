import { openDB } from 'idb';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const countNewApplicationsQuery = async () => {
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

  const newOnlyApplications = newApplications.filter(app => !envApplicationsIds.has(app.ID));

  return newOnlyApplications.length;
};