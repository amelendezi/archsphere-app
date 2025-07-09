import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, SETUP_ENV_APPLICATIONS_STORE_NAME, SETUP_CONFLICTS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const resolveSingleApplicationConflictCommand = async (transaction, applicationId, propertyName, newValue) => {
  let db;
  let tx;
  let isNewTransaction = false;

  if (transaction) {
    tx = transaction;
  } else {
    db = await getDbPromise();
    tx = db.transaction([SETUP_ENV_APPLICATIONS_STORE_NAME, SETUP_CONFLICTS_STORE_NAME], 'readwrite');
    isNewTransaction = true;
  }

  const envApplicationsStore = tx.objectStore(SETUP_ENV_APPLICATIONS_STORE_NAME);
  const newEnvConflictsStore = tx.objectStore(SETUP_CONFLICTS_STORE_NAME);

  const oldApplication = await envApplicationsStore.get(applicationId);

  if (oldApplication) {
    // Update env_applications record
    oldApplication[propertyName] = newValue;
    await envApplicationsStore.put(oldApplication);
  }
  const conflictId = `${applicationId}-${propertyName}`;
  const conflict = await newEnvConflictsStore.get(conflictId);

  if (conflict) {
    conflict.Status = 'resolved';
    await newEnvConflictsStore.put(conflict);
  }

  if (isNewTransaction) {
    await tx.done;
  }
};