import React, { useState, useEffect, useCallback } from 'react';
import './ApplicationAnnotations.css';
import { useIndexedDB } from '../../hooks/useIndexedDB';

const ApplicationAnnotations = ({ application }) => {
  const [annotations, setAnnotations] = useState([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newAnnotation, setNewAnnotation] = useState('');
  const [selectedAnnotation, setSelectedAnnotation] = useState(null);

  const { getAnnotations, addAnnotation, deleteAnnotation } = useIndexedDB();

  const fetchAnnotations = useCallback(async () => {
    if (application) {
      const data = await getAnnotations(application.ID);
      setAnnotations(data || []);
    } else {
      setAnnotations([]);
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

  const handleDeleteAnnotation = useCallback(async () => {
    if (selectedAnnotation) {
      await deleteAnnotation(application.ID, selectedAnnotation);
      fetchAnnotations();
      closeDialog();
    }
  }, [application, selectedAnnotation, deleteAnnotation, fetchAnnotations]);

  const openNewAnnotationDialog = () => {
    setSelectedAnnotation(null);
    setIsDialogOpen(true);
  };

  const openViewAnnotationDialog = (annotation) => {
    setSelectedAnnotation(annotation);
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setNewAnnotation('');
    setSelectedAnnotation(null);
  };

  return (
    <div className="application-annotations-container">
      <div className="annotations-header">
        <h3>Annotations</h3>
        <button className="new-annotation-btn" onClick={openNewAnnotationDialog}>+</button>
      </div>

      {isDialogOpen && (
        <div className="annotation-dialog">
          <div className="annotation-dialog-content">
            {selectedAnnotation ? (
              <div>
                <h4>Annotation Details</h4>
                <p className="annotation-comment-dialog">{selectedAnnotation.comment}</p>
                <p className="annotation-meta-dialog">{selectedAnnotation.user} - {new Date(selectedAnnotation.timestamp).toLocaleString()}</p>
                <div className="dialog-footer">
                  <button className="delete-btn" onClick={handleDeleteAnnotation}>🗑️</button>
                  <button onClick={closeDialog}>Close</button>
                </div>
              </div>
            ) : (
              <div>
                <h4>Write your annotation below:</h4>
                <textarea
                  maxLength="250"
                  value={newAnnotation}
                  onChange={(e) => setNewAnnotation(e.target.value)}
                />
                <div className="dialog-buttons">
                  <button className="dialog-btn close-btn" onClick={closeDialog}>Close</button>
                  <button className="dialog-btn save-btn" onClick={handleAddAnnotation}>Save</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      <div className="annotations-list">
        {annotations.map((annotation, index) => (
          <div key={index} className="annotation-item" onClick={() => openViewAnnotationDialog(annotation)}>
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