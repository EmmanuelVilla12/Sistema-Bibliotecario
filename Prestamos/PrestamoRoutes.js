const express = require('express');
const Routes = express.Router();
const db = require('../db')

const prestamos = [
  { id: 1, id_empleado: 2, id_usuario:1, id_libro: 1, fecha_prestamo:"21-09-2014" },
  { id: 2, id_empleado: 2, id_usuario:2, id_libro: 5, fecha_prestamo:"2-10-2014" },
  { id: 3, id_empleado: 2, id_usuario:3, id_libro: 1, fecha_prestamo:"30-11-2014" },
];

//GET- MOSTRAR TODOS LOS PRESTAMOS CON FILTRO 
Routes.get('/prestamos', (req, res) => {
  const filtros = req.query;

db.all("SELECT * FROM Prestamos", [], (err, rows) => {
  if (err) {
    return res.status(500).json({ success: false, message: err.message });
  }

  let filtered = rows.filter((row) => {
    return Object.entries(filtros).every(([key, value]) => {
      if (!value) return true;

      const campo = row[key];

      return (
        campo &&
        campo.toString().toLowerCase().includes(value.toLowerCase())
      );
    });
  });

  res.json({ success: true, data: filtered });
});
});

//GET- VER PRESTAMOS POR ID
Routes.get('/prestamos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  db.get("SELECT * FROM Prestamos WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (!row) {
      return res.status(404).json({ success: false, message: 'Prestamo no existente' });
    }

    res.json({ success: true, data: row });
  });
});

//POST- AGREGAR UN PRESTAMO
Routes.post('/prestamos', (req, res) => {
  const { id_empleado, id_usuario, id_libro, fecha_prestamo } = req.body;

  if (!id_empleado || !id_usuario || !id_libro || !fecha_prestamo) {
    return res.status(400).json({
      success: false,
      message: 'id_empleado, id_usuario, id_libro y fecha_prestamo son obligatorios'
    });
  }

  db.run(
    'INSERT INTO Prestamos (id_empleado, id_usuario, id_libro, fecha_prestamo) VALUES (?, ?, ?, ?)',
    [id_empleado, id_usuario, id_libro, fecha_prestamo],
    function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });

      res.status(201).json({
        success: true,
        data: { id: this.lastID, id_empleado, id_usuario, id_libro, fecha_prestamo }
      });
    }
  );
});

// PUT - ACTUALIZAR PRESTAMO POR ID 
Routes.put('/prestamos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { id_empleado, id_usuario, id_libro, fecha_prestamo } = req.body;

  // 🔥 ACTUALIZAR EN DB
  db.run(
    `UPDATE Prestamos 
     SET id_empleado = ?, id_usuario = ?, id_libro = ?, fecha_prestamo = ?
     WHERE id = ?`,
    [id_empleado, id_usuario, id_libro, fecha_prestamo, id],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: 'Prestamo no encontrado' });
      }

      res.json({ success: true });
    }
  );
});

// DELETE - Eliminar prestamo por ID
Routes.delete('/prestamos/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // 🔥 BORRAR EN DB
  db.run("DELETE FROM Prestamos WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Registro no encontrado' });
    }

    res.json({ success: true });
  });
});

module.exports = Routes;