import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';
import {
  BookOpen, Users, CalendarDays, TrendingUp, Clock, AlertTriangle,
  CheckCircle, X, Activity, Library, BarChart3, PieChart as PieChartIcon, LogOut
} from 'lucide-react';
import Navbar from './Navbar.jsx';
import './dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [activeLibrary, setActiveLibrary] = useState(null);
  const [stats, setStats] = useState({
    totalLibros: 0,
    totalSocios: 0,
    prestamosActivos: 0,
    prestamosVencidos: 0,
    prestamosCompletados: 0
  });

  // Estados para los gráficos con datos reales
  const [prestamosPorMes, setPrestamosPorMes] = useState([]);
  const [librosPorCategoria, setLibrosPorCategoria] = useState([]);
  const [sociosActivos, setSociosActivos] = useState([]);

  // Estado para préstamos próximos a vencer
  const [prestamosProximosAVencer, setPrestamosProximosAVencer] = useState(0);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        // Cargar biblioteca activa desde localStorage
        const storedLibrary = localStorage.getItem('bibliotecaActiva');
        if (storedLibrary) {
          const library = JSON.parse(storedLibrary);
          setActiveLibrary(library);

          // Cargar estadísticas REALES desde la base de datos
          if (window.electronAPI && library.id) {
            try {
              // Cargar estadísticas generales
              const realStats = await window.electronAPI.getBibliotecaStats(library.id);
              setStats({
                totalLibros: realStats.totalLibros || 0,
                totalSocios: realStats.totalSocios || 0,
                prestamosActivos: realStats.prestamosActivos || 0,
                prestamosVencidos: realStats.prestamosVencidos || 0,
                prestamosCompletados: realStats.prestamosCompletados || 0
              });

              // Cargar datos para gráficos
              try {
                // Préstamos por mes
                const prestamosMes = await window.electronAPI.getPrestamosPorMes(library.id, 6);
                const prestamosFormateados = prestamosMes.map(item => ({
                  mes: item.mes,
                  prestamos: item.prestamos || 0,
                  devoluciones: item.devoluciones || 0
                }));
                setPrestamosPorMes(prestamosFormateados);

                // Libros por categoría
                const librosCategoria = await window.electronAPI.getLibrosPorCategoria(library.id);
                const categoriasFormateadas = librosCategoria.map((item, index) => ({
                  name: item.categoria || 'Sin categoría',
                  value: item.cantidad || 0,
                  color: ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ec4899', '#6366f1'][index % 6]
                }));
                setLibrosPorCategoria(categoriasFormateadas);

                // Socios activos - datos históricos acumulados por mes
                const sociosPorMes = await window.electronAPI.getSociosPorMes(library.id, 6);
                const sociosActivosFormateados = sociosPorMes.map(item => ({
                  mes: item.mes,
                  activos: item.totalAcumulado || 0
                }));
                setSociosActivos(sociosActivosFormateados);

                // Calcular préstamos próximos a vencer (próximos 3 días)
                const prestamos = await window.electronAPI.getPrestamos(library.id, { estado: 'activo' });
                const hoy = new Date();
                const en3Dias = new Date();
                en3Dias.setDate(hoy.getDate() + 3);

                const proximosAVencer = prestamos.filter(prestamo => {
                  if (!prestamo.fechaDevolucion) return false;
                  const fechaDevolucion = new Date(prestamo.fechaDevolucion);
                  return fechaDevolucion >= hoy && fechaDevolucion <= en3Dias;
                }).length;

                setPrestamosProximosAVencer(proximosAVencer);
              } catch (error) {
                console.error('Error al cargar datos de gráficos:', error);
                // Si hay error, usar arrays vacíos
                setPrestamosPorMes([]);
                setLibrosPorCategoria([]);
                setSociosActivos([]);
                setPrestamosProximosAVencer(0);
              }
            } catch (error) {
              console.error('Error al cargar estadísticas:', error);
              // Si hay error, usar valores en 0
              setStats({
                totalLibros: 0,
                totalSocios: 0,
                prestamosActivos: 0,
                prestamosVencidos: 0,
                prestamosCompletados: 0
              });
              setPrestamosPorMes([]);
              setLibrosPorCategoria([]);
              setSociosActivos([]);
            }
          } else {
            // Fallback: valores en 0 si no hay electronAPI
            setStats({
              totalLibros: 0,
              totalSocios: 0,
              prestamosActivos: 0,
              prestamosVencidos: 0,
              prestamosCompletados: 0
            });
            setPrestamosPorMes([]);
            setLibrosPorCategoria([]);
            setSociosActivos([]);
          }
        } else {
          // Si no hay biblioteca activa, redirigir al login
          navigate('/login');
        }
      } catch (error) {
        console.error('Error al cargar datos del dashboard:', error);
        navigate('/login');
      }
    };

    loadDashboardData();
  }, [navigate]);

  const StatCard = ({ icon: Icon, title, value, color, change }) => (
    <div className="stat-card">
      <div className="stat-icon">
        <Icon size={20} strokeWidth={1.5} />
      </div>
      <div className="stat-content">
        <h3>{title}</h3>
        <p className="stat-value">{value.toLocaleString()}</p>
        {change && (
          <span className={`stat-change ${change > 0 ? 'positive' : 'negative'}`}>
            {change > 0 ? '+' : ''}{change}% vs mes anterior
          </span>
        )}
      </div>
    </div>
  );

  const handleLogout = async () => {
    try {
      // Usar el wrapper de diálogo nativo con reparación automática de foco
      const ok = await window.nativeDialog.confirm({
        message: '¿Seguro que querés cerrar sesión?',
        detail: 'Se cerrará tu sesión actual.',
        buttons: ['Cancelar', 'Cerrar sesión'],
        defaultId: 1,
        cancelId: 0,
        okIndex: 1
      });

      if (ok) {
        localStorage.removeItem('bibliotecaActiva');
        localStorage.removeItem('authData');
        navigate('/');

        // Opcional: Asegurar foco después del logout
        await window.nativeDialog.ensureFocus();
      }
    } catch (error) {
      console.error('Error en confirmación de logout:', error);
      // Fallback al confirm nativo si hay error
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        localStorage.removeItem('bibliotecaActiva');
        localStorage.removeItem('authData');
        navigate('/');
      }
    }
  };

  // Mostrar loading si no hay biblioteca activa
  if (!activeLibrary) {
    return (
      <>
        <Navbar />
        <div className="dashboard-container">
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
            <p style={{ color: 'white', fontSize: '1.2rem' }}>Cargando dashboard...</p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="dashboard-container">
        <section className="mt-8 mb-4">
          <div className="dashboard-header">
            <div className="header-content">
              <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">
                {activeLibrary ? activeLibrary.nombre : 'Biblioteca Demo'}
              </h1>
              <span className="header-separator">|</span>
              <p className="text-gray-400 text-lg max-w-2xl">
                Analizá y visualizá todas las estadísticas de tu biblioteca. Monitoreá préstamos, socios y actividad en tiempo real.
              </p>
            </div>
          </div>
        </section>

        {/* Tarjetas de estadísticas principales */}
        <section className="stats-grid">
          <StatCard
            icon={BookOpen}
            title="Total Libros"
            value={stats.totalLibros}
            color="#3b82f6"
          />
          <StatCard
            icon={Users}
            title="Socios Registrados"
            value={stats.totalSocios}
            color="#10b981"
          />
          <StatCard
            icon={CalendarDays}
            title="Préstamos Activos"
            value={stats.prestamosActivos}
            color="#f59e0b"
          />
          <StatCard
            icon={AlertTriangle}
            title="Préstamos Vencidos"
            value={stats.prestamosVencidos}
            color="#ef4444"
          />
        </section>

        {/* Gráficos principales */}
        <section className="charts-grid">
          {/* Gráfico de préstamos por mes */}
          <div className="chart-card">
            <div className="chart-header">
              <BarChart3 size={18} strokeWidth={1.5} />
              <h3>Préstamos y Devoluciones por Mes</h3>
            </div>
            {prestamosPorMes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={prestamosPorMes} barGap={8}>
                  <defs>
                    <linearGradient id="barGradientPrestamos" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#60a5fa" />
                      <stop offset="100%" stopColor="#3b82f6" />
                    </linearGradient>
                    <linearGradient id="barGradientDevoluciones" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#34d399" />
                      <stop offset="100%" stopColor="#10b981" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                  <XAxis
                    dataKey="mes"
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={{ stroke: '#4b5563' }}
                    tickLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip
                    cursor={{ fill: 'transparent' }}
                    contentStyle={{
                      backgroundColor: 'rgba(20, 20, 25, 0.95)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      borderRadius: '8px',
                      padding: '8px 12px',
                      boxShadow: '0 8px 16px rgba(0, 0, 0, 0.4)'
                    }}
                    labelStyle={{ color: '#f3f4f6', fontWeight: '600', marginBottom: '4px', fontSize: '0.9rem' }}
                    itemStyle={{ color: '#9ca3af', fontSize: '0.85rem', padding: '2px 0' }}
                    formatter={(value, name) => [
                      <span style={{ color: '#f3f4f6', fontWeight: 'bold' }}>{value}</span>,
                      name
                    ]}
                  />
                  <Legend
                    wrapperStyle={{ paddingTop: '20px', color: '#e5e7eb' }}
                    iconType="circle"
                  />
                  <Bar
                    dataKey="prestamos"
                    name="Préstamos"
                    fill="url(#barGradientPrestamos)"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                  <Bar
                    dataKey="devoluciones"
                    name="Devoluciones"
                    fill="url(#barGradientDevoluciones)"
                    radius={[6, 6, 0, 0]}
                    barSize={32}
                  />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#9ca3af' }}>
                <p>No hay datos de préstamos para mostrar</p>
              </div>
            )}
          </div>

          {/* Gráfico de libros por categoría */}
          <div className="chart-card">
            <div className="chart-header">
              <PieChartIcon size={18} strokeWidth={1.5} />
              <h3>Distribución de Libros por Categoría</h3>
            </div>
            {librosPorCategoria.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={librosPorCategoria}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {librosPorCategoria.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} stroke="rgba(0,0,0,0.5)" strokeWidth={1} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '8px',
                      color: '#f3f4f6',
                      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)',
                      padding: '12px'
                    }}
                    itemStyle={{ color: '#e5e7eb' }}
                    formatter={(value, name) => [`${value} libros`, name]}
                  />
                  <Legend
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    iconType="circle"
                    wrapperStyle={{ fontSize: '0.85rem', color: '#e5e7eb' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#9ca3af' }}>
                <p>No hay libros registrados</p>
              </div>
            )}
          </div>

          {/* Gráfico de socios activos */}
          <div className="chart-card">
            <div className="chart-header">
              <TrendingUp size={18} strokeWidth={1.5} />
              <h3>Evolución de Socios Activos</h3>
            </div>
            {sociosActivos.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={sociosActivos}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="mes" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#23272b',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Area
                    type="monotone"
                    dataKey="activos"
                    stroke="#8b5cf6"
                    fill="#8b5cf6"
                    fillOpacity={0.3}
                  />
                </AreaChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#9ca3af' }}>
                <p>No hay datos de socios para mostrar</p>
              </div>
            )}
          </div>

          {/* Gráfico de tendencia de préstamos */}
          <div className="chart-card">
            <div className="chart-header">
              <Activity size={18} strokeWidth={1.5} />
              <h3>Tendencia de Préstamos</h3>
            </div>
            {prestamosPorMes.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={prestamosPorMes}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="mes" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#23272b',
                      border: '1px solid #333',
                      borderRadius: '8px',
                      color: 'white'
                    }}
                  />
                  <Legend wrapperStyle={{ color: '#e5e7eb' }} />
                  <Line
                    type="monotone"
                    dataKey="prestamos"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    dot={{ fill: '#3b82f6', strokeWidth: 2, r: 5 }}
                    activeDot={{ r: 8, stroke: '#3b82f6', strokeWidth: 2, fill: '#fff' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '300px', color: '#9ca3af' }}>
                <p>No hay datos de préstamos para mostrar</p>
              </div>
            )}
          </div>
        </section>

        {/* Sección de alertas y notificaciones */}
        <section className="alerts-section">
          <h3>Alertas y Notificaciones</h3>
          <div className="alerts-grid">
            <div className="alert-card warning">
              <AlertTriangle size={18} strokeWidth={1.5} />
              <div>
                <h4>Préstamos Vencidos</h4>
                <p>{stats.prestamosVencidos} préstamos requieren atención inmediata</p>
              </div>
            </div>
            <div className="alert-card info">
              <Clock size={18} strokeWidth={1.5} />
              <div>
                <h4>Próximos a Vencer</h4>
                <p>{prestamosProximosAVencer} préstamos vencen en los próximos 3 días</p>
              </div>
            </div>
            <div className="alert-card success">
              <CheckCircle size={18} strokeWidth={1.5} />
              <div>
                <h4>Devoluciones Exitosas</h4>
                <p>{stats.prestamosCompletados} préstamos completados este mes</p>
              </div>
            </div>
          </div>
        </section>
      </div>

    </>
  );
} 