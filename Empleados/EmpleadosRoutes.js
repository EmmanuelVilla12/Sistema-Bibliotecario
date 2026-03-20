const express = require("express");
const Routes = express.Router();
const db = require('../db');

//Empleados Registrados
const empleados = [
  { id: 1, nombre: "Martha", apellidos:"Alvarez Puerta", cargo: "Administrador", telefono: "301 456 78 25", correo_electronico: "MarthaAP@gmail.com"  },
  { id: 2, nombre: "Pedro", apellidos:"Gonzales Huerta", cargo: "Bibliotecario", telefono: "302 789 45 86", correo_electronico: "PedroGH@gmail.com"  },
  { id: 3, nombre: "Jaime", apellidos:"Ramirez Hurtado", cargo: "Auxiliar", telefono: "300 489 75 18", correo_electronico: "JaimePH@gmail.com"  },
];

//TODOS LOS EMPLEADOS
Routes.get("/empleados", (req, res) => {
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

db.all("SELECT * FROM Empleados", [], (err, rows) => {
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

//Empleados por ID
Routes.get("/empleados/:id", (req, res) => {
  const id = parseInt(req.params.id);

  db.get("SELECT * FROM Empleados WHERE id = ?", [id], (err, row) => {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (!row) {
      return res.status(404).json({ success: false, message: "Empleado no existente" });
    }

    res.json({ success: true, data: row });
  });
});


//POST- AGREGAR UN EMPLEADO
Routes.post("/empleados", (req, res) => {
  const { nombre, apellidos, cargo, telefono, correo_electronico } = req.body;

  if (!nombre || !apellidos || !cargo || !correo_electronico || !telefono) {
    return res.status(400).json({
      success: false,
      message: 'nombre, apellidos, cargo, telefono y correo_electronico son obligatorios'
    });
  }

  db.run(
    'INSERT INTO Empleados (nombre, apellidos, cargo, telefono, correo_electronico) VALUES (?, ?, ?, ?, ?)',
    [nombre, apellidos, cargo, telefono, correo_electronico],
    function(err) {
      if (err) return res.status(500).json({ success: false, message: err.message });

      res.status(201).json({
        success: true,
        data: { id: this.lastID, nombre, apellidos, cargo, telefono, correo_electronico }
      });
    }
  );
});

// PUT - ACTUALIZAR USUARIO POR ID
Routes.put("/empleados/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, apellidos, cargo, telefono, correo_electronico } = req.body;

  // 🔥 YA NO USA ARRAY, USA DB
  db.run(
    `UPDATE Empleados 
     SET nombre = ?, apellidos = ?, cargo = ?, telefono = ?, correo_electronico = ?
     WHERE id = ?`,
    [nombre, apellidos, cargo, telefono, correo_electronico, id],
    function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: err.message });
      }

      if (this.changes === 0) {
        return res.status(404).json({ success: false, message: "Empleado no encontrado" });
      }

      res.json({ success: true });
    }
  );
});

// DELETE - ELIMINAR POR ID
Routes.delete("/empleados/:id", (req, res) => {
  const id = parseInt(req.params.id);

  // 🔥 AHORA BORRA EN DB
  db.run("DELETE FROM Empleados WHERE id = ?", [id], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: err.message });
    }

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: "Empleado no encontrado" });
    }

    res.json({ success: true });
  });
});

module.exports = Routes;