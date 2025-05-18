const sql = require('mssql');

// Configuración de conexión
const config = {
    server: 'localhost',
    database: 'node_restapi',
    options: {
        encrypt: true, // true si usás Azure o certificados SSL
        trustServerCertificate: true // true si estás en local sin SSL
    }
};

// Función para conectar
async function connectToDB() {
    try {
        const pool = await sql.connect(config);
        console.log('Conexión exitosa a SQL Server');
        return pool;
    } catch (err) {
        console.error('Error de conexión:', err);
        throw err;
    }
}

module.exports = {
    connectToDB,
    sql
};
