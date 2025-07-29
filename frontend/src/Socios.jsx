import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Filter, User, Mail, Phone, Calendar, 
  CheckCircle, AlertTriangle, Clock, Eye, Edit, Trash2,
  ArrowUpDown, Users, FileText, Circle, Triangle, CheckCircle2, MapPin
} from 'lucide-react';
import './socios.css';
import Navbar from './Navbar.jsx';

export default function Socios() {
  // Estados principales
  const [socios, setSocios] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('todos');
  const [selectedSocio, setSelectedSocio] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [socioToDelete, setSocioToDelete] = useState(null);

  // Estado del formulario
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    fechaRegistro: '',
    observaciones: ''
  });

  // Cargar datos de ejemplo al montar el componente
  useEffect(() => {
    // Datos de ejemplo para socios
    const sociosEjemplo = [
      { 
        id: 1, 
        nombre: 'María González', 
        email: 'maria@email.com', 
        telefono: '123-456-789', 
        direccion: 'Av. San Martín 123',
        fechaRegistro: '2024-01-15',
        estado: 'activo',
        prestamosActivos: 2,
        prestamosTotales: 15,
        observaciones: 'Socia frecuente'
      },
      { 
        id: 2, 
        nombre: 'Juan Pérez', 
        email: 'juan@email.com', 
        telefono: '123-456-790', 
        direccion: 'Belgrano 456',
        fechaRegistro: '2024-01-20',
        estado: 'activo',
        prestamosActivos: 1,
        prestamosTotales: 8,
        observaciones: ''
      },
      { 
        id: 3, 
        nombre: 'Ana López', 
        email: 'ana@email.com', 
        telefono: '123-456-791', 
        direccion: 'Rivadavia 789',
        fechaRegistro: '2023-12-10',
        estado: 'inactivo',
        prestamosActivos: 0,
        prestamosTotales: 5,
        observaciones: 'Socio inactivo'
      },
      { 
        id: 4, 
        nombre: 'Carlos Rodríguez', 
        email: 'carlos@email.com', 
        telefono: '123-456-792', 
        direccion: 'Mitre 321',
        fechaRegistro: '2024-02-01',
        estado: 'activo',
        prestamosActivos: 3,
        prestamosTotales: 12,
        observaciones: 'Nuevo socio'
      },
      { 
        id: 5, 
        nombre: 'Laura Martínez', 
        email: 'laura@email.com', 
        telefono: '123-456-793', 
        direccion: 'Sarmiento 654',
        fechaRegistro: '2024-01-05',
        estado: 'activo',
        prestamosActivos: 0,
        prestamosTotales: 3,
        observaciones: ''
      }
    ];

    setSocios(sociosEjemplo);
  }, []);

  // Funciones auxiliares
  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'activo': return '#10b981';
      case 'inactivo': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getEstadoIcon = (estado) => {
    switch (estado) {
      case 'activo': return <CheckCircle size={14} />;
      case 'inactivo': return <Circle size={14} />;
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
    
    const newSocio = {
      id: Date.now(),
      ...formData,
      estado: 'activo',
      prestamosActivos: 0,
      prestamosTotales: 0,
      fechaRegistro: new Date().toISOString().split('T')[0]
    };

    setSocios([...socios, newSocio]);
    setFormData({
      nombre: '',
      email: '',
      telefono: '',
      direccion: '',
      fechaRegistro: '',
      observaciones: ''
    });
    setShowForm(false);
  };

  const handleEliminar = (socioId) => {
    setSocioToDelete(socioId);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = () => {
    if (socioToDelete) {
      setSocios(socios.filter(socio => socio.id !== socioToDelete));
      setSocioToDelete(null);
    }
    setShowDeleteConfirm(false);
  };

  const cancelDelete = () => {
    setSocioToDelete(null);
    setShowDeleteConfirm(false);
  };

  // Filtrado y búsqueda
  const filteredSocios = socios.filter(socio => {
    const matchesSearch = searchTerm === '' || 
      socio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      socio.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filterStatus === 'todos' || socio.estado === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  // Estadísticas
  const stats = {
    total: socios.length,
    activos: socios.filter(s => s.estado === 'activo').length,
    inactivos: socios.filter(s => s.estado === 'inactivo').length,
    nuevos: socios.filter(s => {
      const fechaRegistro = new Date(s.fechaRegistro);
      const unMesAtras = new Date();
      unMesAtras.setMonth(unMesAtras.getMonth() - 1);
      return fechaRegistro > unMesAtras;
    }).length
  };

  return (
    <>
      <Navbar />
      <div className="socios-container">
        {/* Header */}
        <div className="socios-header">
          <div className="header-content">
            <h1>Gestión de Socios</h1>
            <span className="header-separator">|</span>
            <p>Administrá los socios de la biblioteca, sus datos y estado de membresía</p>
          </div>
          <button 
            className="add-button"
            onClick={() => setShowForm(!showForm)}
          >
            <Plus size={18} />
            Nuevo Socio
          </button>
        </div>

        {/* Estadísticas */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon">
              <Users size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Total Socios</h3>
              <p className="stat-value">{stats.total}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <CheckCircle2 size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Activos</h3>
              <p className="stat-value">{stats.activos}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Circle size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Inactivos</h3>
              <p className="stat-value">{stats.inactivos}</p>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon">
              <Clock size={20} strokeWidth={1.5} />
            </div>
            <div className="stat-content">
              <h3>Nuevos (1 mes)</h3>
              <p className="stat-value">{stats.nuevos}</p>
            </div>
          </div>
        </div>

        {/* Formulario de nuevo socio */}
        {showForm && (
          <div className="form-section">
            <h3>Nuevo Socio</h3>
            <form onSubmit={handleSubmit} className="socio-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="nombre">Nombre Completo *</label>
                  <input
                    type="text"
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="telefono">Teléfono</label>
                  <input
                    type="tel"
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="direccion">Dirección</label>
                  <input
                    type="text"
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="observaciones">Observaciones</label>
                  <textarea
                    id="observaciones"
                    name="observaciones"
                    value={formData.observaciones}
                    onChange={handleInputChange}
                    rows="3"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="submit" className="submit-button">
                  <Plus size={16} />
                  Registrar Socio
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
              placeholder="Buscar por nombre o email..."
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
              <option value="activo">Activos</option>
              <option value="inactivo">Inactivos</option>
            </select>
          </div>
        </div>

        {/* Tabla de socios */}
        <div className="table-section">
          <div className="table-header">
            <h3>Lista de Socios</h3>
            <span className="count">{filteredSocios.length} socios</span>
          </div>
          <div className="table-container">
            <table className="socios-table">
              <thead>
                <tr>
                  <th>Socio</th>
                  <th>Contacto</th>
                  <th>Fecha Registro</th>
                  <th>Estado</th>
                  <th>Préstamos</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filteredSocios.map(socio => {
                  return (
                    <tr key={socio.id}>
                      <td>
                        <div className="socio-info">
                          <User size={16} />
                          <div>
                            <strong>{socio.nombre}</strong>
                            {socio.direccion && (
                              <div className="socio-address">
                                <MapPin size={12} />
                                {socio.direccion}
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="contact-info">
                          <div className="contact-item">
                            <Mail size={12} />
                            {socio.email}
                          </div>
                          {socio.telefono && (
                            <div className="contact-item">
                              <Phone size={12} />
                              {socio.telefono}
                            </div>
                          )}
                        </div>
                      </td>
                      <td>{socio.fechaRegistro}</td>
                      <td>
                        <span 
                          className="status-badge"
                          style={{ backgroundColor: getEstadoColor(socio.estado) }}
                        >
                          {getEstadoIcon(socio.estado)}
                          {socio.estado}
                        </span>
                      </td>
                      <td>
                        <div className="prestamos-info">
                          <div className="prestamos-activos">
                            <Clock size={12} />
                            {socio.prestamosActivos} activos
                          </div>
                          <div className="prestamos-totales">
                            <FileText size={12} />
                            {socio.prestamosTotales} total
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="actions">
                          <button 
                            className="action-btn view"
                            onClick={() => {
                              setSelectedSocio(socio);
                              setShowDetails(true);
                            }}
                            title="Ver detalles"
                          >
                            <Eye size={14} />
                          </button>
                          <button 
                            className="action-btn edit"
                            title="Editar socio"
                          >
                            <Edit size={14} />
                          </button>
                          <button 
                            className="action-btn delete"
                            onClick={() => handleEliminar(socio.id)}
                            title="Eliminar socio"
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
        {showDetails && selectedSocio && (
          <div className="modal-overlay" onClick={() => setShowDetails(false)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Detalles del Socio #{selectedSocio.id}</h3>
                <button 
                  className="close-button"
                  onClick={() => setShowDetails(false)}
                >
                  ×
                </button>
              </div>
              <div className="modal-body">
                <div className="detail-row">
                  <span className="label">Nombre:</span>
                  <span className="value">{selectedSocio.nombre}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Email:</span>
                  <span className="value">{selectedSocio.email}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Teléfono:</span>
                  <span className="value">{selectedSocio.telefono || 'No especificado'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Dirección:</span>
                  <span className="value">{selectedSocio.direccion || 'No especificada'}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Fecha de Registro:</span>
                  <span className="value">{selectedSocio.fechaRegistro}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Estado:</span>
                  <span 
                    className="value status-badge"
                    style={{ backgroundColor: getEstadoColor(selectedSocio.estado) }}
                  >
                    {selectedSocio.estado}
                  </span>
                </div>
                <div className="detail-row">
                  <span className="label">Préstamos Activos:</span>
                  <span className="value">{selectedSocio.prestamosActivos}</span>
                </div>
                <div className="detail-row">
                  <span className="label">Total de Préstamos:</span>
                  <span className="value">{selectedSocio.prestamosTotales}</span>
                </div>
                {selectedSocio.observaciones && (
                  <div className="detail-row">
                    <span className="label">Observaciones:</span>
                    <span className="value">{selectedSocio.observaciones}</span>
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
                  <p>¿Estás seguro de que quieres eliminar este socio?</p>
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