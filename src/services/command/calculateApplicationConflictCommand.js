import { openDB } from 'idb';

import { DB_NAME, DB_VERSION, SETUP_ENV_APPLICATIONS_STORE_NAME, SETUP_NEW_APPLICATIONS_STORE_NAME, SETUP_CONFLICTS_STORE_NAME } from '../../config/dbConfig';

const getDbPromise = () => openDB(DB_NAME, DB_VERSION);

export const calculateApplicationConflictsCommand = async () => {
  try {
    const db = await getDbPromise();
    const envTx = db.transaction(SETUP_ENV_APPLICATIONS_STORE_NAME, 'readonly');
    const envStore = envTx.objectStore(SETUP_ENV_APPLICATIONS_STORE_NAME);
    const envApps = await envStore.getAll();
    await envTx.done;

    const newAppsTx = db.transaction(SETUP_NEW_APPLICATIONS_STORE_NAME, 'readonly');
    const newAppsStore = newAppsTx.objectStore(SETUP_NEW_APPLICATIONS_STORE_NAME);
    const newApps = await newAppsStore.getAll();
    await newAppsTx.done;

    if (!envApps.length || !newApps.length) {
      return;
    }

    const conflicts = detectConflicts(envApps, newApps);

    const conflictTx = db.transaction(SETUP_CONFLICTS_STORE_NAME, 'readwrite');
    const conflictStore = conflictTx.objectStore(SETUP_CONFLICTS_STORE_NAME);
    await conflictStore.clear();

    for (const conflict of conflicts) {
      await conflictStore.put(conflict);
    }
    await conflictTx.done;

  } catch (error) {
    console.error('Error calculating and storing conflicts:', error);
  }
};

const detectConflicts = (envApps, newApps) => {
  const conflicts = [];
  const envAppsMap = new Map(envApps.map(app => [app.ID, app]));

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
  return conflicts;
};