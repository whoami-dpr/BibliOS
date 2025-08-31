import { useState, useCallback } from 'react';

export const useDatabase = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ===== APIS DE BIBLIOTECAS =====
    
    const createBiblioteca = useCallback(async (bibliotecaData) => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await window.electronAPI.createBiblioteca(bibliotecaData);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    const getBibliotecas = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await window.electronAPI.getBibliotecas();
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // ===== APIS DE UTILIDADES =====
    
    const closeDatabase = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const result = await window.electronAPI.closeDatabase();
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    }, []);

    // ===== UTILIDADES =====
    
    const formatDate = useCallback((date) => {
        return window.utils.formatDate(date);
    }, []);

    const validateEmail = useCallback((email) => {
        return window.utils.validateEmail(email);
    }, []);

    const generateId = useCallback(() => {
        return window.utils.generateId();
    }, []);

    return {
        // Estados
        loading,
        error,
        
        // APIs de base de datos
        createBiblioteca,
        getBibliotecas,
        closeDatabase,
        
        // Utilidades
        formatDate,
        validateEmail,
        generateId,
        
        // Limpiar error
        clearError: () => setError(null)
    };
};
