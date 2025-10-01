import { useState, useEffect } from 'react';

// Función para hashear contraseñas de forma simple (para uso offline)
const simpleHash = (str) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convertir a 32bit integer
  }
  return hash.toString();
};

// Función para generar un salt único
const generateSalt = () => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

// Función para hashear con salt
const hashWithSalt = (password, salt) => {
  return simpleHash(password + salt);
};

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentLibrary, setCurrentLibrary] = useState(null);
  const [loading, setLoading] = useState(true);

  // Cargar estado de autenticación al inicializar
  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = () => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData') || 'null');
      const activeLibrary = JSON.parse(localStorage.getItem('bibliotecaActiva') || 'null');
      
      if (authData && activeLibrary) {
        setCurrentLibrary(activeLibrary);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLibraryAuth = (libraryData, authMethod, authValue) => {
    const salt = generateSalt();
    const hashedValue = hashWithSalt(authValue, salt);
    
    const authData = {
      libraryId: libraryData.id,
      authMethod, // 'password' o 'pin'
      hashedValue,
      salt,
      createdAt: new Date().toISOString()
    };

    // Guardar datos de autenticación
    localStorage.setItem('authData', JSON.stringify(authData));
    
    return authData;
  };

  const authenticate = (libraryId, authValue) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData') || 'null');
      
      if (!authData || authData.libraryId !== libraryId) {
        return { success: false, message: 'Biblioteca no encontrada' };
      }

      const hashedInput = hashWithSalt(authValue, authData.salt);
      
      if (hashedInput === authData.hashedValue) {
        setIsAuthenticated(true);
        // Buscar la biblioteca en localStorage
        const libraries = JSON.parse(localStorage.getItem('bibliotecas') || '[]');
        const library = libraries.find(lib => lib.id === libraryId);
        if (library) {
          setCurrentLibrary(library);
          localStorage.setItem('bibliotecaActiva', JSON.stringify(library));
        }
        return { success: true, message: 'Autenticación exitosa' };
      } else {
        return { success: false, message: 'Credenciales incorrectas' };
      }
    } catch (error) {
      console.error('Error during authentication:', error);
      return { success: false, message: 'Error durante la autenticación' };
    }
  };

  const logout = () => {
    setIsAuthenticated(false);
    setCurrentLibrary(null);
    localStorage.removeItem('authData');
    // El componente que use este hook debe manejar la navegación
  };

  const updateAuth = (newAuthValue) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData') || 'null');
      if (!authData) return false;

      const salt = generateSalt();
      const hashedValue = hashWithSalt(newAuthValue, salt);
      
      const updatedAuthData = {
        ...authData,
        hashedValue,
        salt,
        updatedAt: new Date().toISOString()
      };

      localStorage.setItem('authData', JSON.stringify(updatedAuthData));
      return true;
    } catch (error) {
      console.error('Error updating auth:', error);
      return false;
    }
  };

  const hasAuth = (libraryId) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData') || 'null');
      return authData && authData.libraryId === libraryId;
    } catch (error) {
      return false;
    }
  };

  const getAuthMethod = (libraryId) => {
    try {
      const authData = JSON.parse(localStorage.getItem('authData') || 'null');
      return authData && authData.libraryId === libraryId ? authData.authMethod : null;
    } catch (error) {
      return null;
    }
  };

  return {
    isAuthenticated,
    currentLibrary,
    loading,
    createLibraryAuth,
    authenticate,
    logout,
    updateAuth,
    hasAuth,
    getAuthMethod
  };
};
