export const detectConflicts = (envApps, newApps) => {
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