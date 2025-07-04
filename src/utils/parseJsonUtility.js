
export const parseEnvironmentJsonFile = (file, callback) => {
  const reader = new FileReader();

  reader.onload = async (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.applications) {
        const applicationsWithId = data.applications.map((app, index) => ({
          ...app,
          ID: app['Business Application ID'] || `generated-id-${Date.now()}-${index}`
        }));
        callback(applicationsWithId);
      } else {
        console.error('parseStateJson: JSON file is missing the "applications" property.');
        callback([]); // Ensure callback is always called
      }
    } catch (error) {
      console.error('parseStateJson: Error parsing JSON file:', error);
      callback([]); // Ensure callback is always called on error
    }
  };

  reader.readAsText(file);
};

export const parseNewApplicationsFile = (file, callback) => {
  const reader = new FileReader();

  reader.onload = async (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (Array.isArray(data)) {
        const applicationsWithId = data.map((app, index) => ({
          ...app,
          ID: app['Business Application ID'] || `generated-id-${Date.now()}-${index}`
        }));
        callback(applicationsWithId);
      } else {
        console.error('parseNewApplicationsFile: JSON is not an array:', data);
        callback([]);
      }
    } catch (error) {
      console.error('parseNewApplicationsFile: Error parsing JSON file:', error);
      callback([]);
    }
  };

  reader.readAsText(file);
};
