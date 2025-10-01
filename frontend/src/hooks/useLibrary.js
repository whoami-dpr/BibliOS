import { useState, useEffect } from 'react';
import { getMockLibraryStats } from '../utils/mockData.js';

export const useLibrary = () => {
  const [activeLibrary, setActiveLibrary] = useState(null);
  const [libraries, setLibraries] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar bibliotecas al inicializar
  useEffect(() => {
    loadLibraries();
  }, []);

  const loadLibraries = () => {
    try {
      const savedLibraries = JSON.parse(localStorage.getItem('bibliotecas') || '[]');
      const savedActiveLibrary = JSON.parse(localStorage.getItem('bibliotecaActiva') || 'null');
      
      setLibraries(savedLibraries);
      setActiveLibrary(savedActiveLibrary);
    } catch (error) {
      console.error('Error loading libraries:', error);
    } finally {
      setLoading(false);
    }
  };

  const createLibrary = (libraryData) => {
    const newLibrary = {
      id: Date.now().toString(),
      ...libraryData,
      fechaCreacion: new Date().toISOString(),
      activa: true
    };

    // Desactivar todas las bibliotecas anteriores
    const updatedLibraries = libraries.map(lib => ({
      ...lib,
      activa: false
    }));

    // Agregar la nueva biblioteca
    updatedLibraries.push(newLibrary);

    // Guardar en localStorage
    localStorage.setItem('bibliotecas', JSON.stringify(updatedLibraries));
    localStorage.setItem('bibliotecaActiva', JSON.stringify(newLibrary));

    // Actualizar estado
    setLibraries(updatedLibraries);
    setActiveLibrary(newLibrary);

    return newLibrary;
  };

  const selectLibrary = (library) => {
    // Desactivar todas las bibliotecas
    const updatedLibraries = libraries.map(lib => ({
      ...lib,
      activa: lib.id === library.id
    }));

    // Guardar cambios
    localStorage.setItem('bibliotecas', JSON.stringify(updatedLibraries));
    localStorage.setItem('bibliotecaActiva', JSON.stringify(library));

    // Actualizar estado
    setLibraries(updatedLibraries);
    setActiveLibrary(library);
  };

  const deleteLibrary = (libraryId) => {
    const updatedLibraries = libraries.filter(lib => lib.id !== libraryId);
    localStorage.setItem('bibliotecas', JSON.stringify(updatedLibraries));

    // Si se eliminó la biblioteca activa, limpiar
    if (activeLibrary && activeLibrary.id === libraryId) {
      localStorage.removeItem('bibliotecaActiva');
      setActiveLibrary(null);
    }

    setLibraries(updatedLibraries);
  };

  const updateLibrary = (libraryId, updates) => {
    const updatedLibraries = libraries.map(lib => 
      lib.id === libraryId ? { ...lib, ...updates } : lib
    );

    localStorage.setItem('bibliotecas', JSON.stringify(updatedLibraries));

    // Si se actualizó la biblioteca activa, actualizar también
    if (activeLibrary && activeLibrary.id === libraryId) {
      const updatedActiveLibrary = { ...activeLibrary, ...updates };
      localStorage.setItem('bibliotecaActiva', JSON.stringify(updatedActiveLibrary));
      setActiveLibrary(updatedActiveLibrary);
    }

    setLibraries(updatedLibraries);
  };

  const hasActiveLibrary = () => {
    return activeLibrary !== null;
  };

  const getLibraryStats = () => {
    if (!activeLibrary) return null;

    // Usar estadísticas mock si es una biblioteca mock
    if (activeLibrary.id.startsWith('mock-library-')) {
      return getMockLibraryStats(activeLibrary.id);
    }

    // Para bibliotecas reales, retornar datos de ejemplo
    return {
      totalLibros: 1250,
      totalSocios: 172,
      prestamosActivos: 45,
      prestamosVencidos: 8,
      prestamosCompletados: 1247
    };
  };

  return {
    activeLibrary,
    libraries,
    loading,
    createLibrary,
    selectLibrary,
    deleteLibrary,
    updateLibrary,
    hasActiveLibrary,
    getLibraryStats,
    loadLibraries
  };
}; 