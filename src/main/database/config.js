const path = require('path');
const { app } = require('electron');

// Configuración de la base de datos
const databaseConfig = {
    // Configuración de PostgreSQL
    postgres: {
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'biblios_db',
        dialect: 'postgres',
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        },
        pool: {
            max: 5,
            min: 0,
            acquire: 30000,
            idle: 10000
        }
    },

    // Configuración de SQLite (fallback)
    sqlite: {
        dialect: 'sqlite',
        storage: path.join(app.getPath('userData'), 'biblios_fallback.db'),
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    },

    // Configuración de desarrollo
    development: {
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'biblios_dev',
        dialect: 'postgres',
        logging: console.log,
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        }
    },

    // Configuración de producción
    production: {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 5432,
        username: process.env.DB_USER || 'postgres',
        password: process.env.DB_PASS || 'postgres',
        database: process.env.DB_NAME || 'biblios_prod',
        dialect: 'postgres',
        logging: false,
        define: {
            timestamps: true,
            underscored: true,
            freezeTableName: true
        },
        pool: {
            max: 10,
            min: 2,
            acquire: 30000,
            idle: 10000
        }
    }
};

// Función para obtener la configuración según el entorno
function getDatabaseConfig() {
    const env = process.env.NODE_ENV || 'development';
    
    switch (env) {
        case 'production':
            return databaseConfig.production;
        case 'development':
            return databaseConfig.development;
        default:
            return databaseConfig.postgres;
    }
}

// Función para obtener configuración de fallback
function getFallbackConfig() {
    return databaseConfig.sqlite;
}

// Función para verificar si PostgreSQL está disponible
async function isPostgreSQLAvailable() {
    try {
        const { Client } = require('pg');
        const client = new Client({
            host: databaseConfig.postgres.host,
            port: databaseConfig.postgres.port,
            user: databaseConfig.postgres.username,
            password: databaseConfig.postgres.password,
            database: 'postgres', // Conectar a la base de datos por defecto
            connectionTimeoutMillis: 5000
        });
        
        await client.connect();
        await client.end();
        return true;
    } catch (error) {
        console.log('PostgreSQL no está disponible:', error.message);
        return false;
    }
}

// Función para crear la base de datos si no existe
async function createDatabaseIfNotExists() {
    try {
        const { Client } = require('pg');
        const client = new Client({
            host: databaseConfig.postgres.host,
            port: databaseConfig.postgres.port,
            user: databaseConfig.postgres.username,
            password: databaseConfig.postgres.password,
            database: 'postgres', // Conectar a la base de datos por defecto
            connectionTimeoutMillis: 10000
        });
        
        await client.connect();
        
        // Verificar si la base de datos existe
        const result = await client.query(
            "SELECT 1 FROM pg_database WHERE datname = $1",
            [databaseConfig.postgres.database]
        );
        
        if (result.rows.length === 0) {
            // Crear la base de datos
            await client.query(`CREATE DATABASE ${databaseConfig.postgres.database}`);
            console.log(`Base de datos ${databaseConfig.postgres.database} creada exitosamente`);
        } else {
            console.log(`Base de datos ${databaseConfig.postgres.database} ya existe`);
        }
        
        await client.end();
        return true;
    } catch (error) {
        console.error('Error al crear la base de datos:', error);
        return false;
    }
}

module.exports = {
    databaseConfig,
    getDatabaseConfig,
    getFallbackConfig,
    isPostgreSQLAvailable,
    createDatabaseIfNotExists
};







