const { Sequelize, DataTypes } = require('sequelize');
const { getDatabaseConfig, getFallbackConfig, isPostgreSQLAvailable, createDatabaseIfNotExists } = require('./config');

class DatabaseService {
    constructor() {
        this.sequelize = null;
        this.models = {};
        this.databaseType = 'unknown';
        this.init();
    }

    async init() {
        try {
            console.log('Inicializando base de datos...');
            
            // Intentar conectar con PostgreSQL primero
            if (await isPostgreSQLAvailable()) {
                console.log('PostgreSQL disponible, configurando...');
                
                // Crear la base de datos si no existe
                await createDatabaseIfNotExists();
                
                // Usar configuración de PostgreSQL
                const config = getDatabaseConfig();
                this.sequelize = new Sequelize(config);
                this.databaseType = 'postgres';
                
                console.log('Conectando a PostgreSQL...');
            } else {
                console.log('PostgreSQL no disponible, usando SQLite como fallback...');
                
                // Usar configuración de SQLite
                const config = getFallbackConfig();
                this.sequelize = new Sequelize(config);
                this.databaseType = 'sqlite';
            }
            
            // Probar la conexión
            await this.sequelize.authenticate();
            console.log(`Conexión a ${this.databaseType} establecida correctamente`);
            
            // Definir modelos
            this.defineModels();
            
            // Crear tablas si no existen
            await this.createTables();
            
            console.log(`Base de datos ${this.databaseType} inicializada correctamente`);
            
        } catch (error) {
            console.error('Error al inicializar la base de datos:', error);
            
            // Si falla PostgreSQL, intentar con SQLite
            if (this.databaseType === 'postgres') {
                console.log('Fallback a SQLite...');
                await this.initSQLiteFallback();
            } else {
                throw error;
            }
        }
    }

    async initSQLiteFallback() {
        try {
            const config = getFallbackConfig();
            this.sequelize = new Sequelize(config);
            this.databaseType = 'sqlite';
            
            await this.sequelize.authenticate();
            console.log('Conexión a SQLite establecida correctamente');
            
            this.defineModels();
            await this.createTables();
            
            console.log('Base de datos SQLite inicializada como fallback');
        } catch (error) {
            console.error('Error al inicializar SQLite fallback:', error);
            throw error;
        }
    }

    defineModels() {
        // Modelo Biblioteca
        this.models.Biblioteca = this.sequelize.define('Biblioteca', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: DataTypes.STRING(255),
                allowNull: false,
                unique: true
            },
            direccion: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            telefono: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    isEmail: true
                }
            },
            responsable: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            horarios: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            descripcion: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            activa: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            }
        }, {
            tableName: 'bibliotecas',
            indexes: [
                { unique: true, fields: ['nombre'] },
                { fields: ['activa'] }
            ]
        });

        // Modelo Libro
        this.models.Libro = this.sequelize.define('Libro', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            titulo: {
                type: DataTypes.STRING(500),
                allowNull: false
            },
            autor: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            isbn: {
                type: DataTypes.STRING(20),
                allowNull: true,
                unique: true
            },
            categoria: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            editorial: {
                type: DataTypes.STRING(255),
                allowNull: true
            },
            anioPublicacion: {
                type: DataTypes.INTEGER,
                allowNull: true,
                validate: {
                    min: 1000,
                    max: new Date().getFullYear()
                }
            },
            cantidad: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                validate: {
                    min: 0
                }
            },
            disponibles: {
                type: DataTypes.INTEGER,
                defaultValue: 1,
                validate: {
                    min: 0
                }
            },
            ubicacion: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            estado: {
                type: DataTypes.ENUM('disponible', 'prestado', 'mantenimiento', 'perdido'),
                defaultValue: 'disponible'
            },
            descripcion: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }, {
            tableName: 'libros',
            indexes: [
                { fields: ['titulo'] },
                { fields: ['autor'] },
                { fields: ['isbn'] },
                { fields: ['categoria'] },
                { fields: ['estado'] }
            ]
        });

        // Modelo Socio
        this.models.Socio = this.sequelize.define('Socio', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: DataTypes.STRING(255),
                allowNull: false
            },
            email: {
                type: DataTypes.STRING(255),
                allowNull: true,
                validate: {
                    isEmail: true
                }
            },
            telefono: {
                type: DataTypes.STRING(20),
                allowNull: true
            },
            direccion: {
                type: DataTypes.TEXT,
                allowNull: true
            },
            estado: {
                type: DataTypes.ENUM('activo', 'inactivo', 'suspendido'),
                defaultValue: 'activo'
            },
            observaciones: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }, {
            tableName: 'socios',
            indexes: [
                { fields: ['nombre'] },
                { fields: ['email'] },
                { fields: ['estado'] }
            ]
        });

        // Modelo Préstamo
        this.models.Prestamo = this.sequelize.define('Prestamo', {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            fechaPrestamo: {
                type: DataTypes.DATE,
                defaultValue: DataTypes.NOW
            },
            fechaDevolucion: {
                type: DataTypes.DATE,
                allowNull: false
            },
            fechaDevolucionReal: {
                type: DataTypes.DATE,
                allowNull: true
            },
            estado: {
                type: DataTypes.ENUM('activo', 'completado', 'vencido', 'cancelado'),
                defaultValue: 'activo'
            },
            observaciones: {
                type: DataTypes.TEXT,
                allowNull: true
            }
        }, {
            tableName: 'prestamos',
            indexes: [
                { fields: ['estado'] },
                { fields: ['fechaDevolucion'] },
                { fields: ['fechaPrestamo'] }
            ]
        });

        // Definir relaciones
        this.defineAssociations();
    }

    defineAssociations() {
        // Una Biblioteca tiene muchos Libros
        this.models.Biblioteca.hasMany(this.models.Libro, {
            foreignKey: 'bibliotecaId',
            as: 'libros',
            onDelete: 'CASCADE'
        });
        this.models.Libro.belongsTo(this.models.Biblioteca, {
            foreignKey: 'bibliotecaId',
            as: 'biblioteca'
        });

        // Una Biblioteca tiene muchos Socios
        this.models.Biblioteca.hasMany(this.models.Socio, {
            foreignKey: 'bibliotecaId',
            as: 'socios',
            onDelete: 'CASCADE'
        });
        this.models.Socio.belongsTo(this.models.Biblioteca, {
            foreignKey: 'bibliotecaId',
            as: 'biblioteca'
        });

        // Una Biblioteca tiene muchos Préstamos
        this.models.Biblioteca.hasMany(this.models.Prestamo, {
            foreignKey: 'bibliotecaId',
            as: 'prestamos',
            onDelete: 'CASCADE'
        });
        this.models.Prestamo.belongsTo(this.models.Biblioteca, {
            foreignKey: 'bibliotecaId',
            as: 'biblioteca'
        });

        // Un Libro tiene muchos Préstamos
        this.models.Libro.hasMany(this.models.Prestamo, {
            foreignKey: 'libroId',
            as: 'prestamos',
            onDelete: 'CASCADE'
        });
        this.models.Prestamo.belongsTo(this.models.Libro, {
            foreignKey: 'libroId',
            as: 'libro'
        });

        // Un Socio tiene muchos Préstamos
        this.models.Socio.hasMany(this.models.Prestamo, {
            foreignKey: 'socioId',
            as: 'prestamos',
            onDelete: 'CASCADE'
        });
        this.models.Prestamo.belongsTo(this.models.Socio, {
            foreignKey: 'socioId',
            as: 'socio'
        });
    }

    async createTables() {
        try {
            await this.sequelize.sync({ alter: true });
            console.log('Tablas creadas/actualizadas correctamente');
        } catch (error) {
            console.error('Error al crear tablas:', error);
            throw error;
        }
    }

    // ===== OPERACIONES DE BIBLIOTECAS =====
    
    async createBiblioteca(bibliotecaData) {
        try {
            // Desactivar todas las bibliotecas existentes
            await this.models.Biblioteca.update(
                { activa: false },
                { where: {} }
            );
            
            const biblioteca = await this.models.Biblioteca.create({
                ...bibliotecaData,
                activa: true
            });
            
            return biblioteca.toJSON();
        } catch (error) {
            console.error('Error al crear biblioteca:', error);
            throw error;
        }
    }

    async getBibliotecas() {
        try {
            const bibliotecas = await this.models.Biblioteca.findAll({
                order: [['createdAt', 'DESC']]
            });
            return bibliotecas.map(b => b.toJSON());
        } catch (error) {
            console.error('Error al obtener bibliotecas:', error);
            throw error;
        }
    }

    async getBibliotecaById(id) {
        try {
            const biblioteca = await this.models.Biblioteca.findByPk(id);
            return biblioteca ? biblioteca.toJSON() : null;
        } catch (error) {
            console.error('Error al obtener biblioteca:', error);
            throw error;
        }
    }

    async getBibliotecaActiva() {
        try {
            const biblioteca = await this.models.Biblioteca.findOne({
                where: { activa: true }
            });
            return biblioteca ? biblioteca.toJSON() : null;
        } catch (error) {
            console.error('Error al obtener biblioteca activa:', error);
            throw error;
        }
    }

    async updateBiblioteca(id, updates) {
        try {
            const [affectedRows] = await this.models.Biblioteca.update(updates, {
                where: { id }
            });
            return affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar biblioteca:', error);
            throw error;
        }
    }

    async deleteBiblioteca(id) {
        try {
            const affectedRows = await this.models.Biblioteca.destroy({
                where: { id }
            });
            return affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar biblioteca:', error);
            throw error;
        }
    }

    async activateBiblioteca(id) {
        try {
            // Desactivar todas las bibliotecas
            await this.models.Biblioteca.update(
                { activa: false },
                { where: {} }
            );
            
            // Activar la biblioteca seleccionada
            const [affectedRows] = await this.models.Biblioteca.update(
                { activa: true },
                { where: { id } }
            );
            
            return affectedRows > 0;
        } catch (error) {
            console.error('Error al activar biblioteca:', error);
            throw error;
        }
    }

    // ===== OPERACIONES DE LIBROS =====
    
    async createLibro(libroData) {
        try {
            const libro = await this.models.Libro.create(libroData);
            return libro.toJSON();
        } catch (error) {
            console.error('Error al crear libro:', error);
            throw error;
        }
    }

    async getLibros(bibliotecaId, filters = {}) {
        try {
            const whereClause = { bibliotecaId };
            
            if (filters.search) {
                if (this.databaseType === 'postgres') {
                    whereClause[Sequelize.Op.or] = [
                        { titulo: { [Sequelize.Op.iLike]: `%${filters.search}%` } },
                        { autor: { [Sequelize.Op.iLike]: `%${filters.search}%` } },
                        { isbn: { [Sequelize.Op.iLike]: `%${filters.search}%` } }
                    ];
                } else {
                    whereClause[Sequelize.Op.or] = [
                        { titulo: { [Sequelize.Op.like]: `%${filters.search}%` } },
                        { autor: { [Sequelize.Op.like]: `%${filters.search}%` } },
                        { isbn: { [Sequelize.Op.like]: `%${filters.search}%` } }
                    ];
                }
            }
            
            if (filters.categoria) {
                whereClause.categoria = filters.categoria;
            }
            
            if (filters.estado) {
                whereClause.estado = filters.estado;
            }
            
            const libros = await this.models.Libro.findAll({
                where: whereClause,
                order: [['titulo', 'ASC']]
            });
            
            return libros.map(l => l.toJSON());
        } catch (error) {
            console.error('Error al obtener libros:', error);
            throw error;
        }
    }

    async getLibroById(id) {
        try {
            const libro = await this.models.Libro.findByPk(id);
            return libro ? libro.toJSON() : null;
        } catch (error) {
            console.error('Error al obtener libro:', error);
            throw error;
        }
    }

    async updateLibro(id, updates) {
        try {
            const [affectedRows] = await this.models.Libro.update(updates, {
                where: { id }
            });
            return affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar libro:', error);
            throw error;
        }
    }

    async deleteLibro(id) {
        try {
            const affectedRows = await this.models.Libro.destroy({
                where: { id }
            });
            return affectedRows > 0;
        } catch (error) {
            console.error('Error al eliminar libro:', error);
            throw error;
        }
    }

    // ===== OPERACIONES DE SOCIOS =====
    
    async createSocio(socioData) {
        try {
            const socio = await this.models.Socio.create(socioData);
            return socio.toJSON();
        } catch (error) {
            console.error('Error al crear socio:', error);
            throw error;
        }
    }
    async getSocios(bibliotecaId, filters = {}) {
        try {
            const whereClause = { bibliotecaId };
            
            if (filters.search) {
                if (this.databaseType === 'postgres') {
                    whereClause[Sequelize.Op.or] = [
                        { nombre: { [Sequelize.Op.iLike]: `%${filters.search}%` } },
                        { email: { [Sequelize.Op.iLike]: `%${filters.search}%` } }
                    ];
                } else {
                    whereClause[Sequelize.Op.or] = [
                        { nombre: { [Sequelize.Op.like]: `%${filters.search}%` } },
                        { email: { [Sequelize.Op.like]: `%${filters.search}%` } }
                    ];
                }
            }
            
            if (filters.estado) {
                whereClause.estado = filters.estado;
            }
            
            const socios = await this.models.Socio.findAll({
                where: whereClause,
                order: [['nombre', 'ASC']]
            });
            
            return socios.map(s => s.toJSON());
        } catch (error) {
            console.error('Error al obtener socios:', error);
            throw error;
        }
    }

    async getSocioById(id) {
        try {
            const socio = await this.models.Socio.findByPk(id);
            return socio ? socio.toJSON() : null;
        } catch (error) {
            console.error('Error al obtener socio:', error);
            throw error;
        }
    }

    async updateSocio(id, updates) {
        try {
            const [affectedRows] = await this.models.Socio.update(updates, {
                where: { id }
            });
            return affectedRows > 0;
        } catch (error) {
            console.error('Error al actualizar socio:', error);
            throw error;
        }
    }

    async deleteSocio(id) {
        try {
            const affectedRows = await this.models.Socio.destroy({
                where: { id }
            });
            return affectedRows > 0;
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
            const prestamo = await this.models.Prestamo.create(prestamoData);
            
            // Actualizar disponibilidad del libro
            await this.updateLibro(prestamoData.libroId, {
                disponibles: libro.disponibles - 1,
                estado: libro.disponibles - 1 === 0 ? 'prestado' : 'disponible'
            });
            
            return prestamo.toJSON();
        } catch (error) {
            console.error('Error al crear préstamo:', error);
            throw error;
        }
    }

    async getPrestamos(bibliotecaId, filters = {}) {
        try {
            const whereClause = { bibliotecaId };
            
            if (filters.estado) {
                whereClause.estado = filters.estado;
            }
            
            const prestamos = await this.models.Prestamo.findAll({
                where: whereClause,
                include: [
                    {
                        model: this.models.Libro,
                        as: 'libro',
                        attributes: ['titulo', 'autor']
                    },
                    {
                        model: this.models.Socio,
                        as: 'socio',
                        attributes: ['nombre', 'email']
                    }
                ],
                order: [['fechaPrestamo', 'DESC']]
            });
            
            return prestamos.map(p => p.toJSON());
        } catch (error) {
            console.error('Error al obtener préstamos:', error);
            throw error;
        }
    }

    async getPrestamoById(id) {
        try {
            const prestamo = await this.models.Prestamo.findByPk(id, {
                include: [
                    {
                        model: this.models.Libro,
                        as: 'libro',
                        attributes: ['titulo', 'autor']
                    },
                    {
                        model: this.models.Socio,
                        as: 'socio',
                        attributes: ['nombre', 'email']
                    }
                ]
            });
            return prestamo ? prestamo.toJSON() : null;
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
            const [affectedRows] = await this.models.Prestamo.update({
                estado: 'completado',
                fechaDevolucionReal: new Date()
            }, {
                where: { id: prestamoId }
            });
            
            if (affectedRows > 0) {
                // Actualizar disponibilidad del libro
                const libro = await this.getLibroById(prestamo.libroId);
                await this.updateLibro(prestamo.libroId, {
                    disponibles: libro.disponibles + 1,
                    estado: 'disponible'
                });
            }
            
            return affectedRows > 0;
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
            stats.totalLibros = await this.models.Libro.count({
                where: { bibliotecaId }
            });
            
            // Total de socios
            stats.totalSocios = await this.models.Socio.count({
                where: { bibliotecaId }
            });
            
            // Préstamos activos
            stats.prestamosActivos = await this.models.Prestamo.count({
                where: { 
                    bibliotecaId,
                    estado: 'activo'
                }
            });
            
            // Préstamos vencidos
            stats.prestamosVencidos = await this.models.Prestamo.count({
                where: {
                    bibliotecaId,
                    estado: 'activo',
                    fechaDevolucion: {
                        [Sequelize.Op.lt]: new Date()
                    }
                }
            });
            
            // Préstamos completados
            stats.prestamosCompletados = await this.models.Prestamo.count({
                where: {
                    bibliotecaId,
                    estado: 'completado'
                }
            });
            
            return stats;
        } catch (error) {
            console.error('Error al obtener estadísticas:', error);
            throw error;
        }
    }

    async getPrestamosPorMes(bibliotecaId, meses = 6) {
        try {
            const fechaLimite = new Date();
            fechaLimite.setMonth(fechaLimite.getMonth() - meses);
            
            if (this.databaseType === 'postgres') {
                const prestamos = await this.models.Prestamo.findAll({
                    where: {
                        bibliotecaId,
                        fechaPrestamo: {
                            [Sequelize.Op.gte]: fechaLimite
                        }
                    },
                    attributes: [
                        [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('fechaPrestamo')), 'mes'],
                        [Sequelize.fn('COUNT', Sequelize.col('id')), 'prestamos'],
                        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN estado = 'completado' THEN 1 ELSE 0 END")), 'devoluciones']
                    ],
                    group: [Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('fechaPrestamo'))],
                    order: [[Sequelize.fn('DATE_TRUNC', 'month', Sequelize.col('fechaPrestamo')), 'ASC']],
                    raw: true
                });
                
                return prestamos;
            } else {
                // SQLite fallback
                const prestamos = await this.models.Prestamo.findAll({
                    where: {
                        bibliotecaId,
                        fechaPrestamo: {
                            [Sequelize.Op.gte]: fechaLimite
                        }
                    },
                    attributes: [
                        [Sequelize.fn('strftime', '%Y-%m', Sequelize.col('fechaPrestamo')), 'mes'],
                        [Sequelize.fn('COUNT', Sequelize.col('id')), 'prestamos'],
                        [Sequelize.fn('SUM', Sequelize.literal("CASE WHEN estado = 'completado' THEN 1 ELSE 0 END")), 'devoluciones']
                    ],
                    group: [Sequelize.fn('strftime', '%Y-%m', Sequelize.col('fechaPrestamo'))],
                    order: [[Sequelize.fn('strftime', '%Y-%m', Sequelize.col('fechaPrestamo')), 'ASC']],
                    raw: true
                });
                
                return prestamos;
            }
        } catch (error) {
            console.error('Error al obtener préstamos por mes:', error);
            throw error;
        }
    }

    async getLibrosPorCategoria(bibliotecaId) {
        try {
            const categorias = await this.models.Libro.findAll({
                where: { bibliotecaId },
                attributes: [
                    'categoria',
                    [Sequelize.fn('COUNT', Sequelize.col('id')), 'cantidad']
                ],
                group: ['categoria'],
                order: [[Sequelize.fn('COUNT', Sequelize.col('id')), 'DESC']],
                raw: true
            });
            
            return categorias;
        } catch (error) {
            console.error('Error al obtener libros por categoría:', error);
            throw error;
        }
    }

    // ===== UTILIDADES =====
    
    async close() {
        if (this.sequelize) {
            await this.sequelize.close();
        }
    }

    async backup(destinationPath) {
        try {
            if (this.databaseType === 'postgres') {
                console.log('Backup de PostgreSQL requiere pg_dump manual');
                return true;
            } else {
                // SQLite backup
                return true;
            }
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
            type: this.databaseType,
            host: this.sequelize?.config?.host || 'N/A',
            port: this.sequelize?.config?.port || 'N/A',
            database: this.sequelize?.config?.database || 'N/A',
            dialect: this.sequelize?.config?.dialect || 'N/A'
        };
    }
}

module.exports = DatabaseService;