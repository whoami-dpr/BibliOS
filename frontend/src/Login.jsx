import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, LogIn, X, AlertCircle, Lock, Eye, EyeOff } from 'lucide-react';
import './Login.css';
import Navbar from './Navbar.jsx';

function Login() {
  const navigate = useNavigate();
  const [libraryName, setLibraryName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentText, setCurrentText] = useState(0);
  const [isChanging, setIsChanging] = useState(false);

  const inspirationTexts = [
    "We work for us",
    "Knowledge is power",
    "Books change lives",
    "Learning never ends",
    "Education is freedom",
    "Read, learn, grow",
    "Knowledge shared is knowledge multiplied",
    "Every book is a journey",
    "Libraries are the future",
    "Reading opens minds"
  ];

  // Efecto para cambiar el texto cada 3 segundos con transición
  useEffect(() => {
    const interval = setInterval(() => {
      setIsChanging(true);
      
      setTimeout(() => {
        setCurrentText((prev) => (prev + 1) % inspirationTexts.length);
        setIsChanging(false);
      }, 300); // Mitad de la duración de la transición
    }, 3000);

    return () => clearInterval(interval);
  }, [inspirationTexts.length]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Validación simple
      if (libraryName.toLowerCase().includes('utn') && password === 'UTN') {
        // Simular autenticación exitosa
        const mockLibrary = {
          id: 'mock-library-1',
          nombre: 'UTN-FRLP',
          direccion: 'Av. Universidad 123, Villa María',
          telefono: '(353) 123-4567',
          email: 'biblioteca@utn.edu.ar',
          responsable: 'Dr. María González',
          horarios: 'Lunes a Viernes 8:00 - 18:00',
          descripcion: 'Biblioteca principal de la Universidad Tecnológica Nacional',
          fechaCreacion: '2024-01-15T10:00:00.000Z',
          activa: true
        };
        
        // Guardar en localStorage
        localStorage.setItem('bibliotecaActiva', JSON.stringify(mockLibrary));
        localStorage.setItem('authData', JSON.stringify({
          libraryId: 'mock-library-1',
          authMethod: 'password',
          hashedValue: '123456789',
          salt: 'mock-salt-1',
          createdAt: '2024-01-15T10:00:00.000Z'
        }));
        
        // Redirigir al dashboard
        navigate('/dashboard');
      } else {
        setError('Credenciales incorrectas. Usa "UTN-FRLP" y "UTN"');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('Error durante la autenticación');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="full-width-page">
      <Navbar />
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-form-section">
            <div className="login-content">
          <div className="login-header">
            <button 
              className="back-button" 
              onClick={() => navigate('/')}
            >
              <X size={20} />
            </button>
            <div className="header-content">
              <h1>Iniciar Sesión</h1>
              <span className="header-separator">|</span>
              <p>Ingresa el nombre de la biblioteca y tu contraseña</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="libraryName" className="form-label">
                <Library size={16} />
                Nombre de la Biblioteca
              </label>
              <input
                id="libraryName"
                type="text"
                value={libraryName}
                onChange={(e) => setLibraryName(e.target.value)}
                                        placeholder="Ej: UTN-FRLP"
                className="form-input"
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                <Lock size={16} />
                Contraseña
              </label>
              <div className="password-input-wrapper">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Ingresa tu contraseña"
                  className="form-input"
                  required
                  disabled={isLoading}
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <div className="login-error">
                <AlertCircle size={16} />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="submit" 
              className="login-submit-btn"
              disabled={isLoading || !libraryName.trim() || !password.trim()}
            >
              <LogIn size={16} />
              {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <div className="login-footer">
            <p>¿No tienes una biblioteca registrada?</p>
            <button 
              className="register-link-btn"
              onClick={() => navigate('/registro')}
            >
              <Library size={16} />
              Registrar Nueva Biblioteca
            </button>
          </div>

                            <div className="login-help">
                    <h4>🔑 Credenciales de Prueba</h4>
                    <p><strong>Biblioteca:</strong> UTN-FRLP</p>
                    <p><strong>Contraseña:</strong> UTN</p>
                  </div>
            </div>
          </div>
          
          <div className="login-inspiration-section">
            <div className="inspiration-content">
              <h1 className={`inspiration-text ${isChanging ? 'changing' : ''}`}>
                {inspirationTexts[currentText]}
              </h1>
              <p className={`inspiration-subtitle ${isChanging ? 'changing' : ''}`}>
                Transformando la gestión bibliotecaria
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
