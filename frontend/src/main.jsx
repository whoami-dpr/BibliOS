import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import Register from './Register.jsx';
import Prestamos from './Prestamos.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/registro" element={<Register />} />
        <Route path="/prestamos" element={<Prestamos />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
