const Database = require('better-sqlite3');
const path = require('path');
const { app } = require('electron');

class DatabaseService {
    constructor() {
        this.db = null;
        this.dbPath = null;
        this.init();
    }

    init() {
        try {
            console.log('Inicializando base de datos SQLite...');
            
            // Crear directorio de datos si no existe
            const userDataPath = app.getPath('userData');
            const dbDir = path.join(userDataPath, 'BibliOS');
            
            // Crear directorio si no existe
            const fs = require('fs');
            if (!fs.existsSync(dbDir)) {
                fs.mkdirSync(dbDir, { recursive: true });
            }
            
            // Ruta de la base de datos
            this.dbPath = path.join(dbDir, 'biblios.db');
            
            // Conectar a la base de datos
            this.db = new Database(this.dbPath);
            
            // Habilitar foreign keys
            this.db.pragma('foreign_keys = ON');
            
            // Crear tablas
            this.createTables();
            
            console.log(`Base de datos SQLite inicializada en: ${this.dbPath}`);
            
        } catch (error) {
            console.error('Error al inicializar la base de datos:', error);
                throw error;
        }
    }

    createTables() {
        try {
            // Tabla bibliotecas
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS bibliotecas (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    nombre TEXT NOT NULL UNIQUE,
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

            // Tabla libros
            this.db.exec(`
                CREATE TABLE IF NOT EXISTS libros (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    titulo TEXT NOT NULL,
                    autor TEXT NOT NULL,
                    isbn TEXT UNIQUE,
                    categoria TEXT,
                    editorial TEXT,
                    anioPublicacion INTEGER,
                    cantidad INTEGER DEFAULT 1,
                    disponibles INTEGER DEFAULT 1,
                    ubicacion TEXT,
                    estado TEXT DEFAULT 'disponible',
                    descripcion TEXT,
                    bibliotecaId INTEGER,
                    fechaCreacion DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (bibliotecaId) REFERENCES bibliotecas(id) ON DELETE CASCADE
                )
            `);

            // Tabla socios
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

            // Tabla préstamos
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

            // Crear índices para mejorar rendimiento
            this.db.exec(`
                CREATE INDEX IF NOT EXISTS idx_libros_titulo ON libros(titulo);
                CREATE INDEX IF NOT EXISTS idx_libros_autor ON libros(autor);
                CREATE INDEX IF NOT EXISTS idx_libros_categoria ON libros(categoria);
                CREATE INDEX IF NOT EXISTS idx_libros_biblioteca ON libros(bibliotecaId);
                CREATE INDEX IF NOT EXISTS idx_socios_nombre ON socios(nombre);
                CREATE INDEX IF NOT EXISTS idx_socios_biblioteca ON socios(bibliotecaId);
                CREATE INDEX IF NOT EXISTS idx_prestamos_estado ON prestamos(estado);
                CREATE INDEX IF NOT EXISTS idx_prestamos_biblioteca ON prestamos(bibliotecaId);
            `);

            console.log('Tablas creadas correctamente');
            
        } catch (error) {
            console.error('Error al crear tablas:', error);
            throw error;
        }
    }

    // ===== OPERACIONES DE BIBLIOTECAS =====
    
    async createBiblioteca(bibliotecaData) {
        try {
            // Verificar si ya existe una biblioteca con ese nombre
            const existingLibrary = this.db.prepare('SELECT id FROM bibliotecas WHERE nombre = ?').get(bibliotecaData.nombre);
            
            if (existingLibrary) {
                throw new Error(`Ya existe una biblioteca con el nombre "${bibliotecaData.nombre}". Por favor, elige un nombre diferente.`);
            }
            
            // Desactivar todas las bibliotecas existentes
            this.db.prepare('UPDATE bibliotecas SET activa = 0').run();
            
            const stmt = this.db.prepare(`
                INSERT INTO bibliotecas (nombre, direccion, telefono, email, responsable, horarios, descripcion, activa)
                VALUES (?, ?, ?, ?, ?, ?, ?, 1)
            `);
            
            const result = stmt.run(
                bibliotecaData.nombre,
                bibliotecaData.direccion || null,
                bibliotecaData.telefono || null,
                bibliotecaData.email || null,
                bibliotecaData.responsable || null,
                bibliotecaData.horarios || null,
                bibliotecaData.descripcion || null
            );
            
            return this.getBibliotecaById(result.lastInsertRowid);
        } catch (error) {
            console.error('Error al crear biblioteca:', error);
            throw error;
        }
    }

    async getBibliotecas() {
        try {
            const stmt = this.db.prepare('SELECT * FROM bibliotecas ORDER BY fechaCreacion DESC');
            return stmt.all();
        } catch (error) {
            console.error('Error al obtener bibliotecas:', error);
            throw error;
        }
    }

    async getBibliotecaById(id) {
        try {
            const stmt = this.db.prepare('SELECT * FROM bibliotecas WHERE id = ?');
            return stmt.get(id);
        } catch (error) {
            console.error('Error al obtener biblioteca:', error);
            throw error;
        }
    }

    async getBibliotecaActiva() {
        try {
            const stmt = this.db.prepare('SELECT * FROM bibliotecas WHERE activa = 1 LIMIT 1');
            return stmt.get();
        } catch (error) {
            console.error('Error al obtener biblioteca activa:', error);
            throw error;
        }
    }

    async updateBiblioteca(id, updates) {
        try {
            const fields = [];
            const values = [];
            
            Object.keys(updates).forEach(key => {
                if (updates[key] !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(updates[key]);
                }
            });
            
            if (fields.length === 0) return false;
            
            values.push(id);
            const stmt = this.db.prepare(`UPDATE bibliotecas SET ${fields.join(', ')} WHERE id = ?`);
            const result = stmt.run(...values);
            
            return result.changes > 0;
        } catch (error) {
            console.error('Error al actualizar biblioteca:', error);
            throw error;
        }
    }

    async deleteBiblioteca(id) {
        try {
            const stmt = this.db.prepare('DELETE FROM bibliotecas WHERE id = ?');
            const result = stmt.run(id);
            return result.changes > 0;
        } catch (error) {
            console.error('Error al eliminar biblioteca:', error);
            throw error;
        }
    }

    async activateBiblioteca(id) {
        try {
            // Desactivar todas las bibliotecas
            this.db.prepare('UPDATE bibliotecas SET activa = 0').run();
            
            // Activar la biblioteca seleccionada
            const stmt = this.db.prepare('UPDATE bibliotecas SET activa = 1 WHERE id = ?');
            const result = stmt.run(id);
            
            return result.changes > 0;
        } catch (error) {
            console.error('Error al activar biblioteca:', error);
            throw error;
        }
    }

    // ===== OPERACIONES DE LIBROS =====
    
    async createLibro(libroData) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO libros (titulo, autor, isbn, categoria, editorial, anioPublicacion, cantidad, disponibles, ubicacion, estado, descripcion, bibliotecaId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            const result = stmt.run(
                libroData.titulo,
                libroData.autor,
                libroData.isbn || null,
                libroData.categoria || null,
                libroData.editorial || null,
                libroData.anioPublicacion || null,
                libroData.cantidad || 1,
                libroData.disponibles || libroData.cantidad || 1,
                libroData.ubicacion || null,
                libroData.estado || 'disponible',
                libroData.descripcion || null,
                libroData.bibliotecaId
            );
            
            return this.getLibroById(result.lastInsertRowid);
        } catch (error) {
            console.error('Error al crear libro:', error);
            throw error;
        }
    }

    async getLibros(bibliotecaId, filters = {}) {
        try {
            let query = 'SELECT * FROM libros WHERE bibliotecaId = ?';
            const params = [bibliotecaId];
            
            if (filters.search) {
                query += ' AND (titulo LIKE ? OR autor LIKE ? OR isbn LIKE ?)';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm, searchTerm);
            }
            
            if (filters.categoria) {
                query += ' AND categoria = ?';
                params.push(filters.categoria);
            }
            
            if (filters.estado) {
                query += ' AND estado = ?';
                params.push(filters.estado);
            }
            
            query += ' ORDER BY titulo ASC';
            
            const stmt = this.db.prepare(query);
            return stmt.all(...params);
        } catch (error) {
            console.error('Error al obtener libros:', error);
            throw error;
        }
    }

    async getLibroById(id) {
        try {
            const stmt = this.db.prepare('SELECT * FROM libros WHERE id = ?');
            return stmt.get(id);
        } catch (error) {
            console.error('Error al obtener libro:', error);
            throw error;
        }
    }

    async updateLibro(id, updates) {
        try {
            const fields = [];
            const values = [];
            
            Object.keys(updates).forEach(key => {
                if (updates[key] !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(updates[key]);
                }
            });
            
            if (fields.length === 0) return false;
            
            values.push(id);
            const stmt = this.db.prepare(`UPDATE libros SET ${fields.join(', ')} WHERE id = ?`);
            const result = stmt.run(...values);
            
            return result.changes > 0;
        } catch (error) {
            console.error('Error al actualizar libro:', error);
            throw error;
        }
    }

    async deleteLibro(id) {
        try {
            const stmt = this.db.prepare('DELETE FROM libros WHERE id = ?');
            const result = stmt.run(id);
            return result.changes > 0;
        } catch (error) {
            console.error('Error al eliminar libro:', error);
            throw error;
        }
    }

    // ===== OPERACIONES DE SOCIOS =====
    
    async createSocio(socioData) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO socios (nombre, email, telefono, direccion, estado, observaciones, bibliotecaId)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `);
            
            const result = stmt.run(
                socioData.nombre,
                socioData.email || null,
                socioData.telefono || null,
                socioData.direccion || null,
                socioData.estado || 'activo',
                socioData.observaciones || null,
                socioData.bibliotecaId
            );
            
            return this.getSocioById(result.lastInsertRowid);
        } catch (error) {
            console.error('Error al crear socio:', error);
            throw error;
        }
    }

    async getSocios(bibliotecaId, filters = {}) {
        try {
            let query = 'SELECT * FROM socios WHERE bibliotecaId = ?';
            const params = [bibliotecaId];
            
            if (filters.search) {
                query += ' AND (nombre LIKE ? OR email LIKE ?)';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm);
            }
            
            if (filters.estado) {
                query += ' AND estado = ?';
                params.push(filters.estado);
            }
            
            query += ' ORDER BY nombre ASC';
            
            const stmt = this.db.prepare(query);
            return stmt.all(...params);
        } catch (error) {
            console.error('Error al obtener socios:', error);
            throw error;
        }
    }

    async getSocioById(id) {
        try {
            const stmt = this.db.prepare('SELECT * FROM socios WHERE id = ?');
            return stmt.get(id);
        } catch (error) {
            console.error('Error al obtener socio:', error);
            throw error;
        }
    }

    async updateSocio(id, updates) {
        try {
            const fields = [];
            const values = [];
            
            Object.keys(updates).forEach(key => {
                if (updates[key] !== undefined) {
                    fields.push(`${key} = ?`);
                    values.push(updates[key]);
                }
            });
            
            if (fields.length === 0) return false;
            
            values.push(id);
            const stmt = this.db.prepare(`UPDATE socios SET ${fields.join(', ')} WHERE id = ?`);
            const result = stmt.run(...values);
            
            return result.changes > 0;
        } catch (error) {
            console.error('Error al actualizar socio:', error);
            throw error;
        }
    }

    async deleteSocio(id) {
        try {
            const stmt = this.db.prepare('DELETE FROM socios WHERE id = ?');
            const result = stmt.run(id);
            return result.changes > 0;
        } catch (error) {
            console.error('Error al eliminar socio:', error);
            throw error;
        }
    }

    // ===== OPERACIONES DE PRÉSTAMOS =====
    
    async createPrestamo(prestamoData) {
        try {
            // Verificar que el libro esté disponible
            const libro = await this.getLibroById(prestamoData.libroId);
            if (!libro || libro.disponibles <= 0) {
                throw new Error('El libro no está disponible para préstamo');
            }
            
            // Crear el préstamo
            const stmt = this.db.prepare(`
                INSERT INTO prestamos (libroId, socioId, bibliotecaId, fechaDevolucion, observaciones)
                VALUES (?, ?, ?, ?, ?)
            `);
            
            const result = stmt.run(
                prestamoData.libroId,
                prestamoData.socioId,
                prestamoData.bibliotecaId,
                prestamoData.fechaDevolucion,
                prestamoData.observaciones || null
            );
            
            // Actualizar disponibilidad del libro
            await this.updateLibro(prestamoData.libroId, {
                disponibles: libro.disponibles - 1,
                estado: libro.disponibles - 1 === 0 ? 'prestado' : 'disponible'
            });
            
            return this.getPrestamoById(result.lastInsertRowid);
        } catch (error) {
            console.error('Error al crear préstamo:', error);
            throw error;
        }
    }

    async getPrestamos(bibliotecaId, filters = {}) {
        try {
            let query = `
                SELECT p.*, l.titulo as libroTitulo, l.autor as libroAutor, 
                       s.nombre as socioNombre, s.email as socioEmail
                FROM prestamos p
                LEFT JOIN libros l ON p.libroId = l.id
                LEFT JOIN socios s ON p.socioId = s.id
                WHERE p.bibliotecaId = ?
            `;
            const params = [bibliotecaId];
            
            if (filters.estado) {
                query += ' AND p.estado = ?';
                params.push(filters.estado);
            }
            
            query += ' ORDER BY p.fechaPrestamo DESC';
            
            const stmt = this.db.prepare(query);
            return stmt.all(...params);
        } catch (error) {
            console.error('Error al obtener préstamos:', error);
            throw error;
        }
    }

    async getPrestamoById(id) {
        try {
            const stmt = this.db.prepare(`
                SELECT p.*, l.titulo as libroTitulo, l.autor as libroAutor, 
                       s.nombre as socioNombre, s.email as socioEmail
                FROM prestamos p
                LEFT JOIN libros l ON p.libroId = l.id
                LEFT JOIN socios s ON p.socioId = s.id
                WHERE p.id = ?
            `);
            return stmt.get(id);
        } catch (error) {
            console.error('Error al obtener préstamo:', error);
            throw error;
        }
    }

    async devolverLibro(prestamoId) {
        try {
            // Obtener el préstamo
            const prestamo = await this.getPrestamoById(prestamoId);
            if (!prestamo) {
                throw new Error('Préstamo no encontrado');
            }
            
            // Actualizar el préstamo
            const stmt = this.db.prepare(`
                UPDATE prestamos 
                SET estado = 'completado', fechaDevolucionReal = CURRENT_TIMESTAMP 
                WHERE id = ?
            `);
            const result = stmt.run(prestamoId);
            
            if (result.changes > 0) {
                // Actualizar disponibilidad del libro
                const libro = await this.getLibroById(prestamo.libroId);
                await this.updateLibro(prestamo.libroId, {
                    disponibles: libro.disponibles + 1,
                    estado: 'disponible'
                });
            }
            
            return result.changes > 0;
        } catch (error) {
            console.error('Error al devolver libro:', error);
            throw error;
        }
    }

    // ===== ESTADÍSTICAS Y REPORTES =====
    
    async getBibliotecaStats(bibliotecaId) {
        try {
            const stats = {};
            
            // Total de libros
            const totalLibros = this.db.prepare('SELECT COUNT(*) as count FROM libros WHERE bibliotecaId = ?').get(bibliotecaId);
            stats.totalLibros = totalLibros.count;
            
            // Total de socios
            const totalSocios = this.db.prepare('SELECT COUNT(*) as count FROM socios WHERE bibliotecaId = ?').get(bibliotecaId);
            stats.totalSocios = totalSocios.count;
            
            // Préstamos activos
            const prestamosActivos = this.db.prepare('SELECT COUNT(*) as count FROM prestamos WHERE bibliotecaId = ? AND estado = "activo"').get(bibliotecaId);
            stats.prestamosActivos = prestamosActivos.count;
            
            // Préstamos vencidos
            const prestamosVencidos = this.db.prepare('SELECT COUNT(*) as count FROM prestamos WHERE bibliotecaId = ? AND estado = "activo" AND fechaDevolucion < CURRENT_TIMESTAMP').get(bibliotecaId);
            stats.prestamosVencidos = prestamosVencidos.count;
            
            // Préstamos completados
            const prestamosCompletados = this.db.prepare('SELECT COUNT(*) as count FROM prestamos WHERE bibliotecaId = ? AND estado = "completado"').get(bibliotecaId);
            stats.prestamosCompletados = prestamosCompletados.count;
            
            return stats;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }

    async getPrestamosPorMes(bibliotecaId, meses = 6) {
        try {
            const stmt = this.db.prepare(`
                SELECT 
                    strftime('%Y-%m', fechaPrestamo) as mes,
                    COUNT(*) as prestamos,
                    SUM(CASE WHEN estado = 'completado' THEN 1 ELSE 0 END) as devoluciones
                FROM prestamos 
                WHERE bibliotecaId = ? 
                AND fechaPrestamo >= date('now', '-${meses} months')
                GROUP BY strftime('%Y-%m', fechaPrestamo)
                ORDER BY mes ASC
            `);
            
            return stmt.all(bibliotecaId);
        } catch (error) {
            console.error('Error al obtener préstamos por mes:', error);
            throw error;
        }
    }

    async getLibrosPorCategoria(bibliotecaId) {
        try {
            const stmt = this.db.prepare(`
                SELECT categoria, COUNT(*) as cantidad
                FROM libros 
                WHERE bibliotecaId = ? 
                GROUP BY categoria
                ORDER BY cantidad DESC
            `);
            
            return stmt.all(bibliotecaId);
        } catch (error) {
            console.error('Error al obtener libros por categoría:', error);
            throw error;
        }
    }

    // ===== UTILIDADES =====
    
    async close() {
        if (this.db) {
            this.db.close();
            console.log('Base de datos cerrada correctamente');
        }
    }

    async backup(destinationPath) {
        try {
            // Para SQLite, simplemente copiar el archivo
            const fs = require('fs');
            fs.copyFileSync(this.dbPath, destinationPath);
                return true;
        } catch (error) {
            console.error('Error al hacer backup:', error);
            return false;
        }
    }

    // ===== MÉTODOS DE INICIALIZACIÓN =====
    
    async insertSampleData(bibliotecaId) {
        try {
            // Insertar libros de ejemplo
            const librosEjemplo = [
                {
                    titulo: 'El Señor de los Anillos',
                    autor: 'J.R.R. Tolkien',
                    isbn: '978-84-450-7054-9',
                    categoria: 'Fantasía',
                    editorial: 'Minotauro',
                    anioPublicacion: 1954,
                    cantidad: 3,
                    disponibles: 3,
                    ubicacion: 'Estante A-1',
                    descripcion: 'Trilogía épica de fantasía',
                    bibliotecaId
                },
                {
                    titulo: 'Cien años de soledad',
                    autor: 'Gabriel García Márquez',
                    isbn: '978-84-397-2071-7',
                    categoria: 'Literatura',
                    editorial: 'Editorial Sudamericana',
                    anioPublicacion: 1967,
                    cantidad: 2,
                    disponibles: 2,
                    ubicacion: 'Estante B-3',
                    descripcion: 'Obra maestra del realismo mágico',
                    bibliotecaId
                },
                {
                    titulo: '1984',
                    autor: 'George Orwell',
                    isbn: '978-84-206-0000-0',
                    categoria: 'Ciencia Ficción',
                    editorial: 'Debolsillo',
                    anioPublicacion: 1949,
                    cantidad: 4,
                    disponibles: 4,
                    ubicacion: 'Estante C-2',
                    descripcion: 'Distopía clásica',
                    bibliotecaId
                }
            ];

            // Insertar socios de ejemplo
            const sociosEjemplo = [
                {
                    nombre: 'María González',
                    email: 'maria@email.com',
                    telefono: '123-456-789',
                    direccion: 'Av. San Martín 123',
                    observaciones: 'Socia frecuente',
                    bibliotecaId
                },
                {
                    nombre: 'Juan Pérez',
                    email: 'juan@email.com',
                    telefono: '123-456-790',
                    direccion: 'Belgrano 456',
                    observaciones: '',
                    bibliotecaId
                },
                {
                    nombre: 'Ana López',
                    email: 'ana@email.com',
                    telefono: '123-456-791',
                    direccion: 'Rivadavia 789',
                    observaciones: 'Socia activa',
                    bibliotecaId
                }
            ];

            // Insertar libros
            for (const libro of librosEjemplo) {
                await this.createLibro(libro);
            }

            // Insertar socios
            for (const socio of sociosEjemplo) {
                await this.createSocio(socio);
            }

            return {
                success: true,
                message: 'Datos de ejemplo insertados correctamente',
                librosInsertados: librosEjemplo.length,
                sociosInsertados: sociosEjemplo.length
            };
        } catch (error) {
            console.error('Error al insertar datos de ejemplo:', error);
            throw error;
        }
    }

    // ===== INFORMACIÓN DEL SISTEMA =====
    
    getDatabaseInfo() {
        return {
            type: 'sqlite',
            path: this.dbPath,
            dialect: 'sqlite'
        };
    }
}

module.exports = DatabaseService;