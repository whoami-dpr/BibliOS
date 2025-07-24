import React, { useState } from 'react';
import './prestamos.css';
import Navbar from './Navbar.jsx';

const prestamosMock = [
  { id: 1, libro: 'Cien años de soledad', socio: 'Juan Pérez', fechaPrestamo: '2024-06-01', fechaDevolucion: '2024-06-15', estado: 'Activo' },
  { id: 2, libro: 'El Principito', socio: 'Ana Gómez', fechaPrestamo: '2024-06-03', fechaDevolucion: '2024-06-17', estado: 'Devuelto' },
];

export default function Prestamos() {
  const [prestamos, setPrestamos] = useState(prestamosMock);
  const [showForm, setShowForm] = useState(false);
  const [nuevo, setNuevo] = useState({ libro: '', socio: '', fechaPrestamo: '', fechaDevolucion: '' });

  const handleChange = e => setNuevo({ ...nuevo, [e.target.name]: e.target.value });

  const handleAdd = e => {
    e.preventDefault();
    setPrestamos([
      ...prestamos,
      { ...nuevo, id: prestamos.length + 1, estado: 'Activo' },
    ]);
    setShowForm(false);
    setNuevo({ libro: '', socio: '', fechaPrestamo: '', fechaDevolucion: '' });
  };

  return (
    <>
      <Navbar />
      <div className="prestamos-container">
        <h2>Gestión de Préstamos</h2>
        <button onClick={() => setShowForm(!showForm)}>
          {showForm ? 'Cancelar' : 'Agregar Préstamo'}
        </button>
        {showForm && (
          <form className="prestamo-form" onSubmit={handleAdd}>
            <input name="libro" placeholder="Libro" value={nuevo.libro} onChange={handleChange} required />
            <input name="socio" placeholder="Socio" value={nuevo.socio} onChange={handleChange} required />
            <input name="fechaPrestamo" type="date" value={nuevo.fechaPrestamo} onChange={handleChange} required />
            <input name="fechaDevolucion" type="date" value={nuevo.fechaDevolucion} onChange={handleChange} required />
            <button type="submit">Guardar</button>
          </form>
        )}
        <table className="prestamos-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Libro</th>
              <th>Socio</th>
              <th>Fecha Préstamo</th>
              <th>Fecha Devolución</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {prestamos.map(p => (
              <tr key={p.id}>
                <td>{p.id}</td>
                <td>{p.libro}</td>
                <td>{p.socio}</td>
                <td>{p.fechaPrestamo}</td>
                <td>{p.fechaDevolucion}</td>
                <td>{p.estado}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
} 