const express = require('express');
const Routes = express.Router();
const db = require('../db')

const autores = [
  { id: 1, nombre: "Gabriel García Márquez", nacionalidad: "Colombiana" },
  { id: 2, nombre: "Mario Vargas Llosa", nacionalidad: "Peruana" },
  { id: 3, nombre: "Isabel Allende", nacionalidad: "Chilena" },
  { id: 4, nombre: "Dante Alighieri", nacionalidad: "italiana" },
  { id: 5, nombre: "Yon Eley", nacionalidad: "Española" }
];


// GET - BUSCAR AUTOR POR ID 
Routes.get('/autores/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // 🔥 USAR DB
  db.get("SELECT * FROM Autores WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (!row) {
      return res.status(404).json({ success: false, message: 'Autor no encontrado' });
    }

    res.json({ success: true, data: row });
  });
});


//GET MUESTRA TODOS LOS AUTORES CON FILTRO
Routes.get('/autores', (req, res) => {
  const { nombre, nacionalidad } = req.query;

  // 🔥 USAR DB
  db.all("SELECT * FROM Autores", [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    const filtered = rows.filter(p => {
      return (
        (nombre == null || p.nombre?.toLowerCase().includes(nombre.toLowerCase())) &&
        (nacionalidad == null || p.nacionalidad?.toLowerCase().includes(nacionalidad.toLowerCase()))
      );
    });

    res.json({ success: true, data: filtered });
  });
});

//POST- CREAR AUTOR
Routes.post('/autores', (req, res) => {
  const { nombre, nacionalidad } = req.body;

  if (!nombre || !nacionalidad) {
    return res.status(400).json({
      success: false,
      message: 'nombre y nacionalidad son obligatorios'
    });
  }

  db.run(
    'INSERT INTO Autores (nombre, nacionalidad) VALUES (?, ?)',
    [nombre, nacionalidad],
    function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });

      res.status(201).json({
        success: true,
        data: { id: this.lastID, nombre, nacionalidad }
      });
    }
  );
});


// PUT - CAMBIAR AUTOR POR ID
Routes.put('/autores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, nacionalidad } = req.body;

  // 🔥 USAR DB
  db.run(
    `UPDATE Autores 
     SET nombre = ?, nacionalidad = ?
     WHERE id = ?`,
    [nombre, nacionalidad, id],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: 'Autor no encontrado' });
      }

      res.json({ success: true });
    }
  );
});


// DELETE - ELIMINAR AUTOR POR ID
Routes.delete('/autores/:id', (req, res) => {
  const id = parseInt(req.params.id);

  // 🔥 BORRAR EN DB
  db.run("DELETE FROM Autores WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'autor no encontrado' });
    }

    res.json({ success: true });
  });
});

module.exports = Routes;