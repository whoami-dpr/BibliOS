import './App.css';
import './welcome.css'; // Crearemos este archivo con los estilos migrados
import logo2 from './assets/BibliOS_Logo2.png';
import libro from './assets/libro.png';
import { Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';

function App() {
  return (
    <>
      <Navbar />
      <main className="hero">
        <div className="hero-text">
          <span className="tagline">SISTEMA BIBLIOTECARIO</span>
          <h1 className="hero-title">BibliOS</h1>
          <p className="hero-description">
            Este es un proyecto universitario desarrollado para la facultad de ingenieria UTNFRLP
          </p>
          <div className="cta-group">
            <Link className="primary-btn" to="/registro">Registrar Biblioteca Gratis</Link>
          </div>
        </div>
        <div className="hero-img">
          <img src={libro} alt="Libro" className="float" />
        </div>
      </main>
    </>
  );
}

export default App;
