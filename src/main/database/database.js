const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

class DatabaseService {
    constructor() {
        this.db = null;
        this.init();
    }

    init() {
        try {
            // Obtener la ruta de la base de datos en el directorio de datos de la app
            const userDataPath = app.getPath('userData');
            const dbPath = path.join(userDataPath, 'biblios.db');
            
            // Crear/abrir la base de datos
            this.db = new Database(dbPath);
            
            // Habilitar foreign keys
            this.db.pragma('foreign_keys = ON');
            
            // Crear las tablas si no existen
            this.createTables();
            
            console.log('Base de datos inicializada correctamente en:', dbPath);
        } catch (error) {
            console.error('Error al inicializar la base de datos:', error);
        }
    }

    createTables() {
        // Tabla Bibliotecas
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS bibliotecas (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                direccion TEXT,
                telefono TEXT,
                email TEXT,
                responsable TEXT,
                horarios TEXT,
                descripcion TEXT,
                fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                activa BOOLEAN DEFAULT 0
            )
        `);

        // Tabla Libros
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS libros (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                titulo TEXT NOT NULL,
                autor TEXT NOT NULL,
                isbn TEXT,
                categoria TEXT,
                editorial TEXT,
                anioPublicacion INTEGER,
                cantidad INTEGER DEFAULT 1,
                disponibles INTEGER DEFAULT 1,
                ubicacion TEXT,
                estado TEXT DEFAULT 'disponible',
                descripcion TEXT,
                bibliotecaId INTEGER,
                FOREIGN KEY (bibliotecaId) REFERENCES bibliotecas(id) ON DELETE CASCADE
            )
        `);

        // Tabla Socios
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS socios (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                nombre TEXT NOT NULL,
                email TEXT,
                telefono TEXT,
                direccion TEXT,
                fechaRegistro DATETIME DEFAULT CURRENT_TIMESTAMP,
                estado TEXT DEFAULT 'activo',
                observaciones TEXT,
                bibliotecaId INTEGER,
                FOREIGN KEY (bibliotecaId) REFERENCES bibliotecas(id) ON DELETE CASCADE
            )
        `);

        // Tabla Préstamos
        this.db.exec(`
            CREATE TABLE IF NOT EXISTS prestamos (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                libroId INTEGER,
                socioId INTEGER,
                bibliotecaId INTEGER,
                fechaPrestamo DATETIME DEFAULT CURRENT_TIMESTAMP,
                fechaDevolucion DATETIME,
                fechaDevolucionReal DATETIME,
                estado TEXT DEFAULT 'activo',
                observaciones TEXT,
                FOREIGN KEY (libroId) REFERENCES libros(id) ON DELETE CASCADE,
                FOREIGN KEY (socioId) REFERENCES socios(id) ON DELETE CASCADE,
                FOREIGN KEY (bibliotecaId) REFERENCES bibliotecas(id) ON DELETE CASCADE
            )
        `);
    }

    // Método simple para crear biblioteca
    createBiblioteca(bibliotecaData) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO bibliotecas (nombre, direccion, telefono, email, responsable, horarios, descripcion, activa)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            `);
            
            const result = stmt.run(
                bibliotecaData.nombre,
                bibliotecaData.direccion,
                bibliotecaData.telefono,
                bibliotecaData.email,
                bibliotecaData.responsable,
                bibliotecaData.horarios,
                bibliotecaData.descripcion
            );
            
            return { id: result.lastInsertRowid, ...bibliotecaData };
        } catch (error) {
            console.error('Error al crear biblioteca:', error);
            throw error;
        }
    }

    // Método simple para obtener bibliotecas
    getBibliotecas() {
        try {
            const stmt = this.db.prepare('SELECT * FROM bibliotecas ORDER BY fechaCreacion DESC');
            return stmt.all();
        } catch (error) {
            console.error('Error al obtener bibliotecas:', error);
            throw error;
        }
    }

    // Método para cerrar la base de datos
    close() {
        if (this.db) {
            this.db.close();
        }
    }
}

module.exports = DatabaseService;