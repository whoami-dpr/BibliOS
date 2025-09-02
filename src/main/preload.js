const { contextBridge, ipcRenderer } = require('electron');

// Exponer APIs de base de datos al frontend
contextBridge.exposeInMainWorld('electronAPI', {
    // ===== APIS DE BIBLIOTECAS =====
    
    // Crear nueva biblioteca
    createBiblioteca: (bibliotecaData) => 
        ipcRenderer.invoke('database:createBiblioteca', bibliotecaData),
    
    // Obtener todas las bibliotecas
    getBibliotecas: () => 
        ipcRenderer.invoke('database:getBibliotecas'),
    
    // Obtener biblioteca por ID
    getBibliotecaById: (id) => 
        ipcRenderer.invoke('database:getBibliotecaById', id),
    
    // Obtener biblioteca activa
    getBibliotecaActiva: () => 
        ipcRenderer.invoke('database:getBibliotecaActiva'),
    
    // Actualizar biblioteca
    updateBiblioteca: (id, updates) => 
        ipcRenderer.invoke('database:updateBiblioteca', { id, updates }),
    
    // Eliminar biblioteca
    deleteBiblioteca: (id) => 
        ipcRenderer.invoke('database:deleteBiblioteca', id),
    
    // Activar biblioteca
    activateBiblioteca: (id) => 
        ipcRenderer.invoke('database:activateBiblioteca', id),

    // ===== APIS DE LIBROS =====
    
    // Crear nuevo libro
    createLibro: (libroData) => 
        ipcRenderer.invoke('database:createLibro', libroData),
    
    // Obtener libros de una biblioteca
    getLibros: (bibliotecaId, filters = {}) => 
        ipcRenderer.invoke('database:getLibros', { bibliotecaId, filters }),
    
    // Obtener libro por ID
    getLibroById: (id) => 
        ipcRenderer.invoke('database:getLibroById', id),
    
    // Actualizar libro
    updateLibro: (id, updates) => 
        ipcRenderer.invoke('database:updateLibro', { id, updates }),
    
    // Eliminar libro
    deleteLibro: (id) => 
        ipcRenderer.invoke('database:deleteLibro', id),

    // ===== APIS DE SOCIOS =====
    
    // Crear nuevo socio
    createSocio: (socioData) => 
        ipcRenderer.invoke('database:createSocio', socioData),
    
    // Obtener socios de una biblioteca
    getSocios: (bibliotecaId, filters = {}) => 
        ipcRenderer.invoke('database:getSocios', { bibliotecaId, filters }),
    
    // Obtener socio por ID
    getSocioById: (id) => 
        ipcRenderer.invoke('database:getSocioById', id),
    
    // Actualizar socio
    updateSocio: (id, updates) => 
        ipcRenderer.invoke('database:updateSocio', { id, updates }),
    
    // Eliminar socio
    deleteSocio: (id) => 
        ipcRenderer.invoke('database:deleteSocio', id),

    // ===== APIS DE PRÉSTAMOS =====
    
    // Crear nuevo préstamo
    createPrestamo: (prestamoData) => 
        ipcRenderer.invoke('database:createPrestamo', prestamoData),
    
    // Obtener préstamos de una biblioteca
    getPrestamos: (bibliotecaId, filters = {}) => 
        ipcRenderer.invoke('database:getPrestamos', { bibliotecaId, filters }),
    
    // Obtener préstamo por ID
    getPrestamoById: (id) => 
        ipcRenderer.invoke('database:getPrestamoById', id),
    
    // Devolver libro (marcar préstamo como completado)
    devolverLibro: (prestamoId) => 
        ipcRenderer.invoke('database:devolverLibro', prestamoId),

    // ===== APIS DE ESTADÍSTICAS =====
    
    // Obtener estadísticas de la biblioteca
    getBibliotecaStats: (bibliotecaId) => 
        ipcRenderer.invoke('database:getBibliotecaStats', bibliotecaId),
    
    // Obtener préstamos por mes
    getPrestamosPorMes: (bibliotecaId, meses = 6) => 
        ipcRenderer.invoke('database:getPrestamosPorMes', { bibliotecaId, meses }),
    
    // Obtener distribución de libros por categoría
    getLibrosPorCategoria: (bibliotecaId) => 
        ipcRenderer.invoke('database:getLibrosPorCategoria', bibliotecaId),

    // ===== APIS DE UTILIDADES =====
    
    // Hacer backup de la base de datos
    backup: (destinationPath) => 
        ipcRenderer.invoke('database:backup', destinationPath),
    
    // Cerrar conexión a la base de datos
    close: () => 
        ipcRenderer.invoke('database:close'),
    
    // Insertar datos de ejemplo
    insertSampleData: (bibliotecaId) => 
        ipcRenderer.invoke('database:insertSampleData', bibliotecaId),

    // ===== APIS DE LA APLICACIÓN =====
    
    // Escuchar eventos de la aplicación
    onAppError: (callback) => 
        ipcRenderer.on('app:error', callback),
    
    // Remover listener de eventos
    removeAppErrorListener: (callback) => 
        ipcRenderer.removeListener('app:error', callback),

    // ===== APIS DEL SISTEMA =====
    
    // Obtener información del sistema
    getSystemInfo: () => ({
        platform: process.platform,
        arch: process.arch,
        version: process.version,
        nodeVersion: process.versions.node,
        electronVersion: process.versions.electron
    }),

    // Obtener versión de la aplicación
    getAppVersion: () => process.env.npm_package_version || '1.0.0',

    // Verificar si estamos en desarrollo
    isDevelopment: () => process.env.NODE_ENV === 'development'
});

// Exponer utilidades adicionales
contextBridge.exposeInMainWorld('utils', {
    // Formatear fecha
    formatDate: (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        });
    },

    // Formatear fecha y hora
    formatDateTime: (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleString('es-ES', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    },

    // Validar email (con trim y verificación básica robusta)
    validateEmail: (email) => {
        if (!email) return false;
        const value = String(email).trim();
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(value);
    },

    // Validar ISBN (incluye checksum para ISBN-10 e ISBN-13)
    validateISBN: (isbn) => {
        if (!isbn) return false;
        const s = String(isbn).replace(/[-\s]/g, '');
        // ISBN-10
        if (s.length === 10 && /^\d{9}[\dX]$/.test(s)) {
            let sum = 0;
            for (let i = 0; i < 9; i++) sum += (i + 1) * parseInt(s[i], 10);
            sum += (s[9] === 'X' ? 10 : parseInt(s[9], 10)) * 10;
            return sum % 11 === 0;
        }
        // ISBN-13
        if (s.length === 13 && /^\d{13}$/.test(s)) {
            let sum = 0;
            for (let i = 0; i < 12; i++) sum += parseInt(s[i], 10) * (i % 2 === 0 ? 1 : 3);
            const check = (10 - (sum % 10)) % 10;
            return check === parseInt(s[12], 10);
        }
        return false;
    },

    // Generar ID único
    generateId: () => {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    },

    // Capitalizar primera letra
    capitalize: (str) => {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    },

    // Truncar texto
    truncate: (str, length = 50) => {
        if (!str) return '';
        if (str.length <= length) return str;
        return str.substring(0, length) + '...';
    },

    // Calcular días entre fechas
    daysBetween: (date1, date2) => {
        const oneDay = 24 * 60 * 60 * 1000; // horas * minutos * segundos * milisegundos
        const diffTime = Math.abs(date2 - date1);
        return Math.ceil(diffTime / oneDay);
    },

    // Verificar si una fecha está vencida
    isOverdue: (date) => {
        return new Date(date) < new Date();
    },

    // Obtener estado del préstamo
    getPrestamoStatus: (fechaDevolucion, estado) => {
        if (estado === 'completado') return 'completado';
        if (estado === 'vencido') return 'vencido';
        
        const isOverdue = this.isOverdue(fechaDevolucion);
        return isOverdue ? 'vencido' : 'activo';
    },

    // Formatear número de teléfono
    formatPhone: (phone) => {
        if (!phone) return '';
        const cleaned = phone.replace(/\D/g, '');
        const match = cleaned.match(/^(\d{3})(\d{3})(\d{3})$/);
        if (match) {
            return '(' + match[1] + ') ' + match[2] + '-' + match[3];
        }
        return phone;
    },

    // Validar número de teléfono (cuenta dígitos entre 10 y 15)
    validatePhone: (phone) => {
        if (!phone) return false;
        const cleaned = String(phone).replace(/\D/g, '');
        return cleaned.length >= 10 && cleaned.length <= 15;
    },

    // Generar slug para URLs
    generateSlug: (text) => {
        return text
            .toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    },

    // Obtener iniciales de un nombre
    getInitials: (name) => {
        if (!name) return '';
        return name
            .split(' ')
            .map(word => word.charAt(0))
            .join('')
            .toUpperCase()
            .substring(0, 2);
    }
});

// Manejar errores de IPC
ipcRenderer.on('error', (event, error) => {
    console.error('Error en el proceso renderer:', error);
});

// Log de inicialización
console.log('Preload script cargado correctamente');
