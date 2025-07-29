import { Link } from 'react-router-dom';
import './welcome.css';

export default function Navbar() {
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
      </ul>
    </header>
  );
} 