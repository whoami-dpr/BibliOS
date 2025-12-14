import React, { useState } from 'react';
import { Lock, Key, Eye, EyeOff, AlertCircle } from 'lucide-react';
import './AuthMethodSelector.css';

const AuthMethodSelector = ({ 
  onAuthMethodChange, 
  onAuthValueChange, 
  authMethod, 
  authValue, 
  error 
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleMethodChange = (method) => {
    onAuthMethodChange(method);
    // Limpiar el valor cuando cambie el método
    onAuthValueChange('');
  };

  const handleValueChange = (e) => {
    const value = e.target.value;
    
    // Si es PIN, solo permitir números
    if (authMethod === 'pin') {
      const numericValue = value.replace(/\D/g, '');
      onAuthValueChange(numericValue);
    } else {
      onAuthValueChange(value);
    }
  };

  const handleKeyPress = (e) => {
    // Si es PIN, solo permitir números
    if (authMethod === 'pin' && !/\d/.test(e.key) && !['Backspace', 'Delete', 'Tab'].includes(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="auth-method-selector">
      <div className="auth-method-header">
        <Lock size={20} />
        <h3>Método de Verificación</h3>
        <p>Configura cómo se accederá a esta biblioteca</p>
      </div>

      <div className="auth-method-options">
        <div 
          className={`auth-method-option ${authMethod === 'password' ? 'selected' : ''}`}
          onClick={() => handleMethodChange('password')}
        >
          <div className="auth-method-icon">
            <Lock size={24} />
          </div>
          <div className="auth-method-content">
            <h4>Contraseña</h4>
            <p>Usa una contraseña alfanumérica para mayor seguridad</p>
          </div>
          <div className="auth-method-radio">
            <input
              type="radio"
              name="authMethod"
              value="password"
              checked={authMethod === 'password'}
              onChange={() => handleMethodChange('password')}
            />
          </div>
        </div>

        <div 
          className={`auth-method-option ${authMethod === 'pin' ? 'selected' : ''}`}
          onClick={() => handleMethodChange('pin')}
        >
          <div className="auth-method-icon">
            <Key size={24} />
          </div>
          <div className="auth-method-content">
            <h4>PIN Numérico</h4>
            <p>Usa un código numérico simple y fácil de recordar</p>
          </div>
          <div className="auth-method-radio">
            <input
              type="radio"
              name="authMethod"
              value="pin"
              checked={authMethod === 'pin'}
              onChange={() => handleMethodChange('pin')}
            />
          </div>
        </div>
      </div>

      {authMethod && (
        <div className="auth-value-input">
          <label htmlFor="authValue" className="auth-value-label">
            {authMethod === 'pin' ? 'PIN de Acceso' : 'Contraseña de Acceso'}
            <span className="required">*</span>
          </label>
          
          <div className="auth-value-wrapper">
            <input
              id="authValue"
              type={authMethod === 'pin' ? 'text' : (showPassword ? 'text' : 'password')}
              value={authValue}
              onChange={handleValueChange}
              onKeyPress={handleKeyPress}
              placeholder={
                authMethod === 'pin' 
                  ? 'Ingresa un PIN numérico (ej: 1234)' 
                  : 'Ingresa una contraseña segura'
              }
              className="auth-value-input-field"
              autoComplete="new-password"
              maxLength={authMethod === 'pin' ? 10 : undefined}
            />
            
            {authMethod === 'password' && (
              <button
                type="button"
                className="auth-value-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            )}
          </div>

          <div className="auth-value-help">
            {authMethod === 'pin' ? (
              <p>Recomendamos usar al menos 4 dígitos para mayor seguridad</p>
            ) : (
              <p>Usa al menos 6 caracteres con letras y números</p>
            )}
          </div>

          {error && (
            <div className="auth-value-error">
              <AlertCircle size={16} />
              <span>{error}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AuthMethodSelector;
