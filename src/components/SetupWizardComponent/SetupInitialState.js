import React, { useState } from 'react';
import UploadFiles from './UploadFiles/UploadFiles';
import Reconciliation from './Reconciliation';

function SetupInitialState({ onClose }) {
  const [step, setStep] = useState(1);
  const [selectedFile, setSelectedFile] = useState(null);
  const [loadedCount, setLoadedCount] = useState(null);
  const [selectedNewApplicationsFile, setSelectedNewApplicationsFile] = useState(null);
  const [loadedNewApplicationsCount, setLoadedNewApplicationsCount] = useState(null);
  const [isNewApplicationsFileValid, setIsNewApplicationsFileValid] = useState(false);

  const nextStep = () => {
    setStep(step + 1);
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  return (
    <div className="App-modal-overlay">
      <div className="App-modal-content">
        {(() => {
          switch (step) {
            case 1:
              return (
                <UploadFiles
                  nextStep={nextStep}
                  onClose={onClose}
                  selectedFile={selectedFile}
                  setSelectedFile={setSelectedFile}
                  loadedCount={loadedCount}
                  setLoadedCount={setLoadedCount}
                  selectedNewApplicationsFile={selectedNewApplicationsFile}
                  setSelectedNewApplicationsFile={setSelectedNewApplicationsFile}
                  loadedNewApplicationsCount={loadedNewApplicationsCount}
                  setLoadedNewApplicationsCount={setLoadedNewApplicationsCount}
                  isNewApplicationsFileValid={isNewApplicationsFileValid}
                  setIsNewApplicationsFileValid={setIsNewApplicationsFileValid}
                />
              );
            case 2:
              return (
                <Reconciliation
                  onBack={prevStep}
                  onClose={onClose}
                  setSelectedFile={setSelectedFile}
                  setSelectedNewApplicationsFile={setSelectedNewApplicationsFile}
                  setLoadedCount={setLoadedCount}
                  setLoadedNewApplicationsCount={setLoadedNewApplicationsCount}
                  setIsNewApplicationsFileValid={setIsNewApplicationsFileValid}
                />
              );
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}

export default SetupInitialState;