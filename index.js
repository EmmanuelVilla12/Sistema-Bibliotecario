const express = require('express');
const app = express();
const PORT = 3000;

const AutoresRoutes = require('./Autores/AutoresRoutes');
const LibrosRoutes = require('./Libros/LibrosRoutes');
const PrestamosRoutes = require('./Prestamos/PrestamoRoutes');
const UsuariosRoutes = require('./Usuarios/UsuariosRoutes');
app.use(express.json());

app.use('/api',AutoresRoutes);
app.use('/api', LibrosRoutes);
app.use('/api', PrestamosRoutes);
app.use('/api', UsuariosRoutes);

// Iniciar servidor
app.listen(PORT, () => console.log('API arriba!'));