import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, BookOpen, User, Calendar, 
  CheckCircle, AlertTriangle, Clock, Eye, Edit, Trash2,
  ArrowUpDown, Book, FileText, Circle, Triangle, CheckCircle2, 
  MapPin, Hash, Tag, Star, Users
} from 'lucide-react';
import './libros.css';
import Navbar from './Navbar.jsx';

export default function Libros() {
  // Estados principales
  const [libros, setLibros] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedLibro, setSelectedLibro] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [libroToDelete, setLibroToDelete] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    titulo: '',
    autor: '',
    isbn: '',
    categoria: '',
    editorial: '',
    anioPublicacion: '',
    cantidad: '',
    ubicacion: '',
    descripcion: ''
  });

  // Cargar datos de ejemplo al montar el componente
  useEffect(() => {
    // Datos de ejemplo para libros
    const librosEjemplo = [
      { 
        id: 1, 
        titulo: 'El Señor de los Anillos', 
        autor: 'J.R.R. Tolkien', 
        isbn: '978-84-450-7054-9',
        categoria: 'Fantasía',
        editorial: 'Minotauro',
        anioPublicacion: '1954',
        cantidad: 3,
        disponibles: 1,
        prestamosTotales: 25,
        ubicacion: 'Estante A-1',
        estado: 'disponible',
        descripcion: 'Trilogía épica de fantasía'
      },
      { 
        id: 2, 
        titulo: 'Cien años de soledad', 
        autor: 'Gabriel García Márquez', 
        isbn: '978-84-397-2071-7',
        categoria: 'Literatura',
        editorial: 'Editorial Sudamericana',
        anioPublicacion: '1967',
        cantidad: 2,
        disponibles: 0,
        prestamosTotales: 18,
        ubicacion: 'Estante B-3',
        estado: 'prestado',
        descripcion: 'Obra maestra del realismo mágico'
      },
      { 
        id: 3, 
        titulo: '1984', 
        autor: 'George Orwell', 
        isbn: '978-84-206-0000-0',
        categoria: 'Ciencia Ficción',
        editorial: 'Debolsillo',
        anioPublicacion: '1949',
        cantidad: 4,
        disponibles: 3,
        prestamosTotales: 32,
        ubicacion: 'Estante C-2',
        estado: 'disponible',
        descripcion: 'Distopía clásica'
      },
      { 
        id: 4, 
        titulo: 'Don Quijote de la Mancha', 
        autor: 'Miguel de Cervantes', 
        isbn: '978-84-376-0494-7',
        categoria: 'Clásico',
        editorial: 'Cátedra',
        anioPublicacion: '1605',
        cantidad: 2,
        disponibles: 2,
        prestamosTotales: 12,
        ubicacion: 'Estante A-5',
        estado: 'disponible',
        descripcion: 'Obra cumbre de la literatura española'
      },
      { 
        id: 5, 
        titulo: 'Harry Potter y la piedra filosofal', 
        autor: 'J.K. Rowling', 
        isbn: '978-84-9838-095-8',
        categoria: 'Fantasía',
        editorial: 'Salamandra',
        anioPublicacion: '1997',
        cantidad: 5,
        disponibles: 2,
        prestamosTotales: 45,
        ubicacion: 'Estante D-1',
        estado: 'disponible',
        descripcion: 'Primera entrega de la saga'
      },
      { 
        id: 6, 
        titulo: 'El Principito', 
        autor: 'Antoine de Saint-Exupéry', 
        isbn: '978-84-206-0000-1',
        categoria: 'Infantil',
        editorial: 'Salamandra',
        anioPublicacion: '1943',
        cantidad: 3,
        disponibles: 0,
        prestamosTotales: 28,
        ubicacion: 'Estante E-4',
        estado: 'prestado',
        descripcion: 'Clásico de la literatura infantil'
      }
    ];

    setLibros(librosEjemplo);
  }, []);

  // Funciones auxiliares
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'disponible': return '#10b981';
      case 'prestado': return '#f59e0b';
      case 'mantenimiento': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'disponible': return <CheckCircle size={14} />;
      case 'prestado': return <Clock size={14} />;
      case 'mantenimiento': return <AlertTriangle size={14} />;
      default: return <Circle size={14} />;
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newLibro = {
      id: Date.now(),
      ...formData,
      cantidad: parseInt(formData.cantidad),
      disponibles: parseInt(formData.cantidad),
      prestamosTotales: 0,
      estado: 'disponible',
      anioPublicacion: formData.anioPublicacion || new Date().getFullYear().toString()
    };

    setLibros([...libros, newLibro]);
    setFormData({
      titulo: '',
      autor: '',
      isbn: '',
      categoria: '',
      editorial: '',
      anioPublicacion: '',
      cantidad: '',
      ubicacion: '',
      descripcion: ''
    });
    setShowForm(false);
  };

  const handleEliminar = (libroId) => {
    setLibroToDelete(libroId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (libroToDelete) {
      setLibros(libros.filter(libro => libro.id !== libroToDelete));
      setLibroToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setLibroToDelete(null);
    setShowDeleteConfirm(false);
  };

  // Filtrado y búsqueda
  const filteredLibros = libros.filter(libro => {
    const matchesSearch = searchTerm === '' || 
      libro.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.autor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      libro.isbn.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'todos' || libro.estado === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Estadísticas
  const stats = {
    total: libros.length,
    disponibles: libros.filter(l => l.estado === 'disponible').length,
    prestados: libros.filter(l => l.estado === 'prestado').length,
    totalEjemplares: libros.reduce((sum, libro) => sum + libro.cantidad, 0)
  };

  return (
    <div className="page page-libros">
      <Navbar />
      <div className="libros-container">
        {/* Header */}
        <div className="libros-header">
          <div className="header-content">
            <h1>Gestión de Libros</h1>
            <span className="header-separator">|</span>
            <p>Administrá el catálogo de libros, ejemplares y disponibilidad</p>
          </div>
          <button 
            className="add-button"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} />
            Nuevo Libro
          </button>
        </div>

        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Book size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Total Libros</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle2 size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Disponibles</h3>
              <p className="stat-value">{stats.disponibles}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Prestados</h3>
              <p className="stat-value">{stats.prestados}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Total Ejemplares</h3>
              <p className="stat-value">{stats.totalEjemplares}</p>
            </div>
          </div>
        </div>

        {/* Formulario de nuevo libro */}
        {showForm && (
          <div className="form-section">
            <h3>Nuevo Libro</h3>
            <form onSubmit={handleSubmit} className="libro-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="titulo">Título *</label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="autor">Autor *</label>
                  <input
                    type="text"
                    id="autor"
                    name="autor"
                    value={formData.autor}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="isbn">ISBN</label>
                  <input
                    type="text"
                    id="isbn"
                    name="isbn"
                    value={formData.isbn}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="categoria">Categoría</label>
                  <input
                    type="text"
                    id="categoria"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="editorial">Editorial</label>
                  <input
                    type="text"
                    id="editorial"
                    name="editorial"
                    value={formData.editorial}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="anioPublicacion">Año de Publicación</label>
                  <input
                    type="number"
                    id="anioPublicacion"
                    name="anioPublicacion"
                    value={formData.anioPublicacion}
                    onChange={handleInputChange}
                    min="1000"
                    max={new Date().getFullYear()}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="cantidad">Cantidad de Ejemplares *</label>
                  <input
                    type="number"
                    id="cantidad"
                    name="cantidad"
                    value={formData.cantidad}
                    onChange={handleInputChange}
                    required
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ubicacion">Ubicación</label>
                  <input
                    type="text"
                    id="ubicacion"
                    name="ubicacion"
                    value={formData.ubicacion}
                    onChange={handleInputChange}
                    placeholder="Ej: Estante A-1"
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="descripcion">Descripción</label>
                  <textarea
                    id="descripcion"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  <Plus size={16} />
                  Registrar Libro
                </button>
                <button 
                  type="button" 
                  className="cancel-button"
                  onClick={() => setShowForm(false)}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Filtros y búsqueda */}
        <div className="filters-section">
          <div className="search-box">
            <Search size={16} />
            <input
              type="text"
              placeholder="Buscar por título, autor o ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={16} />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="disponible">Disponibles</option>
              <option value="prestado">Prestados</option>
              <option value="mantenimiento">En mantenimiento</option>
            </select>
          </div>
        </div>

        {/* Tabla de libros */}
        <div className="table-section">
          <div className="table-header">
            <h3>Catálogo de Libros</h3>
            <span className="count">{filteredLibros.length} libros</span>
          </div>
          <div className="table-container">
            <table className="libros-table">
              <thead>
                <tr>
                  <th>Libro</th>
                  <th>Información</th>
                  <th>Ejemplares</th>
                  <th>Estado</th>
                  <th>Ubicación</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredLibros.map(libro => {
                  return (
                    <tr key={libro.id}>
                      <td>
                        <div className="libro-info">
                          <BookOpen size={16} />
                          <div>
                            <strong>{libro.titulo}</strong>
                            <div className="libro-author">
                              <User size={12} />
                              {libro.autor}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="libro-details">
                          {libro.isbn && (
                            <div className="detail-item">
                              <Hash size={12} />
                              {libro.isbn}
                            </div>
                          )}
                          <div className="detail-item">
                            <Tag size={12} />
                            {libro.categoria}
                          </div>
                          {libro.editorial && (
                            <div className="detail-item">
                              <FileText size={12} />
                              {libro.editorial} ({libro.anioPublicacion})
                            </div>
                          )}
                        </div>
                      </td>
                      <td>
                        <div className="ejemplares-info">
                          <div className="ejemplares-total">
                            <Book size={12} />
                            {libro.cantidad} total
                          </div>
                          <div className="ejemplares-disponibles">
                            <CheckCircle size={12} />
                            {libro.disponibles} disponibles
                          </div>
                          <div className="ejemplares-prestados">
                            <Clock size={12} />
                            {libro.cantidad - libro.disponibles} prestados
                          </div>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getEstadoColor(libro.estado) }}
                        >
                          {getEstadoIcon(libro.estado)}
                          {libro.estado}
                        </span>
                      </td>
                      <td>
                        {libro.ubicacion && (
                          <div className="ubicacion-info">
                            <MapPin size={12} />
                            {libro.ubicacion}
                          </div>
                        )}
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            className="action-btn view"
                            onClick={() => {
                              setSelectedLibro(libro);
                              setShowDetails(true);
                            }}
                            title="Ver detalles"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className="action-btn edit"
                            title="Editar libro"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleEliminar(libro.id)}
                            title="Eliminar libro"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal de detalles */}
        {showDetails && selectedLibro && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Detalles del Libro #{selectedLibro.id}</h3>
                <button 
                  className="close-button"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-row">
                  <span className="label">Título:</span>
                  <span className="value">{selectedLibro.titulo}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Autor:</span>
                  <span className="value">{selectedLibro.autor}</span>
                </div>
                <div className="detail-row">
                  <span className="label">ISBN:</span>
                  <span className="value">{selectedLibro.isbn || 'No especificado'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Categoría:</span>
                  <span className="value">{selectedLibro.categoria || 'No especificada'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Editorial:</span>
                  <span className="value">{selectedLibro.editorial || 'No especificada'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Año de Publicación:</span>
                  <span className="value">{selectedLibro.anioPublicacion}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Cantidad Total:</span>
                  <span className="value">{selectedLibro.cantidad} ejemplares</span>
                </div>
                <div className="detail-row">
                  <span className="label">Disponibles:</span>
                  <span className="value">{selectedLibro.disponibles} ejemplares</span>
                </div>
                <div className="detail-row">
                  <span className="label">Prestados:</span>
                  <span className="value">{selectedLibro.cantidad - selectedLibro.disponibles} ejemplares</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total de Préstamos:</span>
                  <span className="value">{selectedLibro.prestamosTotales}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Estado:</span>
                  <span 
                    className="value status-badge"
                    style={{ backgroundColor: getEstadoColor(selectedLibro.estado) }}
                  >
                    {selectedLibro.estado}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Ubicación:</span>
                  <span className="value">{selectedLibro.ubicacion || 'No especificada'}</span>
                </div>
                {selectedLibro.descripcion && (
                  <div className="detail-row">
                    <span className="label">Descripción:</span>
                    <span className="value">{selectedLibro.descripcion}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Modal de confirmación de eliminación */}
        {showDeleteConfirm && (
          <div className="modal-overlay" onClick={cancelDelete}>
            <div className="modal-content confirm-modal" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Confirmar Eliminación</h3>
                <button 
                  className="close-button"
                  onClick={cancelDelete}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="confirm-message">
                  <AlertTriangle size={24} color="#ef4444" />
                  <p>¿Estás seguro de que quieres eliminar este libro?</p>
                  <p className="confirm-warning">Esta acción no se puede deshacer.</p>
                </div>
                <div className="confirm-actions">
                  <button 
                    className="confirm-btn cancel"
                    onClick={cancelDelete}
                  >
                    Cancelar
                  </button>
                  <button 
                    className="confirm-btn delete"
                    onClick={confirmDelete}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 