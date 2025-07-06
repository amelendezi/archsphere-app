export const onEnvironmentFileInputChange = async (event, clearStore, handleFileChange) => {
  const file = event.target.files[0];
  await clearStore('env_applications');
  handleFileChange(file);
};