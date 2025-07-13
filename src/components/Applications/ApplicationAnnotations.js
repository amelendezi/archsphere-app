import React, { useState, useEffect, useCallback } from 'react';
import './ApplicationAnnotations.css';
import { useIndexedDB } from '../../hooks/useIndexedDB';

const ApplicationAnnotations = ({ application }) => {
  const [annotations, setAnnotations] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState('');

  const { getAnnotations, addAnnotation } = useIndexedDB();

  const fetchAnnotations = useCallback(async () => {
    if (application) {
      const data = await getAnnotations(application.ID);
      if (data) {
        setAnnotations(data);
      }
    }
  }, [application, getAnnotations]);

  useEffect(() => {
    fetchAnnotations();
  }, [fetchAnnotations]);

  const handleAddAnnotation = useCallback(async () => {
    if (newAnnotation.trim() !== '') {
      await addAnnotation(application.ID, newAnnotation);
      fetchAnnotations();
      setNewAnnotation('');
      setIsDialogOpen(false);
    }
  }, [application, newAnnotation, addAnnotation, fetchAnnotations]);

  return (
    <div className="application-annotations-container">
      <div className="annotations-header">
        <h3>Annotations</h3>
        <button className="new-annotation-btn" onClick={() => setIsDialogOpen(true)}>+</button>
      </div>

      {isDialogOpen && (
        <div className="annotation-dialog">
          <div className="annotation-dialog-content">
            <h4>New Annotation</h4>
            <textarea
              maxLength="250"
              value={newAnnotation}
              onChange={(e) => setNewAnnotation(e.target.value)}
            />
            <div className="dialog-buttons">
              <button onClick={handleAddAnnotation}>Save</button>
              <button onClick={() => setIsDialogOpen(false)}>Close</button>
            </div>
          </div>
        </div>
      )}

      <div className="annotations-list">
        {annotations.map((annotation, index) => (
          <div key={index} className="annotation-item">
            <p className="annotation-comment">{annotation.comment}</p>
            <p className="annotation-meta">
              {annotation.user} - {new Date(annotation.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ApplicationAnnotations;