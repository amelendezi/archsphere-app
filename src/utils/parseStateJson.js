
export const parseStateJson = (file, callback) => {
  const reader = new FileReader();

  reader.onload = async (event) => {
    try {
      const data = JSON.parse(event.target.result);
      if (data.applications) {
        const applicationsWithId = data.applications.map(app => ({
          ...app,
          ID: app['Business Application ID']
        }));
        callback(applicationsWithId);
      } else {
        console.error('JSON file is missing the "applications" property.');
      }
    } catch (error) {
      console.error('Error parsing JSON file:', error);
    }
  };

  reader.readAsText(file);
};
