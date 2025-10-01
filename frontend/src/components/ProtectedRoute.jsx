import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import AuthModal from './AuthModal';

const ProtectedRoute = ({ children, libraryId }) => {
  const { isAuthenticated, currentLibrary, loading, authenticate, hasAuth, getAuthMethod } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authError, setAuthError] = useState('');

  useEffect(() => {
    // Si no está cargando y no está autenticado, mostrar modal
    if (!loading && !isAuthenticated) {
      // Verificar si la biblioteca tiene autenticación configurada
      if (libraryId && hasAuth(libraryId)) {
        setShowAuthModal(true);
      }
    }
  }, [loading, isAuthenticated, libraryId, hasAuth]);

  const handleAuthSuccess = async (authValue) => {
    try {
      const result = await authenticate(libraryId, authValue);
      
      if (result.success) {
        setShowAuthModal(false);
        setAuthError('');
      } else {
        setAuthError(result.message);
      }
    } catch (error) {
      setAuthError('Error durante la autenticación');
    }
  };

  const handleCloseModal = () => {
    setShowAuthModal(false);
    setAuthError('');
  };

  // Mostrar loading mientras se verifica la autenticación
  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Verificando acceso...
      </div>
    );
  }

  // Si no hay biblioteca seleccionada, mostrar mensaje
  if (!libraryId) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'white',
        fontSize: '1.2rem',
        textAlign: 'center',
        flexDirection: 'column',
        gap: '16px'
      }}>
        <p>No hay biblioteca seleccionada</p>
        <p style={{ fontSize: '1rem', color: '#9ca3af' }}>
          Por favor, selecciona una biblioteca para continuar
        </p>
      </div>
    );
  }

  // Si la biblioteca no tiene autenticación configurada, permitir acceso
  if (!hasAuth(libraryId)) {
    return children;
  }

  // Si no está autenticado, mostrar modal de autenticación
  if (!isAuthenticated) {
    return (
      <>
        <AuthModal
          isOpen={showAuthModal}
          onClose={handleCloseModal}
          onSuccess={handleAuthSuccess}
          libraryName={currentLibrary?.nombre || 'Biblioteca'}
          authMethod={getAuthMethod(libraryId)}
          errorMessage={authError}
        />
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          height: '50vh',
          color: 'white',
          fontSize: '1.2rem'
        }}>
          Verificando acceso a la biblioteca...
        </div>
      </>
    );
  }

  // Si está autenticado y la biblioteca actual coincide, mostrar contenido
  if (currentLibrary && currentLibrary.id === libraryId) {
    return children;
  }

  // Si está autenticado pero con una biblioteca diferente, mostrar modal
  return (
    <>
      <AuthModal
        isOpen={showAuthModal}
        onClose={handleCloseModal}
        onSuccess={handleAuthSuccess}
        libraryName={currentLibrary?.nombre || 'Biblioteca'}
        authMethod={getAuthMethod(libraryId)}
        errorMessage={authError}
      />
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '50vh',
        color: 'white',
        fontSize: '1.2rem'
      }}>
        Verificando acceso a la biblioteca...
      </div>
    </>
  );
};

export default ProtectedRoute;
