const path = require('path');
const { app } = require('electron');

// Configuración simplificada para SQLite
const databaseConfig = {
    // Configuración de SQLite
    sqlite: {
        dialect: 'sqlite',
        storage: path.join(app.getPath('userData'), 'BibliOS', 'biblios.db'),
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    }
};

// Función para obtener la configuración de SQLite
function getDatabaseConfig() {
    return databaseConfig.sqlite;
}

// Función para obtener configuración de fallback (misma que la principal)
function getFallbackConfig() {
    return databaseConfig.sqlite;
}

// Función para verificar si PostgreSQL está disponible (siempre retorna false)
async function isPostgreSQLAvailable() {
    return false; // Siempre usar SQLite
}

// Función para crear la base de datos si no existe (no necesaria para SQLite)
async function createDatabaseIfNotExists() {
    return true; // SQLite se crea automáticamente
}

module.exports = {
    databaseConfig,
    getDatabaseConfig,
    getFallbackConfig,
    isPostgreSQLAvailable,
    createDatabaseIfNotExists
};