import { SETUP_NEW_APPLICATIONS_STORE_NAME } from '../../../config/dbConfig';
import Ajv from 'ajv';
import applicationSchema from '../../../application.schema.json';

const ajv = new Ajv();
const validate = ajv.compile(applicationSchema);

export const onNewApplicationsFileChange = async (event, clearStore, handleFileChange, onValidationChange, setValidationError) => {
  const file = event.target.files[0];
  if (file) {
    await clearStore(SETUP_NEW_APPLICATIONS_STORE_NAME);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const fileContent = JSON.parse(e.target.result);
        const isValid = validate(fileContent);
        if (!isValid) {
          setValidationError("Invalid File");
          handleFileChange(null);
          onValidationChange(false);
        } else {
          setValidationError(null);
          handleFileChange(file);
          onValidationChange(true);
        }
      } catch (error) {
        setValidationError("Invalid JSON format");
        handleFileChange(null);
      }
    };
    reader.readAsText(file);
  } else {
    setValidationError(null);
    handleFileChange(null);
  }
};