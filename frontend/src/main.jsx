import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { initTheme } from './theme';
import './index.css';
import './dashboard.css';
import './socios.css';
import './libros.css';
import './prestamos.css';
import './register.css';
// Importar al final para que tenga mayor precedencia sobre estilos de páginas
import './theme-overrides.css';
import App from './App.jsx';
import Register from './Register.jsx';
import Prestamos from './Prestamos.jsx';
import Dashboard from './Dashboard.jsx';
import Socios from './Socios.jsx';
import Libros from './Libros.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Aplicar tema antes de montar React
initTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/prestamos" element={<Prestamos />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/socios" element={<Socios />} />
        <Route path="/libros" element={<Libros />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
