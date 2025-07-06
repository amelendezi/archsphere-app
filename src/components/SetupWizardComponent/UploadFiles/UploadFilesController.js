

import { calculateApplicationConflictsCommand } from '../../../services/command/calculateApplicationConflictCommand';
import { ENV_APPLICATIONS_STORE_NAME } from '../../../config/dbConfig';

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
        
        callback([]); // Ensure callback is always called
      }
    } catch (error) {
      
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

export const processEnvironmentFileUpload = (file, addApplications, setSelectedFile, setLoadedCount) => {
  setSelectedFile(file);
  setLoadedCount(null);
  if (file) {
    parseEnvironmentJsonFile(file, async (applications) => {
      await addApplications(applications, ENV_APPLICATIONS_STORE_NAME);
      setLoadedCount(applications.length);
      await calculateApplicationConflictsCommand();
    });
  }
};

export const processNewApplicationsFileUpload = (file, addNewApplications, setSelectedNewApplicationsFile, setLoadedNewApplicationsCount, setIsNewApplicationsFileValid) => {
  if (!file) {
    setSelectedNewApplicationsFile(null);
    setLoadedNewApplicationsCount(null);
    setIsNewApplicationsFileValid(false);
    return;
  }
  setSelectedNewApplicationsFile(file);
  setLoadedNewApplicationsCount(null);
  if (file) {
    parseNewApplicationsFile(file, async (applications) => {
      await addNewApplications(applications);
      setLoadedNewApplicationsCount(applications.length);
      await calculateApplicationConflictsCommand();
    });
  }
};

export const handleNewApplicationsValidationChange = (isValid, setIsNewApplicationsFileValid) => {
  setIsNewApplicationsFileValid(isValid);
};

export const handleNext = (selectedFile, selectedNewApplicationsFile, nextStep) => {
  if (selectedFile || selectedNewApplicationsFile) {
    nextStep();
  }
};
