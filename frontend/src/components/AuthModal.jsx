import React, { useState, useEffect } from 'react';
import { Lock, Key, Eye, EyeOff, X, AlertCircle } from 'lucide-react';
import './AuthModal.css';

const AuthModal = ({ 
  isOpen, 
  onClose, 
  onSuccess, 
  libraryName, 
  authMethod, 
  errorMessage 
}) => {
  const [authValue, setAuthValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(errorMessage || '');

  // Limpiar el formulario cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setAuthValue('');
      setError('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!authValue.trim()) {
      setError('Por favor ingresa tu credencial de acceso');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await onSuccess(authValue);
    } catch (err) {
      setError(err.message || 'Error durante la autenticación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    
    // Si es PIN, solo permitir números
    if (authMethod === 'pin') {
      const numericValue = value.replace(/\D/g, '');
      setAuthValue(numericValue);
    } else {
      setAuthValue(value);
    }
    
    // Limpiar error cuando el usuario empiece a escribir
    if (error) {
      setError('');
    }
  };

  const handleKeyPress = (e) => {
    // Si es PIN, solo permitir números
    if (authMethod === 'pin' && !/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab', 'Enter'].includes(e.key)) {
      e.preventDefault();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <div className="auth-modal-header">
          <div className="auth-modal-title">
            <Lock size={20} />
            <h2>Acceso a {libraryName}</h2>
          </div>
          <button 
            className="auth-modal-close" 
            onClick={onClose}
            disabled={isLoading}
          >
            <X size={20} />
          </button>
        </div>

        <div className="auth-modal-content">
          <div className="auth-method-info">
            <div className="auth-method-icon">
              {authMethod === 'pin' ? <Key size={24} /> : <Lock size={24} />}
            </div>
            <p className="auth-method-text">
              {authMethod === 'pin' 
                ? 'Ingresa tu PIN numérico para acceder a la biblioteca'
                : 'Ingresa tu contraseña para acceder a la biblioteca'
              }
            </p>
          </div>

          <form onSubmit={handleSubmit} className="auth-form">
            <div className="auth-input-group">
              <label htmlFor="authValue" className="auth-label">
                {authMethod === 'pin' ? 'PIN' : 'Contraseña'}
              </label>
              <div className="auth-input-wrapper">
                <input
                  id="authValue"
                  type={authMethod === 'pin' ? 'text' : (showPassword ? 'text' : 'password')}
                  value={authValue}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={authMethod === 'pin' ? 'Ingresa tu PIN' : 'Ingresa tu contraseña'}
                  className="auth-input"
                  disabled={isLoading}
                  autoComplete="off"
                  maxLength={authMethod === 'pin' ? 10 : undefined}
                />
                {authMethod === 'password' && (
                  <button
                    type="button"
                    className="auth-toggle-visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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
                disabled={isLoading || !authValue.trim()}
              >
                {isLoading ? 'Verificando...' : 'Acceder'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
