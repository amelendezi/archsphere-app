import React from 'react';
import './ApplicationDetail.css';

const ApplicationDetail = ({ application }) => {
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

      <div className="application-detail-body">
        {Object.entries(application).map(([key, value]) => {
          // Exclude ID from detail view as well, if it's not needed
          if (key === "ID") return null;

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

      <div className="application-detail-annotations">
        <p>Here will be annotations.</p>
      </div>
    </div>
  );
};

export default ApplicationDetail;