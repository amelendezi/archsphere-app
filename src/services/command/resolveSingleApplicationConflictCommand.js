import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, ENV_APPLICATIONS_STORE_NAME, NEW_ENV_CONFLICTS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const resolveSingleConflictCommand = async (transaction, applicationId, propertyName, newValue) => {
  let db;
  let tx;
  let isNewTransaction = false;

  if (transaction) {
    tx = transaction;
  } else {
    db = await getDbPromise();
    tx = db.transaction([ENV_APPLICATIONS_STORE_NAME, NEW_ENV_CONFLICTS_STORE_NAME], 'readwrite');
    isNewTransaction = true;
  }

  const envApplicationsStore = tx.objectStore(ENV_APPLICATIONS_STORE_NAME);
  const newEnvConflictsStore = tx.objectStore(NEW_ENV_CONFLICTS_STORE_NAME);

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