import { openDB } from 'idb';

const DB_NAME = 'ArchSphereDB';
const DB_VERSION = 9;

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const calculateAndStoreConflicts = async () => {
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

    const envAppsMap = new Map(envApps.map(app => [app.ID, app]));
    const conflicts = [];

    for (const newApp of newApps) {
      const envApp = envAppsMap.get(newApp.ID);

      if (envApp) {
        if (JSON.stringify(newApp) !== JSON.stringify(envApp)) {
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
    }

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
