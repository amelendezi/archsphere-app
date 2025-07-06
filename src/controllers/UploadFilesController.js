import { parseEnvironmentJsonFile, parseNewApplicationsFile } from '../utils/parseJsonUtility';
import { calculateAndStoreConflicts } from '../utils/uploadStateUtility';

export const processEnvironmentFileUpload = (file, addApplications, setSelectedFile, setLoadedCount) => {
  setSelectedFile(file);
  setLoadedCount(null);
  if (file) {
    parseEnvironmentJsonFile(file, async (applications) => {
      await addApplications(applications, 'env_applications');
      setLoadedCount(applications.length);
      await calculateAndStoreConflicts();
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
      await calculateAndStoreConflicts();
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
