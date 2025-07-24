import './register.css';
import logo2 from './assets/BibliOS_Logo2.png';
import Navbar from './Navbar.jsx';

function Register() {
  return (
    <>
      <Navbar />
      <main>
        <section className="form-container">
          <h2>Registro de Biblioteca</h2>
          <form /* action="/ruta-de-registro" method="POST" */>
            <label htmlFor="nombre">Nombre de la biblioteca:</label>
            <input type="text" id="nombre" name="nombre" required />

            <label htmlFor="direccion">Dirección:</label>
            <input type="text" id="direccion" name="direccion" required />

            <button type="submit">Registrar Biblioteca</button>
          </form>
        </section>
      </main>
    </>
  );
}

export default Register; 