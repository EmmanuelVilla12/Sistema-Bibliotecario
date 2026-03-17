const sqlite3 = require("sqlite3").verbose();

const db = new sqlite3.Database("database.db", (err) => {
  if (err) console.error("Error conectando:", err.message);
  else console.log("Base de datos conectada");
  db.run("PRAGMA foreign_keys = ON");
});

db.run(`CREATE TABLE IF NOT EXISTS Usuarios (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  tipo_usuario TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS Autores (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  nacionalidad TEXT 
)`);

db.run(`CREATE TABLE IF NOT EXISTS Libros (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_autor INTEGER,
  nombre TEXT,
  fecha_publicacion TEXT,
  stock INTEGER,
  FOREIGN KEY (id_autor) REFERENCES Autores(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS Prestamos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  id_empleado INTEGER,
  id_usuario INTEGER,
  id_libro INTEGER,
  fecha_prestamo TEXT,
  FOREIGN KEY (id_libro) REFERENCES Libros(id),
  FOREIGN KEY (id_usuario) REFERENCES Usuarios(id),
  FOREIGN KEY (id_empleado) REFERENCES Empleados(id)
)`);

db.run(`CREATE TABLE IF NOT EXISTS Empleados (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  nombre TEXT,
  apellidos TEXT,
  cargo TEXT,
  telefono TEXT,
  correo_electronico TEXT UNIQUE
)`);



module.exports = db;
