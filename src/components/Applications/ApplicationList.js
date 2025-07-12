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

  return (
    <div className="application-list-container">
      {headers.length > 0 && <ApplicationListHeader headers={headers} />}
      {applications.map((app) => (
        <ApplicationListRow key={app.ID} record={app} />
      ))}
    </div>
  );
};

export default ApplicationList;