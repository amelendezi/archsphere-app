import { openDB } from 'idb';
import { detectConflicts } from './conflictDetectionUtility';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const orchestrateConflictCalculation = async () => {
  try {
    const db = await getDbPromise();
    const envTx = db.transaction('env_applications', 'readonly');
    const envStore = envTx.objectStore('env_applications');
    const envApps = await envStore.getAll();
    await envTx.done;

    const newAppsTx = db.transaction('new_applications', 'readonly');
    const newAppsStore = newAppsTx.objectStore('new_applications');
    const newApps = await newAppsStore.getAll();
    await newAppsTx.done;

    if (!envApps.length || !newApps.length) {
      return;
    }

    const conflicts = detectConflicts(envApps, newApps);

    const conflictTx = db.transaction('new_env_conflicts', 'readwrite');
    const conflictStore = conflictTx.objectStore('new_env_conflicts');
    await conflictStore.clear();

    for (const conflict of conflicts) {
      await conflictStore.put(conflict);
    }
    await conflictTx.done;

  } catch (error) {
    console.error('Error calculating and storing conflicts:', error);
  }
};
