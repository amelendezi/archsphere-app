import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, ENV_APPLICATIONS_STORE_NAME, REC_NEW_APPLICATIONS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const undoAddAllNewApplicationsCommand = async () => {
  const db = await getDbPromise();

  const recNewApplicationsTx = db.transaction(REC_NEW_APPLICATIONS_STORE_NAME, 'readonly');
  const recNewApplicationsStore = recNewApplicationsTx.objectStore(REC_NEW_APPLICATIONS_STORE_NAME);
  const applicationsToRemove = await recNewApplicationsStore.getAll();
  await recNewApplicationsTx.done;

  const envApplicationsTx = db.transaction(ENV_APPLICATIONS_STORE_NAME, 'readwrite');
  const envApplicationsStore = envApplicationsTx.objectStore(ENV_APPLICATIONS_STORE_NAME);
  for (const app of applicationsToRemove) {
    await envApplicationsStore.delete(app.ID);
  }
  await envApplicationsTx.done;

  await db.transaction(REC_NEW_APPLICATIONS_STORE_NAME, 'readwrite').objectStore(REC_NEW_APPLICATIONS_STORE_NAME).clear();

  return applicationsToRemove.length;
};