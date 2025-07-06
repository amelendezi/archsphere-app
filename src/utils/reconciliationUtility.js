import { openDB } from 'idb';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

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