import React, { useState } from 'react';
import { Lock, Key, Eye, EyeOff, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth.js';
import './AuthSettings.css';

const AuthSettings = ({ libraryId, onClose }) => {
  const { updateAuth, getAuthMethod } = useAuth();
  const [currentAuth, setCurrentAuth] = useState('');
  const [newAuth, setNewAuth] = useState('');
  const [confirmAuth, setConfirmAuth] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const authMethod = getAuthMethod(libraryId);
  const isPin = authMethod === 'pin';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validaciones
    if (!currentAuth.trim()) {
      setError('Debes ingresar la credencial actual');
      return;
    }

    if (!newAuth.trim()) {
      setError('Debes ingresar la nueva credencial');
      return;
    }

    if (isPin && newAuth.length < 4) {
      setError('El PIN debe tener al menos 4 dígitos');
      return;
    }

    if (!isPin && newAuth.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return;
    }

    if (newAuth !== confirmAuth) {
      setError('Las credenciales nuevas no coinciden');
      return;
    }

    setIsLoading(true);

    try {
      // Aquí podrías agregar validación de la credencial actual
      // Por ahora, actualizamos directamente
      const success = updateAuth(newAuth);
      
      if (success) {
        setSuccess('Credenciales actualizadas exitosamente');
        setCurrentAuth('');
        setNewAuth('');
        setConfirmAuth('');
        
        // Cerrar modal después de 2 segundos
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        setError('Error al actualizar las credenciales');
      }
    } catch (err) {
      setError('Error al actualizar las credenciales');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (setter, value) => {
    if (isPin) {
      const numericValue = value.replace(/\D/g, '');
      setter(numericValue);
    } else {
      setter(value);
    }
    
    // Limpiar errores cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const handleKeyPress = (e) => {
    if (isPin && !/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="auth-settings-overlay">
      <div className="auth-settings-modal">
        <div className="auth-settings-header">
          <div className="auth-settings-title">
            <Lock size={20} />
            <h2>Configuración de Acceso</h2>
          </div>
          <button 
            className="auth-settings-close" 
            onClick={onClose}
            disabled={isLoading}
          >
            ×
          </button>
        </div>

        <div className="auth-settings-content">
          <div className="auth-method-info">
            <div className="auth-method-icon">
              {isPin ? <Key size={24} /> : <Lock size={24} />}
            </div>
            <p>
              {isPin 
                ? 'Actualiza tu PIN de acceso a la biblioteca'
                : 'Actualiza tu contraseña de acceso a la biblioteca'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-settings-form">
            <div className="auth-input-group">
              <label htmlFor="currentAuth" className="auth-label">
                {isPin ? 'PIN Actual' : 'Contraseña Actual'}
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="currentAuth"
                  type={showCurrent ? 'text' : (isPin ? 'text' : 'password')}
                  value={currentAuth}
                  onChange={(e) => handleInputChange(setCurrentAuth, e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isPin ? 'Ingresa tu PIN actual' : 'Ingresa tu contraseña actual'}
                  className="auth-input"
                  disabled={isLoading}
                  autoComplete="current-password"
                />
                {!isPin && (
                  <button
                    type="button"
                    className="auth-toggle-visibility"
                    onClick={() => setShowCurrent(!showCurrent)}
                    disabled={isLoading}
                  >
                    {showCurrent ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="newAuth" className="auth-label">
                {isPin ? 'Nuevo PIN' : 'Nueva Contraseña'}
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="newAuth"
                  type={showNew ? 'text' : (isPin ? 'text' : 'password')}
                  value={newAuth}
                  onChange={(e) => handleInputChange(setNewAuth, e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isPin ? 'Ingresa tu nuevo PIN' : 'Ingresa tu nueva contraseña'}
                  className="auth-input"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                {!isPin && (
                  <button
                    type="button"
                    className="auth-toggle-visibility"
                    onClick={() => setShowNew(!showNew)}
                    disabled={isLoading}
                  >
                    {showNew ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            </div>

            <div className="auth-input-group">
              <label htmlFor="confirmAuth" className="auth-label">
                Confirmar {isPin ? 'PIN' : 'Contraseña'}
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="confirmAuth"
                  type={showConfirm ? 'text' : (isPin ? 'text' : 'password')}
                  value={confirmAuth}
                  onChange={(e) => handleInputChange(setConfirmAuth, e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={isPin ? 'Confirma tu nuevo PIN' : 'Confirma tu nueva contraseña'}
                  className="auth-input"
                  disabled={isLoading}
                  autoComplete="new-password"
                />
                {!isPin && (
                  <button
                    type="button"
                    className="auth-toggle-visibility"
                    onClick={() => setShowConfirm(!showConfirm)}
                    disabled={isLoading}
                  >
                    {showConfirm ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                )}
              </div>
            </div>

            {error && (
              <div className="auth-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="auth-success">
                <CheckCircle size={16} />
                <span>{success}</span>
              </div>
            )}

            <div className="auth-actions">
              <button
                type="button"
                className="auth-cancel-btn"
                onClick={onClose}
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="auth-submit-btn"
                disabled={isLoading || !currentAuth.trim() || !newAuth.trim() || !confirmAuth.trim()}
              >
                <Save size={16} />
                {isLoading ? 'Actualizando...' : 'Actualizar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthSettings;
