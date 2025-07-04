import React, { useState } from 'react';
import { parseEnvironmentJsonFile, parseNewApplicationsFile } from '../utils/parseJsonUtility';
import { useIndexedDB } from '../hooks/useIndexedDB';
import UploadEnvironmentFile from './UploadEnvironmentFile';
import UploadNewApplicationsFile from './UploadNewApplicationsFile';

function UploadState({ nextStep, onClose }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadedCount, setLoadedCount] = useState(null);
  const [selectedNewApplicationsFile, setSelectedNewApplicationsFile] = useState(null);
  const [loadedNewApplicationsCount, setLoadedNewApplicationsCount] = useState(null);
  const { addApplications, addNewApplications } = useIndexedDB();

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    
    setLoadedCount(null);

    if (file) {
      
      parseEnvironmentJsonFile(file, async (applications) => {
        
        await addApplications(applications, 'env_applications');
        
        setLoadedCount(applications.length);
        
      });
    }
  };

  const handleNewApplicationsFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedNewApplicationsFile(file);
    
    setLoadedNewApplicationsCount(null);

    if (file) {
      
      parseNewApplicationsFile(file, async (applications) => {
        
        await addNewApplications(applications);
        
        setLoadedNewApplicationsCount(applications.length);
        
      });
    }
  };

  const handleNext = () => {
    if (selectedFile || selectedNewApplicationsFile) {
      onClose();
    }
  };

  return (
    <div>
      <h2>Setup Environment</h2>
      <div style={{ borderBottom: '1px solid grey', width: '80%', margin: '0 auto 20px auto' }}></div>
      <UploadEnvironmentFile
        selectedFile={selectedFile}
        handleFileChange={handleFileChange}
        loadedCount={loadedCount}
        fileInputId="environment-file-upload"
      />
      <UploadNewApplicationsFile
        selectedFile={selectedNewApplicationsFile}
        handleFileChange={handleNewApplicationsFileChange}
        loadedCount={loadedNewApplicationsCount}
        fileInputId="new-applications-file-upload"
      />
      <div style={{ flexGrow: 1 }}></div> {/* This will push the content to the bottom */}
      <div style={{ borderBottom: '1px solid grey', width: '80%', margin: '20px auto 0 auto' }}></div>
      <div className="UploadState-buttons-row">
        <button className="UploadState-button UploadState-button-close" onClick={onClose}>Close</button>
        <button
          className="UploadState-button UploadState-button-next"
          onClick={handleNext}
          disabled={!selectedFile && !selectedNewApplicationsFile}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default UploadState;