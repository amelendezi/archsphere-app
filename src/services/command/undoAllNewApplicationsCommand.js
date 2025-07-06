import { openDB } from 'idb';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const undoAddAllNewApplicationsCommand = async () => {
  const db = await getDbPromise();

  const recNewApplicationsTx = db.transaction('rec_new_applications', 'readonly');
  const recNewApplicationsStore = recNewApplicationsTx.objectStore('rec_new_applications');
  const applicationsToRemove = await recNewApplicationsStore.getAll();
  await recNewApplicationsTx.done;

  const envApplicationsTx = db.transaction('env_applications', 'readwrite');
  const envApplicationsStore = envApplicationsTx.objectStore('env_applications');
  for (const app of applicationsToRemove) {
    await envApplicationsStore.delete(app.ID);
  }
  await envApplicationsTx.done;

  await db.transaction('rec_new_applications', 'readwrite').objectStore('rec_new_applications').clear();

  return applicationsToRemove.length;
};