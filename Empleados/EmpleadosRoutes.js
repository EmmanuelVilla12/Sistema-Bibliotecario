const express = require("express");
const Routes = express.Router();
const db = require('../db');
const e = require("express");

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

  const { nombre, apellidos, cargo, telefono, correo_electronico } = req.query;

  let filtered = empleados.filter(e => {
    return (
      (nombre == null ||e.nombre?.toLowerCase().includes(nombre.toLowerCase())) &&
      (apellidos == null ||e.apellidos?.toLowerCase().includes(apellidos.toLowerCase()))&&
      (cargo == null ||e.cargo?.toLowerCase().includes(cargo.toLowerCase()))&&
      (telefono == null ||e.telefono?.toLowerCase().includes(telefono.toLowerCase()))&&
      (correo_electronico == null ||e.correo_electronico?.toLowerCase().includes(correo_electronico.toLowerCase()))
    );
  });

  res.json({ success: true, data: filtered });
});

//Empleados por ID
Routes.get("/empleados/:id", (req, res) => {
  const empleado = empleados.find((e) => e.id === parseInt(req.params.id));
  if (!empleado)
    return res
      .status(404)
      .json({ success: false, message: "Empleado no existente" });

  res.json({ success: true, data: empleado });
});


//POST- AGREGAR UN EMPLEADO
Routes.post("/empleados", (req, res) => {
  const { nombre, apellidos, cargo, telefono, correo_electronico } = req.body;

  // Validación: campos obligatorios
  if (!nombre || !apellidos || !cargo || !correo_electronico|| !telefono) {
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
      res.status(201).json({ success: true, data: { id: this.lastID, nombre, apellidos, cargo, telefono, correo_electronico } });
    }
  );
});

// PUT - ACTUALIZAR USUARIO POR ID
Routes.put("/empleados/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, apellidos, cargo, telefono, correo_electronico } = req.body;

  const empleado = empleados.find((p) => p.id === id);
  
  if (!empleado) {
    return res
      .status(404)
      .json({ success: false, message: "Empleado no encontrado" });
  }

  // Actualizamos solo si vienen datos
  if (nombre) empleado.nombre = nombre;
  if (apellidos) empleado.apellidos = apellidos;
  if (cargo) empleado.cargo = cargo;
  if (telefono) empleado.telefono = telefono;
  if (correo_electronico) empleado.correo_electronico = correo_electronico;

  res.json({ success: true, data: empleado });
});

// DELETE - ELIMINAR POR ID
Routes.delete("/empleados/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = empleados.findIndex((u) => u.id === id);

  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Empleado no encontrado" });
  }

  const eliminado = empleados.splice(index, 1);

  res.json({ success: true, data: eliminado[0] });
});

module.exports = Routes;