const express = require("express");
const Routes = express.Router();

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

  if (apiKey !== "123456") {
    return res.status(403).json({
      success: false,
      message: "Error: la password no es correcta",
    });
  }

  const { nombre, tipo_usuario } = req.query;

  let filtered = usuarios.filter(u => {
    return (
      (nombre == null ||u.nombre?.toLowerCase().includes(nombre.toLowerCase())) &&
      (tipo_usuario == null ||u.tipo_usuario?.toLowerCase().includes(tipo_usuario.toLowerCase()))
    );
  });

  res.json({ success: true, data: filtered });
});

//USUARIOS POR ID
Routes.get("/usuarios/:id", (req, res) => {
  const usuario = usuarios.find((u) => u.id === parseInt(req.params.id));
  if (!usuario)
    return res
      .status(404)
      .json({ success: false, message: "Usuario no existente" });

  res.json({ success: true, data: usuario });
});

//POST- AGREGAR UN USUARIO
Routes.post("/usuarios", (req, res) => {
  const { nombre, tipo_usuario } = req.body;
  const nuevo = { id: usuarios.length + 1, nombre, tipo_usuario };
  usuarios.push(nuevo);
  res.status(201).json({ success: true, data: nuevo });
});

// PUT - ACTUALIZAR USUARIO POR ID
Routes.put("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, tipo_usuario } = req.body;

  const usuario = usuarios.find((p) => p.id === id);

  if (!usuario) {
    return res
      .status(404)
      .json({ success: false, message: "Usuario no encontrado" });
  }

  // Actualizamos solo si vienen datos
  if (nombre) usuario.nombre = nombre;
  if (tipo_usuario) usuario.tipo_usuario = tipo_usuario;

  res.json({ success: true, data: usuario });
});

// DELETE - ELIMINAR POR ID
Routes.delete("/usuarios/:id", (req, res) => {
  const id = parseInt(req.params.id);

  const index = usuarios.findIndex((u) => u.id === id);

  if (index === -1) {
    return res
      .status(404)
      .json({ success: false, message: "Usuario no encontrado" });
  }

  const eliminado = usuarios.splice(index, 1);

  res.json({ success: true, data: eliminado[0] });
});

module.exports = Routes;
