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
        <li><a href="#">Socios</a></li>
        <li><a href="#">Libros</a></li>
      </ul>
    </header>
  );
} 