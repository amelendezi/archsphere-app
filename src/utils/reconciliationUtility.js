import { openDB } from 'idb';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const dbPromise = openDB(DB_NAME, DB_VERSION);

export const reconcileApplications = async () => {
  const db = await dbPromise;

  // Clear existing conflicts
  await db.transaction('new_env_conflicts', 'readwrite').objectStore('new_env_conflicts').clear();

  const newApplicationsTx = db.transaction('new_applications', 'readonly');
  const newApplicationsStore = newApplicationsTx.objectStore('new_applications');
  const newApplications = await newApplicationsStore.getAll();
  await newApplicationsTx.done;

  const envApplicationsTx = db.transaction('env_applications', 'readonly');
  const envApplicationsStore = envApplicationsTx.objectStore('env_applications');
  const envApplications = await envApplicationsStore.getAll();
  await envApplicationsTx.done;

  const envApplicationsMap = new Map(envApplications.map(app => [app.ID, app]));

  const conflicts = [];

  for (const newApp of newApplications) {
    const envApp = envApplicationsMap.get(newApp.ID);

    if (envApp) {
      // Compare properties
      for (const key in newApp) {
        if (newApp.hasOwnProperty(key) && envApp.hasOwnProperty(key)) {
          if (newApp[key] !== envApp[key]) {
            const conflict = {
              ID: `${newApp.ID}-${key}`,
              'Business Application ID': newApp.ID,
              Name: newApp.Name,
              'Property Name': key,
              'Old Value': envApp[key],
              'New Value': newApp[key],
              Status: 'unresolved',
            };
            conflicts.push(conflict);
          }
        }
      }
    }
  }

  const conflictTx = db.transaction('new_env_conflicts', 'readwrite');
  const conflictStore = conflictTx.objectStore('new_env_conflicts');
  for (const conflict of conflicts) {
    await conflictStore.put(conflict);
  }
  await conflictTx.done;

  return conflicts.length;
};

export const getNewApplicationsCount = async () => {
  const db = await dbPromise;

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
  const db = await dbPromise;

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
  const db = await dbPromise;

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
  const oldEnvApplicationsStore = tx.objectStore('old_env_applications');
  const newEnvConflictsStore = tx.objectStore('new_env_conflicts');

  const oldApplication = await envApplicationsStore.get(applicationId);

  if (oldApplication) {
    // Store old version in old_env_applications
    await oldEnvApplicationsStore.put({ ...oldApplication, ID: `${oldApplication.ID}-${propertyName}-${Date.now()}` }); // Store with a unique ID

    // Update env_applications record
    oldApplication[propertyName] = newValue;
    await envApplicationsStore.put(oldApplication);
  }

  // Update new_env_conflicts status
  const conflictId = `${applicationId}-${propertyName}`;
  const conflict = await newEnvConflictsStore.get(conflictId);
  if (conflict) {
    conflict.Status = 'resolved';
    await newEnvConflictsStore.put(conflict);
  }
};

export const assumeAllConflicts = async () => {
  const db = await dbPromise;
  const tx = db.transaction(['new_env_conflicts', 'env_applications', 'old_env_applications'], 'readwrite');

  const newEnvConflictsStore = tx.objectStore('new_env_conflicts');
  const conflicts = await newEnvConflictsStore.getAll();

  let resolvedConflictsCount = 0;
  for (const conflict of conflicts) {
    if (conflict.Status === 'unresolved') {
      await updateIndividualApplication(tx, conflict['Business Application ID'], conflict['Property Name'], conflict['New Value']);
      resolvedConflictsCount++;
    }
  }
  await tx.done;
  return resolvedConflictsCount;
};