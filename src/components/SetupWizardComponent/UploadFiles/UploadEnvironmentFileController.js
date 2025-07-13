import { SETUP_ENV_APPLICATIONS_STORE_NAME } from '../../../config/dbConfig';

export const onEnvironmentFileInputChange = async (event, handleFileChange, db) => {
  const file = event.target.files[0];
  if (!file) {
    return;
  }

  const { addApplications, loadAnnotations, clearStore } = db;

  try {
    const text = await file.text();
    const data = JSON.parse(text);

    if (data.applications) {
      await clearStore(SETUP_ENV_APPLICATIONS_STORE_NAME);
      await addApplications(data.applications, SETUP_ENV_APPLICATIONS_STORE_NAME);
    }

    if (data.application_annotations) {
      await loadAnnotations(data.application_annotations);
    }

    handleFileChange(file, data.applications.length);
  } catch (error) {
    console.error("Error processing environment file:", error);
    handleFileChange(null, 0);
  }
};