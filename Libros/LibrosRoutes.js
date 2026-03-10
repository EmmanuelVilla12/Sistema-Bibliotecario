const express = require('express');
const Routes = express.Router();
const db = require('../db')

const libros = [
  { id: 1, id_autor: 1, nombre: "Cien años de soledad", fecha_publicacion:1967, stock:5 },
  { id: 2, id_autor: 2, nombre: "Tiempo recios", fecha_publicacion:2019, stock:4 },
  { id: 3, id_autor: 3, nombre: "La casa  de los espiritus", fecha_publicacion:1982, stock:2 },
  { id: 4, id_autor: 4, nombre: "La divina comedia", fecha_publicacion:1321, stock:9 },
  { id: 5, id_autor: 5, nombre: "Memento Mori", fecha_publicacion:2014, stock: 0},
];

//GET TODOS LOS LIBROS MAS FILTRO QUERY
Routes.get('/libros', (req, res) => {
const { id_autor, nombre, fecha_publicacion, stock } = req.query;

  const filtered = libros.filter(l => {
    return (
      (nombre == null || l.nombre?.toLowerCase().includes(nombre.toLowerCase())) &&
      (fecha_publicacion == null || l.fecha_publicacion===parseInt(fecha_publicacion))&&
      (stock == null || l.stock===parseInt(stock))&&
      (id_autor == null || l.id_autor===parseInt(id_autor))
    );
  });

  res.json({ success: true, data: filtered });
});


// GET -BUSCAR LIBRO POR ID 
Routes.get('/libros/:id', (req, res) => {
  const libro = libros.find(l => l.id === parseInt(req.params.id));
  if (!libros) 
    return res.status(404).json({ success: false, message: 'Libro no encontrado' });
  
  res.json({ success: true, data: libro });
});


//POST- AGREGAR LIBRO
Routes.post('/libros', (req, res) => {
  const { id_autor, nombre, fecha_publicacion, stock } = req.body;

  if (!id_autor || !nombre || !fecha_publicacion || !stock) {
    return res.status(400).json({
      success: false,
      message: 'id_autor, nombre, fecha_publicacion y stock son obligatorios'
    });
  }

  db.run(
    'INSERT INTO Libros (id_autor, nombre, fecha_publicacion, stock) VALUES (?, ?, ?, ?)',
    [id_autor, nombre, fecha_publicacion, stock],
    function(err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      res.status(201).json({
        success: true,
        data: { id: this.lastID, id_autor, nombre, fecha_publicacion, stock }
      });
    }
  );
});

// PUT - Actualizar un usuario por ID
Routes.put('/libros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { id_autor, nombre, fecha_publicacion, stock } = req.body;

  const libro = libros.find(l => l.id === id);

  if (!libro) {
    return res.status(404).json({ success: false, message: 'Libro no encontrado' });
  }

  // Actualizamos solo si vienen datos
    if (nombre) libro.nombre = nombre;
    if (fecha_publicacion) libro.fecha_publicacion = fecha_publicacion;
    if (stock) libro.stock = stock;
    if (id_autor) libro.id_autor = id_autor


  res.json({ success: true, data: libro });
});

// DELETE - Eliminar libro por ID
Routes.delete('/libros/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = libros.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'libro no encontrado' });
  }

  const eliminado = libros.splice(index, 1);

  res.json({ success: true, data: eliminado[0] });
});


module.exports = Routes;