import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LogIn } from 'lucide-react';
import './welcome.css';
import { useAuth } from './hooks/useAuth.js';
import { useLibrary } from './hooks/useLibrary.js';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { libraries } = useLibrary();
  
  const handleLogout = () => {
    if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      logout();
      navigate('/');
    }
  };

  const handleLogin = () => {
    // Si hay bibliotecas disponibles, redirigir a selección
    if (libraries.length > 0) {
      navigate('/login');
    } else {
      // Si no hay bibliotecas, redirigir a registro
      navigate('/registro');
    }
  };

  // Páginas que requieren navbar simple (sin autenticación)
  const isSimplePage = location.pathname === '/' || 
                       location.pathname === '/login' || 
                       location.pathname === '/registro';
  
  if (isSimplePage) {
    return (
      <header>
        <Link to="/" className="logo">
          <span className="logo-text">BibliOS</span>
        </Link>
        <ul className="nav">
          <li><Link to="/registro">Registrar Biblioteca</Link></li>
          <li>
            <button 
              onClick={handleLogin}
              className="login-btn"
              title="Iniciar sesión"
            >
              <LogIn size={16} />
              Iniciar Sesión
            </button>
          </li>
        </ul>
      </header>
    );
  }

  // Navbar completo solo para páginas autenticadas
  return (
    <header>
      <Link to="/" className="logo">
        <span className="logo-text">BibliOS</span>
      </Link>
      <ul className="nav">
        <li><Link to="/dashboard">Dashboard</Link></li>
        <li><Link to="/prestamos">Prestamos</Link></li>
        <li><Link to="/socios">Socios</Link></li>
        <li><Link to="/libros">Libros</Link></li>
        {isAuthenticated ? (
          <li>
            <button 
              onClick={handleLogout}
              className="logout-btn"
              title="Cerrar sesión"
            >
              <LogOut size={16} />
              Cerrar Sesión
            </button>
          </li>
        ) : (
          <li>
            <button 
              onClick={handleLogin}
              className="login-btn"
              title="Iniciar sesión"
            >
              <LogIn size={16} />
              Iniciar Sesión
            </button>
          </li>
        )}
      </ul>
    </header>
  );
} 