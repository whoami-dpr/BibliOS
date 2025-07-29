import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, BookOpen, User, Calendar, 
  CheckCircle, AlertTriangle, Clock, Eye, Edit, Trash2,
  ArrowUpDown, Book, Users, FileText, Circle, Triangle, CheckCircle2
} from 'lucide-react';
import './prestamos.css';
import Navbar from './Navbar.jsx';

export default function Prestamos() {
  // Estados principales
  const [prestamos, setPrestamos] = useState([]);
  const [libros, setLibros] = useState([]);
  const [socios, setSocios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedPrestamo, setSelectedPrestamo] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [prestamoToDelete, setPrestamoToDelete] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    libroId: '',
    socioId: '',
    fechaPrestamo: '',
    fechaDevolucion: '',
    observaciones: ''
  });

  // Cargar datos de ejemplo al montar el componente
  useEffect(() => {
    // Datos de ejemplo para libros
    const librosEjemplo = [
      { id: 1, titulo: 'El Señor de los Anillos', autor: 'J.R.R. Tolkien', isbn: '978-84-450-0000-1', categoria: 'Ficción', disponible: true },
      { id: 2, titulo: '1984', autor: 'George Orwell', isbn: '978-84-450-0000-2', categoria: 'Ficción', disponible: true },
      { id: 3, titulo: 'Cien años de soledad', autor: 'Gabriel García Márquez', isbn: '978-84-450-0000-3', categoria: 'Ficción', disponible: false },
      { id: 4, titulo: 'Don Quijote', autor: 'Miguel de Cervantes', isbn: '978-84-450-0000-4', categoria: 'Clásico', disponible: true },
      { id: 5, titulo: 'El Principito', autor: 'Antoine de Saint-Exupéry', isbn: '978-84-450-0000-5', categoria: 'Ficción', disponible: true }
    ];

    // Datos de ejemplo para socios
    const sociosEjemplo = [
      { id: 1, nombre: 'María González', email: 'maria@email.com', telefono: '123-456-789', activo: true },
      { id: 2, nombre: 'Juan Pérez', email: 'juan@email.com', telefono: '123-456-790', activo: true },
      { id: 3, nombre: 'Ana López', email: 'ana@email.com', telefono: '123-456-791', activo: false },
      { id: 4, nombre: 'Carlos Rodríguez', email: 'carlos@email.com', telefono: '123-456-792', activo: true },
      { id: 5, nombre: 'Laura Martínez', email: 'laura@email.com', telefono: '123-456-793', activo: true }
    ];

    // Datos de ejemplo para préstamos
    const prestamosEjemplo = [
      {
        id: 1,
        libroId: 1,
        socioId: 1,
        fechaPrestamo: '2024-01-15',
        fechaDevolucion: '2024-02-15',
        fechaDevolucionReal: null,
        estado: 'activo',
        observaciones: 'Préstamo regular'
      },
      {
        id: 2,
        libroId: 2,
        socioId: 2,
        fechaPrestamo: '2024-01-10',
        fechaDevolucion: '2024-02-10',
        fechaDevolucionReal: '2024-02-08',
        estado: 'completado',
        observaciones: 'Devolución anticipada'
      },
      {
        id: 3,
        libroId: 3,
        socioId: 3,
        fechaPrestamo: '2024-01-05',
        fechaDevolucion: '2024-02-05',
        fechaDevolucionReal: null,
        estado: 'vencido',
        observaciones: 'Sin contacto'
      }
    ];

    setLibros(librosEjemplo);
    setSocios(sociosEjemplo);
    setPrestamos(prestamosEjemplo);
  }, []);

  // Funciones auxiliares
  const getLibroById = (id) => libros.find(libro => libro.id === id);
  const getSocioById = (id) => socios.find(socio => socio.id === id);
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo': return '#10b981';
      case 'vencido': return '#ef4444';
      case 'completado': return '#3b82f6';
      default: return '#6b7280';
    }
  };
  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'activo': return <CheckCircle size={16} />;
      case 'vencido': return <AlertTriangle size={16} />;
      case 'completado': return <Clock size={16} />;
      default: return <Clock size={16} />;
    }
  };

  // Manejo del formulario
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const nuevoPrestamo = {
      id: prestamos.length + 1,
      ...formData,
      estado: 'activo',
      fechaDevolucionReal: null
    };

    setPrestamos([...prestamos, nuevoPrestamo]);
    
    // Marcar libro como no disponible
    setLibros(libros.map(libro => 
      libro.id === parseInt(formData.libroId) 
        ? { ...libro, disponible: false }
        : libro
    ));

    setFormData({
      libroId: '',
      socioId: '',
      fechaPrestamo: '',
      fechaDevolucion: '',
      observaciones: ''
    });
    setShowForm(false);
  };

  // Acciones de préstamos
  const handleDevolver = (prestamoId) => {
    setPrestamos(prestamos.map(prestamo => {
      if (prestamo.id === prestamoId) {
        return {
          ...prestamo,
          estado: 'completado',
          fechaDevolucionReal: new Date().toISOString().split('T')[0]
        };
      }
      return prestamo;
    }));

    // Marcar libro como disponible
    const prestamo = prestamos.find(p => p.id === prestamoId);
    setLibros(libros.map(libro => 
      libro.id === prestamo.libroId 
        ? { ...libro, disponible: true }
        : libro
    ));
  };

  const handleRenovar = (prestamoId) => {
    const nuevaFecha = new Date();
    nuevaFecha.setDate(nuevaFecha.getDate() + 30); // Renovar por 30 días

    setPrestamos(prestamos.map(prestamo => {
      if (prestamo.id === prestamoId) {
        return {
          ...prestamo,
          fechaDevolucion: nuevaFecha.toISOString().split('T')[0]
        };
      }
      return prestamo;
    }));
  };

  const handleEliminar = (prestamoId) => {
    setPrestamoToDelete(prestamoId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (prestamoToDelete) {
      setPrestamos(prestamos.filter(prestamo => prestamo.id !== prestamoToDelete));
      setPrestamoToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setPrestamoToDelete(null);
    setShowDeleteConfirm(false);
  };

  // Filtrado y búsqueda
  const filteredPrestamos = prestamos.filter(prestamo => {
    const libro = getLibroById(prestamo.libroId);
    const socio = getSocioById(prestamo.socioId);
    
    const matchesSearch = searchTerm === '' || 
      libro?.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio?.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'todos' || prestamo.estado === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Estadísticas
  const stats = {
    total: prestamos.length,
    activos: prestamos.filter(p => p.estado === 'activo').length,
    vencidos: prestamos.filter(p => p.estado === 'vencido').length,
    completados: prestamos.filter(p => p.estado === 'completado').length
  };

  return (
    <>
      <Navbar />
      <div className="prestamos-container">
        {/* Header */}
        <div className="prestamos-header">
          <div className="header-content">
            <h1>Gestión de Préstamos</h1>
            <span className="header-separator">|</span>
            <p>Administrá los préstamos de libros, socios y fechas de devolución</p>
          </div>
          <button 
            className="add-button"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} />
            Nuevo Préstamo
          </button>
        </div>

        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <BookOpen size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Total Préstamos</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Activos</h3>
              <p className="stat-value">{stats.activos}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <AlertTriangle size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Vencidos</h3>
              <p className="stat-value">{stats.vencidos}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle2 size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Completados</h3>
              <p className="stat-value">{stats.completados}</p>
            </div>
          </div>
        </div>

        {/* Formulario de nuevo préstamo */}
        {showForm && (
          <div className="form-section">
            <h3>Nuevo Préstamo</h3>
            <form onSubmit={handleSubmit} className="prestamo-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="libroId">Libro *</label>
                  <select 
                    name="libroId" 
                    value={formData.libroId} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar libro</option>
                    {libros.filter(libro => libro.disponible).map(libro => (
                      <option key={libro.id} value={libro.id}>
                        {libro.titulo} - {libro.autor}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="socioId">Socio *</label>
                  <select 
                    name="socioId" 
                    value={formData.socioId} 
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Seleccionar socio</option>
                    {socios.filter(socio => socio.activo).map(socio => (
                      <option key={socio.id} value={socio.id}>
                        {socio.nombre}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label htmlFor="fechaPrestamo">Fecha Préstamo *</label>
                  <input 
                    type="date" 
                    name="fechaPrestamo" 
                    value={formData.fechaPrestamo} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="fechaDevolucion">Fecha Devolución *</label>
                  <input 
                    type="date" 
                    name="fechaDevolucion" 
                    value={formData.fechaDevolucion} 
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="form-group">
                <label htmlFor="observaciones">Observaciones</label>
                <textarea 
                  name="observaciones" 
                  value={formData.observaciones} 
                  onChange={handleInputChange}
                  placeholder="Notas adicionales sobre el préstamo..."
                  rows="3"
                />
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  <Plus size={18} />
                  Crear Préstamo
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
            <Search size={18} />
            <input
              type="text"
              placeholder="Buscar por libro o socio..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={18} />
            <select 
              value={filterStatus} 
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="todos">Todos los estados</option>
              <option value="activo">Activos</option>
              <option value="vencido">Vencidos</option>
              <option value="completado">Completados</option>
            </select>
          </div>
        </div>

        {/* Tabla de préstamos */}
        <div className="table-section">
          <div className="table-header">
            <h3>Lista de Préstamos</h3>
            <span className="count">{filteredPrestamos.length} préstamos</span>
          </div>
          <div className="table-container">
            <table className="prestamos-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Libro</th>
                  <th>Socio</th>
                  <th>Fecha Préstamo</th>
                  <th>Fecha Devolución</th>
                  <th>Estado</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrestamos.map(prestamo => {
                  const libro = getLibroById(prestamo.libroId);
                  const socio = getSocioById(prestamo.socioId);
                  
                  return (
                    <tr key={prestamo.id}>
                      <td>#{prestamo.id}</td>
                      <td>
                        <div className="book-info">
                          <Book size={14} />
                          <span>{libro?.titulo}</span>
                        </div>
                      </td>
                      <td>
                        <div className="user-info">
                          <User size={14} />
                          <span>{socio?.nombre}</span>
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          <Calendar size={14} />
                          <span>{prestamo.fechaPrestamo}</span>
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          <Calendar size={14} />
                          <span>{prestamo.fechaDevolucion}</span>
                        </div>
                      </td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getEstadoColor(prestamo.estado) }}
                        >
                          {getEstadoIcon(prestamo.estado)}
                          {prestamo.estado}
                        </span>
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            className="action-btn view"
                            onClick={() => {
                              setSelectedPrestamo(prestamo);
                              setShowDetails(true);
                            }}
                            title="Ver detalles"
                          >
                            <Eye size={14} />
                          </button>
                          {prestamo.estado === 'activo' && (
                            <>
                              <button 
                                className="action-btn edit"
                                onClick={() => handleRenovar(prestamo.id)}
                                title="Renovar préstamo"
                              >
                                <Edit size={14} />
                              </button>
                              <button 
                                className="action-btn complete"
                                onClick={() => handleDevolver(prestamo.id)}
                                title="Marcar como devuelto"
                              >
                                <CheckCircle size={14} />
                              </button>
                            </>
                          )}
                          <button 
                            className="action-btn delete"
                            onClick={() => handleEliminar(prestamo.id)}
                            title="Eliminar préstamo"
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
        {showDetails && selectedPrestamo && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Detalles del Préstamo #{selectedPrestamo.id}</h3>
                <button 
                  className="close-button"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-row">
                  <span className="label">Libro:</span>
                  <span className="value">{getLibroById(selectedPrestamo.libroId)?.titulo}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Socio:</span>
                  <span className="value">{getSocioById(selectedPrestamo.socioId)?.nombre}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Fecha de Préstamo:</span>
                  <span className="value">{selectedPrestamo.fechaPrestamo}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Fecha de Devolución:</span>
                  <span className="value">{selectedPrestamo.fechaDevolucion}</span>
                </div>
                {selectedPrestamo.fechaDevolucionReal && (
                  <div className="detail-row">
                    <span className="label">Fecha de Devolución Real:</span>
                    <span className="value">{selectedPrestamo.fechaDevolucionReal}</span>
                  </div>
                )}
                <div className="detail-row">
                  <span className="label">Estado:</span>
                  <span 
                    className="value status-badge"
                    style={{ backgroundColor: getEstadoColor(selectedPrestamo.estado) }}
                  >
                    {selectedPrestamo.estado}
                  </span>
                </div>
                {selectedPrestamo.observaciones && (
                  <div className="detail-row">
                    <span className="label">Observaciones:</span>
                    <span className="value">{selectedPrestamo.observaciones}</span>
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
                  <p>¿Estás seguro de que quieres eliminar este préstamo?</p>
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
    </>
  );
} 