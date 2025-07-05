import React, { useState } from 'react';
import UploadState from './UploadState';
import Reconciliation from './Reconciliation';

function SetupInitialState({ onClose }) {
  const [step, setStep] = useState(1);

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
              return <UploadState nextStep={nextStep} onClose={onClose} />;
            case 2:
              return <Reconciliation onBack={prevStep} onClose={onClose} />;
            default:
              return null;
          }
        })()}
      </div>
    </div>
  );
}

export default SetupInitialState;