import React, { useState } from 'react';
import './ApplicationDetail.css';

const ApplicationDetail = ({ application }) => {
  const [isBodyVisible, setBodyVisible] = useState(true);
  const [isAnnotationsVisible, setAnnotationsVisible] = useState(false);

  if (!application) {
    return (
      <div className="application-detail-container">
        <h2>Select an application to see the details</h2>
      </div>
    );
  }

  const verticalLayoutProperties = ["Functional Description", "Portfolio"];

  return (
    <div className="application-detail-container">
      <div className="application-detail-header">
        <h2>{application.Name}</h2>
      </div>

      <div className="collapsible-section">
        <div className="collapsible-header" onClick={() => setBodyVisible(!isBodyVisible)}>
          <h3>Details</h3>
          <span className="collapse-icon">{isBodyVisible ? '▲' : '▼'}</span>
        </div>
        {isBodyVisible && (
          <div className="application-detail-body">
            {Object.entries(application).map(([key, value]) => {
              if (key === "ID" || key === "Name") return null;

              const isVertical = verticalLayoutProperties.includes(key);
              const propertyClassName = `application-detail-property ${isVertical ? 'vertical' : 'horizontal'}`;

              return (
                <div key={key} className={propertyClassName}>
                  <div className="application-detail-property-label">{key}:</div>
                  <div className="application-detail-property-value">{value}</div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <div className="collapsible-section">
        <div className="collapsible-header" onClick={() => setAnnotationsVisible(!isAnnotationsVisible)}>
          <h3>Annotations</h3>
          <span className="collapse-icon">{isAnnotationsVisible ? '▲' : '▼'}</span>
        </div>
        {isAnnotationsVisible && (
          <div className="application-detail-annotations">
            <p>Here will be annotations.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApplicationDetail;
