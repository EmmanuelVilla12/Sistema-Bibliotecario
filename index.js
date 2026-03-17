const express = require('express');
const app = express();
require ('dotenv').config();
const port = process.env.PORT;
const PASS = process.env.API_PASSWORD;
const cors = require('cors');


app.use(cors());
const AutoresRoutes = require('./Autores/AutoresRoutes');
const LibrosRoutes = require('./Libros/LibrosRoutes');
const PrestamosRoutes = require('./Prestamos/PrestamoRoutes');
const UsuariosRoutes = require('./Usuarios/UsuariosRoutes');
const EmpleadosRoutes = require('./Empleados/EmpleadosRoutes');
app.use(express.json());


app.use('/api',AutoresRoutes);
app.use('/api', LibrosRoutes);
app.use('/api', PrestamosRoutes);
app.use('/api', UsuariosRoutes);
app.use('/api', EmpleadosRoutes);


// Iniciar servidor
app.listen(port, () => console.log('API arriba!'));