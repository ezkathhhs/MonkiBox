import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import AdminLayout from '../components/4_templates/AdminLayout';
import Button from '../components/1_atoms/Button';
import SuccessToast from '../components/1_atoms/SuccessToast';
import './AdminProfilePage.css';

const AdminProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [previewImage, setPreviewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastVisible, setToastVisible] = useState(false);

  // Cargar imagen actual al iniciar
  useEffect(() => {
    if (user && user.profile_picture) {
      setPreviewImage(user.profile_picture);
    }
  }, [user]);

  // 1. Manejar la selección de archivo (Convertir a Base64)
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result); // Guardamos la cadena Base64 para previsualizar
      };
      reader.readAsDataURL(file);
    }
  };

  // 2. Guardar cambios en la Base de Datos
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      // Enviamos los datos actuales + la nueva imagen
      const response = await api.put(`/users/${user.user_id}`, {
        name: user.name,
        email: user.email,
        role: user.role,
        profile_picture: previewImage // Enviamos la cadena de la imagen
      });

      // Actualizamos el contexto global
      updateUser(response.data);
      
      setToastVisible(true);
      setTimeout(() => setToastVisible(false), 3000);
    } catch (error) {
      console.error("Error al actualizar perfil:", error);
      alert("Error al guardar la imagen. Puede que sea muy pesada.");
    } finally {
      setLoading(false);
    }
  };

  // 3. Eliminar foto (volver a default)
  const handleDeleteImage = () => {
    setPreviewImage(null); // null hará que se muestre la imagen por defecto
  };

  if (!user) return null;

  return (
    <AdminLayout>
      <div className="profile-container">
        <h1>Mi Perfil</h1>
        
        <div className="profile-card">
          {/* Sección de Imagen */}
          <div className="profile-image-section">
            <div className="image-wrapper">
              <img 
                src={previewImage || '/mono.jpg'} // Usa preview O mono.jpg por defecto
                alt="Perfil" 
                className="profile-pic"
              />
            </div>
            
            <div className="image-actions">
              {/* Input oculto trucado */}
              <label htmlFor="file-upload" className="custom-file-upload">
                Seleccionar Imagen
              </label>
              <input 
                id="file-upload" 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
              />

              <button onClick={handleDeleteImage} className="delete-photo-btn">
                Eliminar Foto
              </button>
            </div>
          </div>

          <hr className="divider" />

          {/* Sección de Información */}
          <div className="profile-info-section">
            <div className="info-group">
              <label>Nombre Completo</label>
              <p>{user.name}</p>
            </div>
            <div className="info-group">
              <label>Correo Electrónico</label>
              <p>{user.email}</p>
            </div>
            <div className="info-group">
              <label>Rol</label>
              <span className="role-badge">{user.role}</span>
            </div>
            <div className="info-group">
              <label>Fecha de Creación</label>
              <p>{new Date(user.created_at).toLocaleDateString('es-ES')}</p>
            </div>
          </div>

          <div className="save-section">
            <Button onClick={handleSaveProfile} disabled={loading}>
              {loading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </div>

        <SuccessToast message="Perfil actualizado correctamente" isVisible={toastVisible} />
      </div>
    </AdminLayout>
  );
};

export default AdminProfilePage;