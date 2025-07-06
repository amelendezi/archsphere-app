import { useState } from 'react';
import { useIndexedDB } from '../../../hooks/useIndexedDB';
import { onNewApplicationsFileChange } from './UploadNewApplicationsFileController';

function UploadNewApplicationsFile({ selectedFile, handleFileChange, loadedCount, fileInputId, onValidationChange }) {
  const [showTooltip, setShowTooltip] = useState(false);
  const [validationError, setValidationError] = useState(null);
  const { clearStore } = useIndexedDB();

  return (
    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f8f8f8' }}>
      <tbody>
        <tr>
          <td style={{ padding: '8px', verticalAlign: 'middle', textAlign: 'left', width: '45%' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
              <div
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
              >
                <span style={{ display: 'inline-block', width: '16px', height: '16px', borderRadius: '50%', border: '1px solid #4285F4', textAlign: 'center', lineHeight: '14px', fontSize: '12px', fontWeight: 'bold', cursor: 'help', color: '#4285F4'}}>i</span>
                <span style={{
                  width: '250px',
                  backgroundColor: '#E0E0E0',
                  color: '#000',
                  textAlign: 'left',
                  borderRadius: '6px',
                  padding: '10px',
                  position: 'absolute',
                  zIndex: '1',
                  bottom: '125%',
                  left: '50%',
                  marginLeft: '-125px',
                  opacity: showTooltip ? '1' : '0',
                  visibility: showTooltip ? 'visible' : 'hidden',
                  transition: 'opacity 0.375s',
                  border: '1px solid #E0E0E0',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
                  fontSize: '0.8em'
                }}>
                  Ensure the applications.json file complies with the expected JSON schema.
                </span>
              </div>
              <span style={{ color: 'black' }}>Upload new applications.</span>
            </div>
          </td>
          <td style={{ padding: '8px', verticalAlign: 'middle', width: '25%' }}>
            <label htmlFor={fileInputId} className="UploadState-button UploadState-button-choose-file">
              Choose File
            </label>
            <input id={fileInputId} type="file" accept=".json" style={{ display: 'none' }} onChange={(event) => onNewApplicationsFileChange(event, clearStore, handleFileChange, onValidationChange, setValidationError)} />
          </td>
          <td style={{ padding: '8px', verticalAlign: 'middle', textAlign: 'left', width: '15%' }}>
            <span className="UploadState-file-name" style={{ fontSize: '0.8em' }}>
              {selectedFile ? selectedFile.name : 'No file selected'}
            </span>
          </td>
          <td style={{ padding: '8px', verticalAlign: 'middle', textAlign: 'right', width: '15%' }}>
            {validationError ? (
              <span style={{ color: 'red', fontSize: '0.8em' }}>
                {validationError}
              </span>
            ) : (
              loadedCount !== null && (
                <span style={{ color: 'green', fontSize: '0.8em' }}>
                  {loadedCount} applications
                </span>
              )
            )}
          </td>
        </tr>
      </tbody>
    </table>
  );
}

export default UploadNewApplicationsFile;