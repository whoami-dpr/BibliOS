const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs de base de datos al frontend
contextBridge.exposeInMainWorld('electronAPI', {
    // ===== APIS DE BIBLIOTECAS =====
    createBiblioteca: (bibliotecaData) => 
        ipcRenderer.invoke('database:createBiblioteca', bibliotecaData),
    
    getBibliotecas: () => 
        ipcRenderer.invoke('database:getBibliotecas'),
    
    // ===== APIS DE UTILIDADES =====
    closeDatabase: () => 
        ipcRenderer.invoke('database:close'),
});

// Exponer utilidades al frontend
contextBridge.exposeInMainWorld('utils', {
    // Formatear fecha para mostrar
    formatDate: (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    },
    
    // Validar email
    validateEmail: (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    },
    
    // Generar ID único
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
});
