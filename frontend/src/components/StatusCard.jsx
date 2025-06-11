import React, { useState } from "react";
import defaultPic from '../assets/defaultpic.png';

export default function StatusCard({ userProfile, onSaveProfile }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    nickName: userProfile?.profile?.nickName || '',
    classification: userProfile?.profile?.classification || '',
    profilePic: userProfile?.profile?.profilePic || ''
  });

  if (!userProfile || !userProfile.profile || !userProfile.statusBar) {
    return <div className="loading-message">Carregando dados do perfil...</div>;
  }

  const { profile, statusBar } = userProfile;
  const { health, stamina } = statusBar;

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
    if (isEditing) {
      setEditForm({
        nickName: profile.nickName,
        classification: profile.classification,
        profilePic: profile.profilePic
      });
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value
    });
  };

const handleSaveProfile = () => {
  if (typeof onSaveProfile === "function") {
    onSaveProfile(editForm);
  }
  setIsEditing(false);
};

  return (
    <div className="status-card">
      <div className="profile-content">
        <div className="profile-left">
          <div className="profile-pic-frame">
            <img
              src={isEditing ? editForm.profilePic || defaultPic : profile.profilePic || defaultPic}
              alt="foto de perfil"
              className="profile-pic"
            />
            {isEditing && (
              <div className="pic-url-container">
                <input
                  type="text"
                  name="profilePic"
                  value={editForm.profilePic}
                  onChange={handleEditChange}
                  placeholder="Cole o URL da imagem"
                  className="pic-url-input"
                />
              </div>
            )}
          </div>

          <div className="profile-edit-controls">
            <button
              onClick={handleEditToggle}
              className={`edit-profile-btn ${isEditing ? 'cancel' : ''}`}
            >
              {isEditing ? "Cancelar" : "Editar Perfil"}
            </button>

            {isEditing && (
              <button
                onClick={handleSaveProfile}
                className="save-profile-btn"
              >
                Salvar
              </button>
            )}
          </div>
        </div>

        <div className="profile-right">
          <div className="status-info">
            {isEditing ? (
              <div className="profile-name-edit">
                <input
                  type="text"
                  name="nickName"
                  value={editForm.nickName}
                  onChange={handleEditChange}
                  className="name-input"
                  placeholder="Nome"
                />
                <input
                  type="text"
                  name="classification"
                  value={editForm.classification}
                  onChange={handleEditChange}
                  className="classification-input"
                  placeholder="Alcunha"
                />
              </div>
            ) : (
              <div className="name-section">
                <h2>{profile.nickName}</h2>
                <h2 className="classification">{profile.classification}</h2>
              </div>
            )}

            <div className="bar-section">
              <p>Saúde: {health.value} / {health.maxValue}</p>
              <div className="bar-healt">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(health.value / health.maxValue) * 100}%`
                  }}
                ></div>
              </div>
            </div>

            <div className="bar-section-stamina">
              <p>Estamina: {stamina.value} / {stamina.maxValue}</p>
              <div className="bar-stamina">
                <div
                  className="bar-fill"
                  style={{
                    width: `${(stamina.value / stamina.maxValue) * 100}%`
                  }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}