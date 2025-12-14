// Mock data para BibliOS
export const mockLibraries = [
  {
    id: 'mock-library-1',
    nombre: 'Biblioteca Central UTN',
    direccion: 'Av. Universidad 123, Villa María',
    telefono: '(353) 123-4567',
    email: 'biblioteca@utn.edu.ar',
    responsable: 'Dr. María González',
    horarios: 'Lunes a Viernes 8:00 - 18:00',
    descripcion: 'Biblioteca principal de la Universidad Tecnológica Nacional',
    fechaCreacion: '2024-01-15T10:00:00.000Z',
    activa: true
  }
];

export const mockAuthData = [
  {
    libraryId: 'mock-library-1',
    authMethod: 'password',
    hashedValue: '123456789', // Hash de "biblioteca123"
    salt: 'mock-salt-1',
    createdAt: '2024-01-15T10:00:00.000Z'
  }
];

// Función para inicializar datos mock
export const initializeMockData = () => {
  // Solo inicializar si no hay datos existentes
  if (!localStorage.getItem('bibliotecas') || JSON.parse(localStorage.getItem('bibliotecas')).length === 0) {
    localStorage.setItem('bibliotecas', JSON.stringify(mockLibraries));
    localStorage.setItem('authData', JSON.stringify(mockAuthData[0])); // Solo la primera biblioteca activa
    // NO establecer bibliotecaActiva automáticamente - el usuario debe autenticarse
    console.log('Datos mock inicializados correctamente');
  }
};

// Función para limpiar datos mock
export const clearMockData = () => {
  localStorage.removeItem('bibliotecas');
  localStorage.removeItem('authData');
  localStorage.removeItem('bibliotecaActiva');
  console.log('Datos mock eliminados');
};

// Función para agregar más bibliotecas mock
export const addMockLibrary = (libraryData) => {
  const existingLibraries = JSON.parse(localStorage.getItem('bibliotecas') || '[]');
  const newLibrary = {
    id: `mock-library-${Date.now()}`,
    ...libraryData,
    fechaCreacion: new Date().toISOString(),
    activa: false
  };
  
  existingLibraries.push(newLibrary);
  localStorage.setItem('bibliotecas', JSON.stringify(existingLibraries));
  
  return newLibrary;
};

// Función para simular estadísticas de biblioteca
export const getMockLibraryStats = (libraryId) => {
  const stats = {
    'mock-library-1': {
      totalLibros: 1250,
      totalSocios: 172,
      prestamosActivos: 45,
      prestamosVencidos: 8,
      prestamosCompletados: 1247
    }
  };
  
  return stats[libraryId] || {
    totalLibros: 0,
    totalSocios: 0,
    prestamosActivos: 0,
    prestamosVencidos: 0,
    prestamosCompletados: 0
  };
};

// Credenciales de prueba para las bibliotecas mock
export const mockCredentials = {
  'mock-library-1': {
    method: 'password',
    value: 'biblioteca123',
    description: 'Contraseña: biblioteca123'
  }
};
