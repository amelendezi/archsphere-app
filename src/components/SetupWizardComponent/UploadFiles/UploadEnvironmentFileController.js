import { ENV_APPLICATIONS_STORE_NAME } from '../../../config/dbConfig';

export const onEnvironmentFileInputChange = async (event, clearStore, handleFileChange) => {
  const file = event.target.files[0];
  await clearStore(ENV_APPLICATIONS_STORE_NAME);
  handleFileChange(file);
};