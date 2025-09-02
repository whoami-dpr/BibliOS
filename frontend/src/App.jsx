import './App.css';
import './welcome.css';
import libro from './assets/libro.png';
import { Link } from 'react-router-dom';
import Navbar from './Navbar.jsx';
import { useEffect } from 'react';

function App() {
  useEffect(() => {
    document.body.classList.add('home-page-active');
    return () => { document.body.classList.remove('home-page-active'); };
  }, []);

  return (
    <div className="home-page">
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
    </div>
  );
}

export default App;
