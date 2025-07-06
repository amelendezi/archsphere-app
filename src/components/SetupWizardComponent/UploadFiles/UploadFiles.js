import React from 'react';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import UploadEnvironmentFile from './UploadEnvironmentFile';
import UploadNewApplicationsFile from './UploadNewApplicationsFile';
import { processEnvironmentFileUpload, processNewApplicationsFileUpload, handleNewApplicationsValidationChange, handleNext } from './UploadFilesController';

function UploadState({
  nextStep,
  onClose,
  selectedFile,
  setSelectedFile,
  loadedCount,
  setLoadedCount,
  selectedNewApplicationsFile,
  setSelectedNewApplicationsFile,
  loadedNewApplicationsCount,
  setLoadedNewApplicationsCount,
  isNewApplicationsFileValid,
  setIsNewApplicationsFileValid,
}) {
  const { addApplications, addNewApplications } = useIndexedDB();

  return (
    <div>
      <h2>Setup Environment</h2>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <p style={{ textAlign: 'justify', marginBottom: '20px' }}>
          You can <strong>optionally</strong> upload a previously saved environment file (environment.json) to configure the setup.
          Use this to continue working with a previously saved application landscape.
          If this is the first time working with this application, do not upload any file.          
        </p>
        <p style={{ textAlign: 'justify', marginBottom: '20px' }}>
          Additionally, you may <strong>optionally</strong> upload an updated list of applications from ServiceNow (applications.json).
          In the next step, any differences between the files will be reconciled, if necessary.
        </p>
      </div>
      <div style={{ borderBottom: '1px solid grey', width: '80%', margin: '0 auto 20px auto' }}></div>
      <div style={{ width: '80%', margin: '0 auto' }}>
        <UploadEnvironmentFile
        selectedFile={selectedFile}
        handleFileChange={(file) => processEnvironmentFileUpload(file, addApplications, setSelectedFile, setLoadedCount)}
        loadedCount={loadedCount}
        fileInputId="environment-file-upload"
      />
      <div style={{ marginBottom: '20px' }}></div>
      <UploadNewApplicationsFile
        selectedFile={selectedNewApplicationsFile}
        handleFileChange={(file) => processNewApplicationsFileUpload(file, addNewApplications, setSelectedNewApplicationsFile, setLoadedNewApplicationsCount, setIsNewApplicationsFileValid)}
        loadedCount={loadedNewApplicationsCount}
        fileInputId="new-applications-file-upload"
        onValidationChange={(isValid) => handleNewApplicationsValidationChange(isValid, setIsNewApplicationsFileValid)}
      />
      </div>
      <div style={{ flexGrow: 1 }}></div> {/* This will push the content to the bottom */}
      <div style={{ borderBottom: '1px solid grey', width: '80%', margin: '20px auto 0 auto' }}></div>
      <div className="UploadState-buttons-row">
        <button className="UploadState-button UploadState-button-close" onClick={onClose}>Close</button>
        <button
          className="UploadState-button UploadState-button-next"
          onClick={() => handleNext(selectedFile, selectedNewApplicationsFile, nextStep)}
          disabled={!selectedFile || !selectedNewApplicationsFile || !isNewApplicationsFileValid}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UploadState;