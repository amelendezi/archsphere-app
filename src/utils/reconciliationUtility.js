import { openDB } from 'idb';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const getUnresolvedConflictCount = async () => {
  const db = await getDbPromise();
  const tx = db.transaction('new_env_conflicts', 'readonly');
  const store = tx.objectStore('new_env_conflicts');
  const allConflicts = await store.getAll();
  return allConflicts.filter(conflict => conflict.Status === 'unresolved').length;
};

export const getNewApplicationsCount = async () => {
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

export const addAllNewApplications = async () => {
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

export const undoAddAllNewApplications = async () => {
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

export const updateIndividualApplication = async (tx, applicationId, propertyName, newValue) => {
  const envApplicationsStore = tx.objectStore('env_applications');
  const newEnvConflictsStore = tx.objectStore('new_env_conflicts');

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
};

export const assumeAllConflicts = async () => {
  const db = await getDbPromise();
  const tx = db.transaction(['new_env_conflicts', 'env_applications'], 'readwrite');
  const newEnvConflictsStore = tx.objectStore('new_env_conflicts');
  const envApplicationsStore = tx.objectStore('env_applications');

  const conflicts = await newEnvConflictsStore.getAll();

  let resolvedConflictsCount = 0;
  for (const conflict of conflicts) {
    if (conflict.Status === 'unresolved') {
      const application = await envApplicationsStore.get(conflict['Business Application ID']);
      if (application) {
        application[conflict['Property Name']] = conflict['New Value'];
        await envApplicationsStore.put(application);
      }
      
      conflict.Status = 'resolved';
      await newEnvConflictsStore.put(conflict);
      resolvedConflictsCount++;
    }
  }

  await tx.done;
  return resolvedConflictsCount;
};