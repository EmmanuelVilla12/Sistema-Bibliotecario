const express = require("express");
const Routes = express.Router();
const db = require('../db')

const usuarios = [
  { id: 1, nombre: "pichula", tipo_usuario: "Estudiante" },
  { id: 2, nombre: "marquitos", tipo_usuario: "Estudiante" },
  { id: 3, nombre: "venito tocalmelo", tipo_usuario: "Docente" },
];

//TODOS LOS USUARIOS
Routes.get("/usuarios", (req, res) => {
  const apiKey = req.headers["password"];

  if (!apiKey) {
    return res.status(401).json({
      success: false,
      message: "Error: API Key no proporcionada",
    });
  }

  if (apiKey !== process.env.API_PASSWORD) {
    return res.status(403).json({
      success: false,
      message: "Error: la password no es correcta",
    });
  }

  const filtros = req.query;

db.all("SELECT * FROM Usuarios", [], (err, rows) => {
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


//USUARIOS POR ID
Routes.get("/usuarios/:id", (req, res) => {
  const usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  const id = parseInt(req.params.id);

  db.get("SELECT * FROM Usuarios WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (!row) {
      return res.status(404).json({ success: false, message: "Usuario no existente" });
    }

    res.json({ success: true, data: row });
  });
});

//POST- AGREGAR UN USUARIO
Routes.post("/usuarios", (req, res) => {
  const { nombre, tipo_usuario } = req.body;

  // Validación: campos obligatorios
  if (!nombre || !tipo_usuario) {
    return res.status(400).json({
      success: false,
      message: 'nombre y tipo de usuario son obligatorios'
    });
  }


  db.run(
    'INSERT INTO Usuarios (nombre, tipo_usuario) VALUES (?, ?)',
    [nombre, tipo_usuario],
    function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });
      res.status(201).json({ success: true, data: { id: this.lastID, nombre, tipo_usuario } });
    }
  );
});



// PUT - ACTUALIZAR USUARIO POR ID
Routes.put("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, tipo_usuario } = req.body;

  // 🔥 YA NO USA ARRAY, USA DB
  db.run(
    `UPDATE Usuarios 
     SET nombre = ?, tipo_usuario = ?
     WHERE id = ?`,
    [nombre, tipo_usuario],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: "Usuario no encontrado" });
      }

      res.json({ success: true });
    }
  );
});

// DELETE - ELIMINAR POR ID
Routes.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);

   // 🔥 AHORA BORRA EN DB
  db.run("DELETE FROM Usuarios WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: "Usuario no encontrado" });
    }

    res.json({ success: true });
  });
});

module.exports = Routes;
