import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, MapPin, Phone, Mail, User, Building, Save, X } from 'lucide-react';
import './register.css';
import Navbar from './Navbar.jsx';
import { useLibrary } from './hooks/useLibrary.js';

function Register() {
  const navigate = useNavigate();
  const { libraries, createLibrary, selectLibrary, deleteLibrary } = useLibrary();
  const [formData, setFormData] = useState({
    nombre: '',
    direccion: '',
    telefono: '',
    email: '',
    responsable: '',
    horarios: '',
    descripcion: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre de la biblioteca es requerido';
    }
    
    if (!formData.direccion.trim()) {
      newErrors.direccion = 'La dirección es requerida';
    }
    
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'El email no es válido';
    }
    
    if (formData.telefono && !/^[\d\s\-\+\(\)]+$/.test(formData.telefono)) {
      newErrors.telefono = 'El teléfono no es válido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Crear nueva biblioteca usando el hook
      createLibrary(formData);
      
      // Mostrar mensaje de éxito
      alert('¡Biblioteca registrada exitosamente!');
      
      // Redirigir al dashboard
      navigate('/dashboard');
      
    } catch (error) {
      console.error('Error al registrar biblioteca:', error);
      alert('Error al registrar la biblioteca. Inténtalo de nuevo.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSelectLibrary = (biblioteca) => {
    selectLibrary(biblioteca);
    navigate('/dashboard');
  };

  const handleDeleteLibrary = (bibliotecaId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta biblioteca? Esta acción no se puede deshacer.')) {
      return;
    }

    deleteLibrary(bibliotecaId);
  };

  return (
    <>
      <Navbar />
      <div className="register-container">
        <div className="register-content">
          <div className="register-header">
            <button 
              className="back-button" 
              onClick={() => navigate('/')}
            >
              <X size={20} />
            </button>
                                 <div className="header-content">
                       <h1>Registro de Biblioteca</h1>
                       <span className="header-separator">|</span>
                       <p>Registrá tu biblioteca para comenzar a gestionar libros, socios y préstamos</p>
                     </div>
          </div>

          <div className="register-sections">
            {/* Formulario de registro */}
            <section className="register-form-section">
              <h2>Nueva Biblioteca</h2>
              <form onSubmit={handleSubmit} className="register-form">
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="nombre">
                      <Building size={16} />
                      Nombre de la biblioteca *
                    </label>
                    <input
                      type="text"
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      placeholder="Ej: Biblioteca Central"
                      className={errors.nombre ? 'error' : ''}
                    />
                    {errors.nombre && <span className="error-message">{errors.nombre}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="direccion">
                      <MapPin size={16} />
                      Dirección *
                    </label>
                    <input
                      type="text"
                      id="direccion"
                      name="direccion"
                      value={formData.direccion}
                      onChange={handleInputChange}
                      placeholder="Ej: Av. San Martín 123"
                      className={errors.direccion ? 'error' : ''}
                    />
                    {errors.direccion && <span className="error-message">{errors.direccion}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="telefono">
                      <Phone size={16} />
                      Teléfono
                    </label>
                    <input
                      type="tel"
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                      placeholder="Ej: (123) 456-7890"
                      className={errors.telefono ? 'error' : ''}
                    />
                    {errors.telefono && <span className="error-message">{errors.telefono}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="email">
                      <Mail size={16} />
                      Email
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Ej: info@biblioteca.com"
                      className={errors.email ? 'error' : ''}
                    />
                    {errors.email && <span className="error-message">{errors.email}</span>}
                  </div>
                </div>

                <div className="form-row form-row-2">
                  <div className="form-group">
                    <label htmlFor="responsable">
                      <User size={16} />
                      Responsable
                    </label>
                    <input
                      type="text"
                      id="responsable"
                      name="responsable"
                      value={formData.responsable}
                      onChange={handleInputChange}
                      placeholder="Ej: María González"
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="horarios">
                      <Library size={16} />
                      Horarios de atención
                    </label>
                    <input
                      type="text"
                      id="horarios"
                      name="horarios"
                      value={formData.horarios}
                      onChange={handleInputChange}
                      placeholder="Ej: Lunes a Viernes 8:00 - 18:00"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="descripcion">
                    <Library size={16} />
                    Descripción
                  </label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    placeholder="Breve descripción de la biblioteca..."
                    rows="3"
                  />
                </div>

                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isSubmitting}
                >
                  <Save size={18} />
                  {isSubmitting ? 'Registrando...' : 'Registrar Biblioteca'}
                </button>
              </form>
            </section>


          </div>
        </div>
      </div>
    </>
  );
}

export default Register; 