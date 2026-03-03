const express = require('express');
const Routes = express.Router();

const autores = [
  { id: 1, nombre: "Gabriel García Márquez", nacionalidad: "Colombiana" },
  { id: 2, nombre: "Mario Vargas Llosa", nacionalidad: "Peruana" },
  { id: 3, nombre: "Isabel Allende", nacionalidad: "Chilena" },
  { id: 4, nombre: "Dante Alighieri", nacionalidad: "italiana" },
  { id: 5, nombre: "Yon Eley", nacionalidad: "Española" }
];


// GET - BUSCAR AUTOR POR ID 
Routes.get('/autores/:id', (req, res) => {
  const autor = autores.find(a => a.id === parseInt(req.params.id));
  if (!autor) 
    return res.status(404).json({ success: false, message: 'Autor no encontrado' });
  
  res.json({ success: true, data: autor });
});


//GET MUESTRA TODOS LOS AUTORES CON FILTRO
Routes.get('/autores', (req, res) => {
  const { nombre, nacionalidad } = req.query;

  const filtered = autores.filter(p => {
    return (
      (nombre == null || p.nombre?.toLowerCase().includes(nombre.toLowerCase())) &&
      (nacionalidad == null || p.nacionalidad?.toLowerCase().includes(nacionalidad.toLowerCase()))
    );
  });

  res.json({ success: true, data: filtered });
});

//POST- CREAR AUTOR
Routes.post('/autores', (req, res) => {
  const { nombre, nacionalidad } = req.body;
  const nuevo = { id: autores.length + 1, nombre, nacionalidad };
  autores.push(nuevo);
  res.status(201).json({ success: true, data: nuevo });
});


// PUT - CAMBIAR AUTOR POR ID
Routes.put('/autores/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const { nombre, nacionalidad } = req.body;

  const autor = autores.find(l => l.id === id);

  if (!autor) {
    return res.status(404).json({ success: false, message: 'Autor no encontrado' });
  }

  // Actualizamos solo si vienen datos
    if (nombre) autor.nombre = nombre;
    if (nacionalidad) autor.nacionalidad = nacionalidad;



  res.json({ success: true, data: autor });
});


// DELETE - ELIMINAR AUTOR POR ID
Routes.delete('/autores/:id', (req, res) => {
  const id = parseInt(req.params.id);

  const index = autores.findIndex(u => u.id === id);

  if (index === -1) {
    return res.status(404).json({ success: false, message: 'autor no encontrado' });
  }

  const eliminado = autores.splice(index, 1);

  res.json({ success: true, data: eliminado[0] });
});

module.exports = Routes;