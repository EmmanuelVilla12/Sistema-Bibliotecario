const express = require('express');
const Routes = express.Router();

const libros = [
  { id: 1, nombre: "Cien años de soledad", fecha_Publicacion:1967, stock:5 },
  { id: 2, nombre: "Tiempo recios", fecha_Publicacion:2019, stock:4 },
  { id: 3, nombre: "La casa  de los espiritus", fecha_Publicacion:1982, stock:2 },
  { id: 4, nombre: "La divina comedia", fecha_Publicacion:1321, stock:9 },
  { id: 5, nombre: "Memento Mori", fecha_Publicacion:2014, stock: 0},
];

//GET TODOS LOS LIBROS MAS FILTRO QUERY
Routes.get('/libros', (req, res) => {
const { nombre, fecha_Publicacion, stock } = req.query;

  const filtered = libros.filter(l => {
    return (
      (nombre == null || l.nombre?.toLowerCase().includes(nombre.toLowerCase())) &&
      (fecha_Publicacion == null || l.fecha_Publicacion===parseInt(fecha_Publicacion))&&
      (stock == null || l.stock===parseInt(stock))
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
  const { nombre, fecha_Publicacion, stock } = req.body;
  const nuevo = { id: libros.length + 1, nombre, fecha_Publicacion, stock };
  libros.push(nuevo);
  res.status(201).json({ success: true, data: nuevo });
});


// PUT - Actualizar un usuario por ID
Routes.put('/libros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, fecha_Publicacion, stock } = req.body;

  const libro = libros.find(l => l.id === id);

  if (!libro) {
    return res.status(404).json({ success: false, message: 'Libro no encontrado' });
  }

  // Actualizamos solo si vienen datos
    if (nombre) libro.nombre = nombre;
    if (fecha_Publicacion) libro.fecha_Publicacion = fecha_Publicacion;
    if (stock) libro.stock = stock;


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