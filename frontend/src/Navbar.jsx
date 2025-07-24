import { Link } from 'react-router-dom';
import logo2 from './assets/BibliOS_Logo2.png';
import './welcome.css';

export default function Navbar() {
  return (
    <header>
      <Link to="/" className="logo">
        <img src={logo2} alt="Logo Biblios" />
      </Link>
      <ul className="nav">
        <li><Link to="/prestamos">Prestamos</Link></li>
        <li><a href="#">Socios</a></li>
        <li><a href="#">Libros</a></li>
      </ul>
    </header>
  );
} 