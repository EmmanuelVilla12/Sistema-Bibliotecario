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

  // 🔥 USAR DB
  db.all("SELECT * FROM Libros", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    const filtered = rows.filter(l => {
      return (
        (nombre == null || l.nombre?.toLowerCase().includes(nombre.toLowerCase())) &&
        (fecha_publicacion == null || l.fecha_publicacion == parseInt(fecha_publicacion)) &&
        (stock == null || l.stock == parseInt(stock)) &&
        (id_autor == null || l.id_autor == parseInt(id_autor))
      );
    });

    res.json({ success: true, data: filtered });
  });
});


// GET -BUSCAR LIBRO POR ID 
Routes.get('/libros/:id', (req, res) => {
  const id = parseInt(req.params.id);

  db.get("SELECT * FROM Libros WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (!row) { // 🔥 CORRECCIÓN (antes decía libros)
      return res.status(404).json({ success: false, message: 'Libro no encontrado' });
    }

    res.json({ success: true, data: row });
  });
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

// PUT - Actualizar libro por ID
Routes.put('/libros/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { id_autor, nombre, fecha_publicacion, stock } = req.body;

  // 🔥 USAR DB
  db.run(
    `UPDATE Libros 
     SET id_autor = ?, nombre = ?, fecha_publicacion = ?, stock = ?
     WHERE id = ?`,
    [id_autor, nombre, fecha_publicacion, stock, id],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: 'Libro no encontrado' });
      }

      res.json({ success: true });
    }
  );
});

// DELETE - Eliminar libro por ID
Routes.delete('/libros/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // 🔥 BORRAR EN DB
  db.run("DELETE FROM Libros WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'libro no encontrado' });
    }

    res.json({ success: true });
  });
});

module.exports = Routes;