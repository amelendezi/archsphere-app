import React, { useState, useEffect } from 'react';
import './ApplicationList.css';
import { useIndexedDB } from '../../hooks/useIndexedDB';
import { SETUP_ENV_APPLICATIONS_STORE_NAME } from '../../config/dbConfig';
import ApplicationListRow from './ApplicationListRow';
import ApplicationListHeader from './ApplicationListHeader';

const ApplicationList = () => {
  const [applications, setApplications] = useState([]);
  const { getAllApplications } = useIndexedDB();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getAllApplications(SETUP_ENV_APPLICATIONS_STORE_NAME);
        setApplications(data);
      } catch (error) {
        console.error("Error fetching applications from IndexedDB:", error);
      }
    };

    fetchApplications();
  }, [getAllApplications]);

  const headers = applications.length > 0 ? Object.keys(applications[0]) : [];
  const excludedHeaders = ["ID", "Vendor", "Operational status", "portfolio", "functional description", "Functional Description", "Owning Business"];
  const filteredHeaders = headers.filter(header => !excludedHeaders.includes(header));

  const filteredApplications = applications.map(app => {
    const filteredApp = {};
    filteredHeaders.forEach(header => {
      filteredApp[header] = app[header];
    });
    return filteredApp;
  });

  return (
    <div className="application-list-container">
      {filteredHeaders.length > 0 && <ApplicationListHeader headers={filteredHeaders} />}
      {filteredApplications.map((app, index) => (
        <ApplicationListRow key={index} record={app} />
      ))}
    </div>
  );
};

export default ApplicationList;