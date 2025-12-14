import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LogOut, LogIn, Menu, X, Sun, Moon } from 'lucide-react';
import './welcome.css';
import { useAuth } from './hooks/useAuth.js';
import { useLibrary } from './hooks/useLibrary.js';
import { useTheme } from './hooks/useTheme.js';
import { useState } from 'react';

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout } = useAuth();
  const { libraries } = useLibrary();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
        // Cerrar menú móvil si está abierto
        closeMenu();

        // Limpiar datos de sesión
        localStorage.removeItem('bibliotecaActiva');
        localStorage.removeItem('authData');

        // Ejecutar logout del hook
        logout();

        // Navegar inmediatamente
        navigate('/');

        // Opcional: Asegurar foco después del logout
        await window.nativeDialog.ensureFocus();
      }
    } catch (error) {
      console.error('Error en confirmación de logout:', error);
      // Fallback al confirm nativo si hay error
      if (confirm('¿Estás seguro de que quieres cerrar sesión?')) {
        closeMenu();
        localStorage.removeItem('bibliotecaActiva');
        localStorage.removeItem('authData');
        logout();
        navigate('/');
      }
    }
  };

  const handleLogin = () => {
    // Siempre redirigir a login
    // El usuario puede registrar una nueva biblioteca desde allí si lo necesita
    navigate('/login');
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
              onClick={toggleTheme}
              className="theme-toggle-btn"
              title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
            >
              {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            </button>
          </li>
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
      <Link to="/dashboard" className="logo" onClick={closeMenu}>
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
        <li>
          <button
            onClick={toggleTheme}
            className="theme-toggle-btn"
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
        </li>
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