import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area, ComposedChart
} from 'recharts';
import { 
  BookOpen, Users, CalendarDays, TrendingUp, Clock, AlertTriangle,
  CheckCircle, X, Activity, Library, BarChart3, PieChart as PieChartIcon
} from 'lucide-react';
import Navbar from './Navbar.jsx';
import './dashboard.css';
import { useLibrary } from './hooks/useLibrary.js';

export default function Dashboard() {
  const navigate = useNavigate();
  const { activeLibrary, hasActiveLibrary, getLibraryStats, loading } = useLibrary();
  const [stats, setStats] = useState({
    totalLibros: 0,
    totalSocios: 0,
    prestamosActivos: 0,
    prestamosVencidos: 0,
    prestamosCompletados: 0
  });

  // Datos de ejemplo para los gráficos
  const prestamosPorMes = [
    { mes: 'Ene', prestamos: 45, devoluciones: 42 },
    { mes: 'Feb', prestamos: 52, devoluciones: 48 },
    { mes: 'Mar', prestamos: 38, devoluciones: 35 },
    { mes: 'Abr', prestamos: 61, devoluciones: 58 },
    { mes: 'May', prestamos: 55, devoluciones: 52 },
    { mes: 'Jun', prestamos: 48, devoluciones: 45 }
  ];

  const librosPorCategoria = [
    { name: 'Ficción', value: 35, color: '#8884d8' },
    { name: 'No Ficción', value: 25, color: '#82ca9d' },
    { name: 'Ciencia', value: 20, color: '#ffc658' },
    { name: 'Historia', value: 15, color: '#ff7300' },
    { name: 'Otros', value: 5, color: '#8dd1e1' }
  ];

  const sociosActivos = [
    { mes: 'Ene', activos: 120 },
    { mes: 'Feb', activos: 135 },
    { mes: 'Mar', activos: 142 },
    { mes: 'Abr', activos: 158 },
    { mes: 'May', activos: 165 },
    { mes: 'Jun', activos: 172 }
  ];

  useEffect(() => {
    // Esperar a que termine de cargar antes de verificar
    if (loading) return;

    // TEMPORALMENTE COMENTADO: Verificar si hay una biblioteca activa
    // if (!hasActiveLibrary()) {
    //   navigate('/registro');
    //   return;
    // }

    // Cargar estadísticas de la biblioteca activa
    const libraryStats = getLibraryStats();
    if (libraryStats) {
      setStats(libraryStats);
    }
  }, [loading, hasActiveLibrary, getLibraryStats, navigate]);

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

  // Mostrar loading mientras se verifica la biblioteca activa
  if (loading) {
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
            change={12}
          />
          <StatCard 
            icon={Users} 
            title="Socios Registrados" 
            value={stats.totalSocios} 
            color="#10b981"
            change={8}
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
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={prestamosPorMes}>
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
                <Legend />
                <Bar dataKey="prestamos" fill="#3b82f6" name="Préstamos" radius={[4, 4, 0, 0]} />
                <Bar dataKey="devoluciones" fill="#10b981" name="Devoluciones" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de libros por categoría */}
                           <div className="chart-card">
                   <div className="chart-header">
                     <PieChartIcon size={18} strokeWidth={1.5} />
                     <h3>Distribución de Libros por Categoría</h3>
                   </div>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={librosPorCategoria}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {librosPorCategoria.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#23272b', 
                    border: '1px solid #333',
                    borderRadius: '8px',
                    color: 'white'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Gráfico de socios activos */}
                           <div className="chart-card">
                   <div className="chart-header">
                     <TrendingUp size={18} strokeWidth={1.5} />
                     <h3>Evolución de Socios Activos</h3>
                   </div>
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
          </div>

          {/* Gráfico de tendencia de préstamos */}
                           <div className="chart-card">
                   <div className="chart-header">
                     <Activity size={18} strokeWidth={1.5} />
                     <h3>Tendencia de Préstamos</h3>
                   </div>
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
                <Legend />
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
                       <p>15 préstamos vencen en los próximos 3 días</p>
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