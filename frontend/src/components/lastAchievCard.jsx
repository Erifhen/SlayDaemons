import React, { useState } from "react";

export default function LastAchievCard({ achieves, onEdit, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedAchiev, setEditedAchiev] = useState(achieves);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!achieves) {
    return <p className="loading-message">Nenhuma conquista recente encontrada.</p>;
  }

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEdit(editedAchiev);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedAchiev(achieves); // Reseta para os valores originais
  };

  const handleDeleteConfirm = () => {
    onDelete(achieves.id);
    setShowDeleteConfirm(false);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedAchiev(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const achv = isEditing ? editedAchiev : achieves;

  return (
    <div className={`achievement-card ${achv.isPrestige ? "prestige" : ""}`}>
      <div className="achievement-header">
        {isEditing ? (
          <input
            type="text"
            name="title"
            value={editedAchiev.title}
            onChange={handleChange}
            className="achievement-edit-input"
          />
        ) : (
          <span className="achievement-title">{achv.title}</span>
        )}
        {isEditing ? (
          <label className="achievement-edit-checkbox">
            Prestígio:
            <input
              type="checkbox"
              name="isPrestige"
              checked={editedAchiev.isPrestige}
              onChange={handleChange}
            />
          </label>
        ) : (
          achv.isPrestige && <span className="achievement-star">⭐</span>
        )}
      </div>

      <div className="achievement-image">
        {isEditing ? (
          <input
            type="text"
            name="icon"
            value={editedAchiev.icon}
            onChange={handleChange}
            className="achievement-edit-input"
          />
        ) : (
          <img src={achv.icon} alt={achv.title} />
        )}
      </div>

      <div className="achievement-description">
        {isEditing ? (
          <textarea
            name="description"
            value={editedAchiev.description}
            onChange={handleChange}
            className="achievement-edit-textarea"
          />
        ) : (
          <p>{achv.description}</p>
        )}
      </div>

      <div className="achievement-actions">
        {!isEditing ? (
          <button onClick={handleEdit} className="edit-button">
            Editar
          </button>
        ) : (
          <>
            <button onClick={handleSave} className="save-button">
              Salvar
            </button>
            <button onClick={handleCancel} className="cancel-button">
              Cancelar
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(true)} 
              className="delete-button"
            >
              Excluir
            </button>
          </>
        )}
      </div>

      {showDeleteConfirm && (
        <div className="delete-confirmation-modal">
          <p>Tem certeza que deseja excluir esta conquista?</p>
          <div className="confirmation-buttons">
            <button onClick={handleDeleteConfirm} className="confirm-delete-button">
              Sim, excluir
            </button>
            <button 
              onClick={() => setShowDeleteConfirm(false)} 
              className="cancel-delete-button"
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}