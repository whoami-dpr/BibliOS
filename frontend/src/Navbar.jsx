import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LogIn, Menu, X } from 'lucide-react';
import './welcome.css';
import { useAuth } from './hooks/useAuth.js';
import { useLibrary } from './hooks/useLibrary.js';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { libraries } = useLibrary();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
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

  const toggleMenu = () => setIsMenuOpen((prev) => !prev);
  const closeMenu = () => setIsMenuOpen(false);

  // Páginas que requieren navbar simple (sin autenticación)
  const isSimplePage = location.pathname === '/' || 
                       location.pathname === '/login' || 
                       location.pathname === '/registro';
  
  if (isSimplePage) {
    return (
      <header>
        <Link to="/" className="logo" onClick={closeMenu}>
          <span className="logo-text">BibliOS</span>
        </Link>
        <button 
          className="menu-toggle"
          aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
          aria-expanded={isMenuOpen}
          onClick={toggleMenu}
        >
          {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
        <ul className={`nav ${isMenuOpen ? 'open' : ''}`}>
          <li><Link to="/registro" onClick={closeMenu}>Registrar Biblioteca</Link></li>
          <li>
            <button 
              onClick={() => { closeMenu(); handleLogin(); }}
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
      <Link to="/" className="logo" onClick={closeMenu}>
        <span className="logo-text">BibliOS</span>
      </Link>
      <button 
        className="menu-toggle"
        aria-label={isMenuOpen ? 'Cerrar menú' : 'Abrir menú'}
        aria-expanded={isMenuOpen}
        onClick={toggleMenu}
      >
        {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
      </button>
      <ul className={`nav ${isMenuOpen ? 'open' : ''}`}>
        <li><Link to="/dashboard" onClick={closeMenu}>Dashboard</Link></li>
        <li><Link to="/prestamos" onClick={closeMenu}>Prestamos</Link></li>
        <li><Link to="/socios" onClick={closeMenu}>Socios</Link></li>
        <li><Link to="/libros" onClick={closeMenu}>Libros</Link></li>
        {isAuthenticated ? (
          <li>
            <button 
              onClick={() => { closeMenu(); handleLogout(); }}
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
              onClick={() => { closeMenu(); handleLogin(); }}
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