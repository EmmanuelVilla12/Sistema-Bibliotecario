const express = require('express');
const Routes = express.Router();
const db = require('../db')

const prestamos = [
  { id: 1, id_usuario:1, id_libro: 1, fecha_prestamo:"21-09-2014" },
  { id: 2, id_usuario:2, id_libro: 5, fecha_prestamo:"2-10-2014" },
  { id: 3, id_usuario:3, id_libro: 1, fecha_prestamo:"30-11-2014" },
];

//GET- MOTRAR TODOS LOS PRESTAMOS CON FILTRO 
Routes.get('/prestamos', (req, res) => {
const { id_usuario, id_libro, fecha_prestamo } = req.query;

  const filtered = prestamos.filter(p => {
    return (
      (id_usuario == null || p.id_usuario?.toLowerCase().includes(id_usuario.toLowerCase())) &&
      (id_libro == null || p.id_libro?.toLowerCase().includes(id_libro.toLowerCase()))&&
      (fecha_prestamo == null || p.fecha_prestamo?.toLowerCase().includes(fecha_prestamo.toLowerCase()))
    );
  });

  res.json({ success: true, data: filtered });
});

//GET- VER PRESTAMOS POR ID
Routes.get('/prestamos/:id', (req, res) => {
  const prestamo = prestamos.find(p => p.id === parseInt(req.params.id));
  if (!prestamo) 
    return res.status(404).json({ success: false, message: 'Prestamo no existente' });
  
  res.json({ success: true, data: prestamo });
});

//POST- AGREGAR UN PRESTAMO
Routes.post('/prestamos', (req, res) => {
  const { id_usuario, id_libro, fecha_prestamo } = req.body;

  // Validación: campos obligatorios
  if (!id_usuario || !id_libro || !fecha_prestamo) {
    return res.status(400).json({
      success: false,
      message: 'id_usuario, id_libro y fecha_prestamo son obligatorios'
    });
  }


  db.run(
    'INSERT INTO Prestamos (id_usuario, id_libro, fecha_prestamo) VALUES (?, ?, ?)',
    [id_usuario, id_libro, fecha_prestamo],
    function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(201).json({ success: true, data: { id: this.lastID, id_usuario, id_libro, fecha_prestamo } });
    }
  );
});


// PUT - ACTUALIZAR PRESTAMO POR ID 
Routes.put('/prestamos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { id_usuario, id_libro, fecha_prestamo } = req.body;

  const prestamo = prestamos.find(p => p.id === id);

  if (!prestamo) {
    return res.status(404).json({ success: false, message: 'Prestamo no encontrado' });
  }

  // Actualizamos solo si vienen datos
    if (id_usuario) prestamo.id_usuario = id_usuario;
    if (id_libro) prestamo.id_libro = id_libro;
    if (fecha_prestamo) prestamo.fecha_prestamo = fecha_prestamo;


  res.json({ success: true, data: prestamo });
});

// DELETE - Eliminar libro por ID
Routes.delete('/prestamos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = prestamos.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'Registro no encontrado' });
  }

  const eliminado = prestamos.splice(index, 1);

  res.json({ success: true, data: eliminado[0] });
});


module.exports = Routes;