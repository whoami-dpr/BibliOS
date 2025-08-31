import { useState, useEffect, useCallback } from 'react';

export const useDatabase = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para manejar errores
  const handleError = useCallback((error) => {
    console.error('Error en la base de datos:', error);
    setError(error.message || 'Error desconocido en la base de datos');
    setLoading(false);
  }, []);

  // Función para limpiar errores
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  // Función para ejecutar operaciones de base de datos
  const executeOperation = useCallback(async (operation, ...args) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await operation(...args);
      setLoading(false);
      return result;
    } catch (error) {
      handleError(error);
      throw error;
    }
  }, [handleError]);

  // ===== OPERACIONES DE BIBLIOTECAS =====
  
  const createBiblioteca = useCallback(async (bibliotecaData) => {
    return await executeOperation(
      () => window.electronAPI.createBiblioteca(bibliotecaData)
    );
  }, [executeOperation]);

  const getBibliotecas = useCallback(async () => {
    return await executeOperation(
      () => window.electronAPI.getBibliotecas()
    );
  }, [executeOperation]);

  const getBibliotecaById = useCallback(async (id) => {
    return await executeOperation(
      () => window.electronAPI.getBibliotecaById(id)
    );
  }, [executeOperation]);

  const getBibliotecaActiva = useCallback(async () => {
    return await executeOperation(
      () => window.electronAPI.getBibliotecaActiva()
    );
  }, [executeOperation]);

  const updateBiblioteca = useCallback(async (id, updates) => {
    return await executeOperation(
      () => window.electronAPI.updateBiblioteca(id, updates)
    );
  }, [executeOperation]);

  const deleteBiblioteca = useCallback(async (id) => {
    return await executeOperation(
      () => window.electronAPI.deleteBiblioteca(id)
    );
  }, [executeOperation]);

  const activateBiblioteca = useCallback(async (id) => {
    return await executeOperation(
      () => window.electronAPI.activateBiblioteca(id)
    );
  }, [executeOperation]);

  // ===== OPERACIONES DE LIBROS =====
  
  const createLibro = useCallback(async (libroData) => {
    return await executeOperation(
      () => window.electronAPI.createLibro(libroData)
    );
  }, [executeOperation]);

  const getLibros = useCallback(async (bibliotecaId, filters = {}) => {
    return await executeOperation(
      () => window.electronAPI.getLibros(bibliotecaId, filters)
    );
  }, [executeOperation]);

  const getLibroById = useCallback(async (id) => {
    return await executeOperation(
      () => window.electronAPI.getLibroById(id)
    );
  }, [executeOperation]);

  const updateLibro = useCallback(async (id, updates) => {
    return await executeOperation(
      () => window.electronAPI.updateLibro(id, updates)
    );
  }, [executeOperation]);

  const deleteLibro = useCallback(async (id) => {
    return await executeOperation(
      () => window.electronAPI.deleteLibro(id)
    );
  }, [executeOperation]);

  // ===== OPERACIONES DE SOCIOS =====
  
  const createSocio = useCallback(async (socioData) => {
    return await executeOperation(
      () => window.electronAPI.createSocio(socioData)
    );
  }, [executeOperation]);

  const getSocios = useCallback(async (bibliotecaId, filters = {}) => {
    return await executeOperation(
      () => window.electronAPI.getSocios(bibliotecaId, filters)
    );
  }, [executeOperation]);

  const getSocioById = useCallback(async (id) => {
    return await executeOperation(
      () => window.electronAPI.getSocioById(id)
    );
  }, [executeOperation]);

  const updateSocio = useCallback(async (id, updates) => {
    return await executeOperation(
      () => window.electronAPI.updateSocio(id, updates)
    );
  }, [executeOperation]);

  const deleteSocio = useCallback(async (id) => {
    return await executeOperation(
      () => window.electronAPI.deleteSocio(id)
    );
  }, [executeOperation]);

  // ===== OPERACIONES DE PRÉSTAMOS =====
  
  const createPrestamo = useCallback(async (prestamoData) => {
    return await executeOperation(
      () => window.electronAPI.createPrestamo(prestamoData)
    );
  }, [executeOperation]);

  const getPrestamos = useCallback(async (bibliotecaId, filters = {}) => {
    return await executeOperation(
      () => window.electronAPI.getPrestamos(bibliotecaId, filters)
    );
  }, [executeOperation]);

  const getPrestamoById = useCallback(async (id) => {
    return await executeOperation(
      () => window.electronAPI.getPrestamoById(id)
    );
  }, [executeOperation]);

  const devolverLibro = useCallback(async (prestamoId) => {
    return await executeOperation(
      () => window.electronAPI.devolverLibro(prestamoId)
    );
  }, [executeOperation]);

  // ===== OPERACIONES DE ESTADÍSTICAS =====
  
  const getBibliotecaStats = useCallback(async (bibliotecaId) => {
    return await executeOperation(
      () => window.electronAPI.getBibliotecaStats(bibliotecaId)
    );
  }, [executeOperation]);

  const getPrestamosPorMes = useCallback(async (bibliotecaId, meses = 6) => {
    return await executeOperation(
      () => window.electronAPI.getPrestamosPorMes(bibliotecaId, meses)
    );
  }, [executeOperation]);

  const getLibrosPorCategoria = useCallback(async (bibliotecaId) => {
    return await executeOperation(
      () => window.electronAPI.getLibrosPorCategoria(bibliotecaId)
    );
  }, [executeOperation]);

  // ===== OPERACIONES DE UTILIDADES =====
  
  const backup = useCallback(async (destinationPath) => {
    return await executeOperation(
      () => window.electronAPI.backup(destinationPath)
    );
  }, [executeOperation]);

  const close = useCallback(async () => {
    return await executeOperation(
      () => window.electronAPI.close()
    );
  }, [executeOperation]);

  const insertSampleData = useCallback(async (bibliotecaId) => {
    return await executeOperation(
      () => window.electronAPI.insertSampleData(bibliotecaId)
    );
  }, [executeOperation]);

  // ===== OPERACIONES DEL SISTEMA =====
  
  const getSystemInfo = useCallback(() => {
    return window.electronAPI.getSystemInfo();
  }, []);

  const getAppVersion = useCallback(() => {
    return window.electronAPI.getAppVersion();
  }, []);

  const isDevelopment = useCallback(() => {
    return window.electronAPI.isDevelopment();
  }, []);

  // ===== UTILIDADES =====
  
  const getUtils = useCallback(() => {
    return window.utils;
  }, []);

  // Verificar si las APIs de Electron están disponibles
  const isElectronAvailable = useCallback(() => {
    return !!(window.electronAPI && window.utils);
  }, []);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      setLoading(false);
      setError(null);
    };
  }, []);

  return {
    // Estado
    loading,
    error,
    
    // Funciones de utilidad
    clearError,
    isElectronAvailable,
    getUtils,
    
    // Operaciones de bibliotecas
    createBiblioteca,
    getBibliotecas,
    getBibliotecaById,
    getBibliotecaActiva,
    updateBiblioteca,
    deleteBiblioteca,
    activateBiblioteca,
    
    // Operaciones de libros
    createLibro,
    getLibros,
    getLibroById,
    updateLibro,
    deleteLibro,
    
    // Operaciones de socios
    createSocio,
    getSocios,
    getSocioById,
    updateSocio,
    deleteSocio,
    
    // Operaciones de préstamos
    createPrestamo,
    getPrestamos,
    getPrestamoById,
    devolverLibro,
    
    // Operaciones de estadísticas
    getBibliotecaStats,
    getPrestamosPorMes,
    getLibrosPorCategoria,
    
    // Operaciones de utilidades
    backup,
    close,
    insertSampleData,
    
    // Información del sistema
    getSystemInfo,
    getAppVersion,
    isDevelopment
  };
};

