import React, { useState } from 'react';
import { Eye, EyeOff, Copy, Check, X } from 'lucide-react';
import { mockCredentials } from '../utils/mockData.js';
import './MockCredentials.css';

const MockCredentials = ({ isOpen, onClose }) => {
  const [showCredentials, setShowCredentials] = useState({});
  const [copiedCredential, setCopiedCredential] = useState('');

  const toggleCredentialVisibility = (libraryId) => {
    setShowCredentials(prev => ({
      ...prev,
      [libraryId]: !prev[libraryId]
    }));
  };

  const copyToClipboard = async (text, libraryId) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCredential(libraryId);
      setTimeout(() => setCopiedCredential(''), 2000);
    } catch (err) {
      console.error('Error copying to clipboard:', err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="mock-credentials-overlay">
      <div className="mock-credentials-modal">
        <div className="mock-credentials-header">
          <div className="mock-credentials-title">
            <h2>🔑 Credenciales de Prueba</h2>
            <p>Usa estas credenciales para probar el sistema de autenticación</p>
          </div>
          <button 
            className="mock-credentials-close" 
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="mock-credentials-content">
          <div className="credentials-grid">
            {Object.entries(mockCredentials).map(([libraryId, creds]) => (
              <div key={libraryId} className="credential-card">
                <div className="credential-header">
                  <h3>Biblioteca Central UTN</h3>
                  <div className="credential-method">
                    {creds.method === 'pin' ? '🔢 PIN' : '🔐 Contraseña'}
                  </div>
                </div>
                
                <div className="credential-value">
                  <div className="credential-input-wrapper">
                    <input
                      type={showCredentials[libraryId] ? 'text' : (creds.method === 'pin' ? 'text' : 'password')}
                      value={creds.value}
                      readOnly
                      className="credential-input"
                    />
                    <button
                      className="credential-toggle"
                      onClick={() => toggleCredentialVisibility(libraryId)}
                    >
                      {showCredentials[libraryId] ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                    <button
                      className="credential-copy"
                      onClick={() => copyToClipboard(creds.value, libraryId)}
                      title="Copiar al portapapeles"
                    >
                      {copiedCredential === libraryId ? <Check size={16} /> : <Copy size={16} />}
                    </button>
                  </div>
                </div>

                <div className="credential-description">
                  {creds.description}
                </div>
              </div>
            ))}
          </div>

          <div className="mock-credentials-info">
            <div className="info-card">
              <h4>📝 Instrucciones de Uso</h4>
              <ol>
                <li>Haz clic en "Iniciar Sesión" en el navbar</li>
                <li>Selecciona una biblioteca de la lista</li>
                <li>Usa las credenciales mostradas arriba</li>
                <li>¡Explora el sistema completamente funcional!</li>
              </ol>
            </div>

            <div className="info-card">
              <h4>🔄 Reiniciar Datos</h4>
              <p>Si quieres empezar de nuevo, puedes limpiar todos los datos mock:</p>
              <button 
                className="clear-data-btn"
                onClick={() => {
                  if (confirm('¿Estás seguro de que quieres eliminar todos los datos mock?')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
              >
                🗑️ Limpiar Datos Mock
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MockCredentials;
