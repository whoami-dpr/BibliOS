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
    "Trabajamos para nosotros",
    "El conocimiento es poder",
    "Los libros cambian vidas",
    "El aprendizaje nunca termina",
    "La educación es libertad",
    "Lee, aprende, crece",
    "El conocimiento compartido se multiplica",
    "Cada libro es un viaje",
    "Las bibliotecas son el futuro",
    "La lectura abre mentes"
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

  // Limpiar formulario al cargar la página
  useEffect(() => {
    setLibraryName('');
    setPassword('');
    setError('');
    setIsLoading(false);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // Verificar si estamos en Electron
      if (window.electronAPI) {
        // Usar la base de datos SQLite
        const bibliotecas = await window.electronAPI.getBibliotecas();
        
        // Buscar la biblioteca por nombre
        const biblioteca = bibliotecas.find(bib => 
          bib.nombre.toLowerCase().includes(libraryName.toLowerCase())
        );
        
        if (biblioteca) {
          // Activar la biblioteca encontrada
          await window.electronAPI.activateBiblioteca(biblioteca.id);
          
          // Guardar en localStorage para compatibilidad con el sistema de auth
          localStorage.setItem('bibliotecaActiva', JSON.stringify(biblioteca));
          localStorage.setItem('authData', JSON.stringify({
            libraryId: biblioteca.id,
            authMethod: 'password',
            hashedValue: '123456789', // Por ahora usar un hash simple
            salt: 'mock-salt-1',
            createdAt: new Date().toISOString()
          }));
          
          // Redirigir al dashboard
          navigate('/dashboard');
        } else {
          setError('Biblioteca no encontrada. Verifica el nombre o crea una nueva biblioteca.');
        }
      } else {
        // Fallback para desarrollo sin Electron
        if (libraryName.toLowerCase().includes('utn') && password === 'UTN') {
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
          
          localStorage.setItem('bibliotecaActiva', JSON.stringify(mockLibrary));
          localStorage.setItem('authData', JSON.stringify({
            libraryId: 'mock-library-1',
            authMethod: 'password',
            hashedValue: '123456789',
            salt: 'mock-salt-1',
            createdAt: '2024-01-15T10:00:00.000Z'
          }));
          
          navigate('/dashboard');
        } else {
          setError('Credenciales incorrectas. Usa "UTN-FRLP" y "UTN"');
        }
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
            
            {window.electronAPI && (
              <div style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid #e5e7eb' }}>
                <p style={{ marginBottom: '10px', fontSize: '14px', color: '#6b7280' }}>
                  ¿Quieres probar con datos de muestra?
                </p>
                <button 
                  className="register-link-btn"
                  style={{ backgroundColor: '#3b82f6', color: 'white' }}
                  onClick={async () => {
                    try {
                      setIsLoading(true);
                      setError('');
                      const result = await window.electronAPI.createUTNLibrary();
                      
                      if (result.exists) {
                        setError('La biblioteca UTN-FRLP ya existe. Usa "UTN-FRLP" como nombre y "UTN" como contraseña.');
                      } else {
                        // Activar la biblioteca creada
                        await window.electronAPI.activateBiblioteca(result.biblioteca.id);
                        localStorage.setItem('bibliotecaActiva', JSON.stringify(result.biblioteca));
                        localStorage.setItem('authData', JSON.stringify({
                          libraryId: result.biblioteca.id,
                          authMethod: 'password',
                          hashedValue: '123456789',
                          salt: 'mock-salt-1',
                          createdAt: new Date().toISOString()
                        }));
                        navigate('/dashboard');
                      }
                    } catch (error) {
                      console.error('Error creating UTN library:', error);
                      setError('Error al crear la biblioteca de muestra: ' + error.message);
                    } finally {
                      setIsLoading(false);
                    }
                  }}
                  disabled={isLoading}
                >
                  <Library size={16} />
                  Crear Biblioteca de Muestra UTN-FRLP
                </button>
              </div>
            )}
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
