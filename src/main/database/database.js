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

        // Crear índices para mejorar el rendimiento
        this.db.exec(`
            CREATE INDEX IF NOT EXISTS idx_libros_biblioteca ON libros(bibliotecaId);
            CREATE INDEX IF NOT EXISTS idx_libros_isbn ON libros(isbn);
            CREATE INDEX IF NOT EXISTS idx_socios_biblioteca ON socios(bibliotecaId);
            CREATE INDEX IF NOT EXISTS idx_prestamos_biblioteca ON prestamos(bibliotecaId);
            CREATE INDEX IF NOT EXISTS idx_prestamos_estado ON prestamos(estado);
            CREATE INDEX IF NOT EXISTS idx_prestamos_fecha ON prestamos(fechaDevolucion);
        `);
    }

    // ===== OPERACIONES DE BIBLIOTECAS =====
    
    createBiblioteca(bibliotecaData) {
        try {
            // Desactivar todas las bibliotecas existentes
            this.db.prepare('UPDATE bibliotecas SET activa = 0').run();
            
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

    getBibliotecas() {
        try {
            const stmt = this.db.prepare('SELECT * FROM bibliotecas ORDER BY fechaCreacion DESC');
            return stmt.all();
        } catch (error) {
            console.error('Error al obtener bibliotecas:', error);
            throw error;
        }
    }

    getBibliotecaById(id) {
        try {
            const stmt = this.db.prepare('SELECT * FROM bibliotecas WHERE id = ?');
            return stmt.get(id);
        } catch (error) {
            console.error('Error al obtener biblioteca:', error);
            throw error;
        }
    }

    getBibliotecaActiva() {
        try {
            const stmt = this.db.prepare('SELECT * FROM bibliotecas WHERE activa = 1');
            return stmt.get();
        } catch (error) {
            console.error('Error al obtener biblioteca activa:', error);
            throw error;
        }
    }

    updateBiblioteca(id, updates) {
        try {
            const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updates);
            values.push(id);
            
            const stmt = this.db.prepare(`UPDATE bibliotecas SET ${fields} WHERE id = ?`);
            const result = stmt.run(...values);
            
            return result.changes > 0;
        } catch (error) {
            console.error('Error al actualizar biblioteca:', error);
            throw error;
        }
    }

    deleteBiblioteca(id) {
        try {
            const stmt = this.db.prepare('DELETE FROM bibliotecas WHERE id = ?');
            const result = stmt.run(id);
            return result.changes > 0;
        } catch (error) {
            console.error('Error al eliminar biblioteca:', error);
            throw error;
        }
    }

    activateBiblioteca(id) {
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
    
    createLibro(libroData) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO libros (titulo, autor, isbn, categoria, editorial, anioPublicacion, cantidad, disponibles, ubicacion, estado, descripcion, bibliotecaId)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            `);
            
            const result = stmt.run(
                libroData.titulo,
                libroData.autor,
                libroData.isbn,
                libroData.categoria,
                libroData.editorial,
                libroData.anioPublicacion,
                libroData.cantidad || 1,
                libroData.disponibles || libroData.cantidad || 1,
                libroData.ubicacion,
                libroData.estado || 'disponible',
                libroData.descripcion,
                libroData.bibliotecaId
            );
            
            return { id: result.lastInsertRowid, ...libroData };
        } catch (error) {
            console.error('Error al crear libro:', error);
            throw error;
        }
    }

    getLibros(bibliotecaId, filters = {}) {
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

    getLibroById(id) {
        try {
            const stmt = this.db.prepare('SELECT * FROM libros WHERE id = ?');
            return stmt.get(id);
        } catch (error) {
            console.error('Error al obtener libro:', error);
            throw error;
        }
    }

    updateLibro(id, updates) {
        try {
            const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updates);
            values.push(id);
            
            const stmt = this.db.prepare(`UPDATE libros SET ${fields} WHERE id = ?`);
            const result = stmt.run(...values);
            
            return result.changes > 0;
        } catch (error) {
            console.error('Error al actualizar libro:', error);
            throw error;
        }
    }

    deleteLibro(id) {
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
    
    createSocio(socioData) {
        try {
            const stmt = this.db.prepare(`
                INSERT INTO socios (nombre, email, telefono, direccion, observaciones, bibliotecaId)
                VALUES (?, ?, ?, ?, ?, ?)
            `);
            
            const result = stmt.run(
                socioData.nombre,
                socioData.email,
                socioData.telefono,
                socioData.direccion,
                socioData.observaciones,
                socioData.bibliotecaId
            );
            
            return { id: result.lastInsertRowid, ...socioData };
        } catch (error) {
            console.error('Error al crear socio:', error);
            throw error;
        }
    }

    getSocios(bibliotecaId, filters = {}) {
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

    getSocioById(id) {
        try {
            const stmt = this.db.prepare('SELECT * FROM socios WHERE id = ?');
            return stmt.get(id);
        } catch (error) {
            console.error('Error al obtener socio:', error);
            throw error;
        }
    }

    updateSocio(id, updates) {
        try {
            const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
            const values = Object.values(updates);
            values.push(id);
            
            const stmt = this.db.prepare(`UPDATE socios SET ${fields} WHERE id = ?`);
            const result = stmt.run(...values);
            
            return result.changes > 0;
        } catch (error) {
            console.error('Error al actualizar socio:', error);
            throw error;
        }
    }

    deleteSocio(id) {
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
    
    createPrestamo(prestamoData) {
        try {
            // Verificar que el libro esté disponible
            const libro = this.getLibroById(prestamoData.libroId);
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
                prestamoData.observaciones
            );
            
            // Actualizar disponibilidad del libro
            this.updateLibro(prestamoData.libroId, {
                disponibles: libro.disponibles - 1,
                estado: libro.disponibles - 1 === 0 ? 'prestado' : 'disponible'
            });
            
            return { id: result.lastInsertRowid, ...prestamoData };
        } catch (error) {
            console.error('Error al crear préstamo:', error);
            throw error;
        }
    }

    getPrestamos(bibliotecaId, filters = {}) {
        try {
            let query = `
                SELECT p.*, l.titulo as libroTitulo, l.autor as libroAutor, 
                       s.nombre as socioNombre, s.email as socioEmail
                FROM prestamos p
                JOIN libros l ON p.libroId = l.id
                JOIN socios s ON p.socioId = s.id
                WHERE p.bibliotecaId = ?
            `;
            const params = [bibliotecaId];
            
            if (filters.estado) {
                query += ' AND p.estado = ?';
                params.push(filters.estado);
            }
            
            if (filters.search) {
                query += ' AND (l.titulo LIKE ? OR s.nombre LIKE ?)';
                const searchTerm = `%${filters.search}%`;
                params.push(searchTerm, searchTerm);
            }
            
            query += ' ORDER BY p.fechaPrestamo DESC';
            
            const stmt = this.db.prepare(query);
            return stmt.all(...params);
        } catch (error) {
            console.error('Error al obtener préstamos:', error);
            throw error;
        }
    }

    getPrestamoById(id) {
        try {
            const stmt = this.db.prepare(`
                SELECT p.*, l.titulo as libroTitulo, l.autor as libroAutor, 
                       s.nombre as socioNombre, s.email as socioEmail
                FROM prestamos p
                JOIN libros l ON p.libroId = l.id
                JOIN socios s ON p.socioId = s.id
                WHERE p.id = ?
            `);
            return stmt.get(id);
        } catch (error) {
            console.error('Error al obtener préstamo:', error);
            throw error;
        }
    }

    devolverLibro(prestamoId) {
        try {
            // Obtener el préstamo
            const prestamo = this.getPrestamoById(prestamoId);
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
                const libro = this.getLibroById(prestamo.libroId);
                this.updateLibro(prestamo.libroId, {
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
    
    getBibliotecaStats(bibliotecaId) {
        try {
            const stats = {};
            
            // Total de libros
            const totalLibros = this.db.prepare('SELECT COUNT(*) as total FROM libros WHERE bibliotecaId = ?').get(bibliotecaId);
            stats.totalLibros = totalLibros.total;
            
            // Total de socios
            const totalSocios = this.db.prepare('SELECT COUNT(*) as total FROM socios WHERE bibliotecaId = ?').get(bibliotecaId);
            stats.totalSocios = totalSocios.total;
            
            // Préstamos activos
            const prestamosActivos = this.db.prepare('SELECT COUNT(*) as total FROM prestamos WHERE bibliotecaId = ? AND estado = "activo"').get(bibliotecaId);
            stats.prestamosActivos = prestamosActivos.total;
            
            // Préstamos vencidos
            const prestamosVencidos = this.db.prepare(`
                SELECT COUNT(*) as total 
                FROM prestamos 
                WHERE bibliotecaId = ? AND estado = "activo" AND fechaDevolucion < CURRENT_TIMESTAMP
            `).get(bibliotecaId);
            stats.prestamosVencidos = prestamosVencidos.total;
            
            // Préstamos completados
            const prestamosCompletados = this.db.prepare('SELECT COUNT(*) as total FROM prestamos WHERE bibliotecaId = ? AND estado = "completado"').get(bibliotecaId);
            stats.prestamosCompletados = prestamosCompletados.total;
            
            return stats;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }

    getPrestamosPorMes(bibliotecaId, meses = 6) {
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

    getLibrosPorCategoria(bibliotecaId) {
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
    
    close() {
        if (this.db) {
            this.db.close();
        }
    }

    backup(destinationPath) {
        try {
            this.db.backup(destinationPath);
            return true;
        } catch (error) {
            console.error('Error al hacer backup:', error);
            return false;
        }
    }
}

module.exports = DatabaseService;
