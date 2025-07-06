import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, ENV_APPLICATIONS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const unresolveSingleApplicationConflictCommand = async (transaction, applicationId, propertyName, oldValue) => {
  let db;
  let tx;
  let isNewTransaction = false;

  if (transaction) {
    tx = transaction;
  } else {
    db = await getDbPromise();
    tx = db.transaction([ENV_APPLICATIONS_STORE_NAME, 'new_env_conflicts'], 'readwrite');
    isNewTransaction = true;
  }

  const envApplicationsStore = tx.objectStore(ENV_APPLICATIONS_STORE_NAME);
  const newEnvConflictsStore = tx.objectStore('new_env_conflicts');

  const applicationToUpdate = await envApplicationsStore.get(applicationId);

  if (applicationToUpdate) {
    // Revert env_applications record to old value
    applicationToUpdate[propertyName] = oldValue;
    await envApplicationsStore.put(applicationToUpdate);
  }

  const conflictId = `${applicationId}-${propertyName}`;
  const conflict = await newEnvConflictsStore.get(conflictId);

  if (conflict) {
    conflict.Status = 'unresolved';
    await newEnvConflictsStore.put(conflict);
  }

  if (isNewTransaction) {
    await tx.done;
  }
};
