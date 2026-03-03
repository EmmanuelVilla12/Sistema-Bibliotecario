# Sistema de Biblioteca

Este proyecto consiste en el desarrollo de una API REST para la gestión de una biblioteca digital. El sistema permite administrar libros, autores, usuarios y préstamos, realizando operaciones básicas como crear, consultar, actualizar y eliminar información.

Su objetivo es aplicar conceptos fundamentales del desarrollo backend, como el manejo de rutas, métodos HTTP, validación de datos y estructuración de respuestas en formato JSON, simulando el funcionamiento real de un sistema de biblioteca.

<br>

## 📂 Estructura del Proyecto


Sistema de biblioteca/<br>
├── index.js<br>
├── package.json<br>
└── routes/<br>
├── Autores.js<br>
├── usuarios.js<br>
├── Libros.js<br>
└── Prestamos.js<br>

<br>

##  Descripción de Archivos

<br>

## 🔹 index.js
Es el archivo principal del servidor. Se encarga de configurar y poner en funcionamiento la API REST del Sistema de Biblioteca usando Express.

### Funciones principales:

- Importa y configura Express.

- Define el puerto donde se ejecuta el servidor (3000).

- Activa el middleware express.json() para recibir datos en formato JSON.

- Importa y registra las rutas de:

- Autores

- Libros

- Usuarios

- Préstamos

- Inicia el servidor y lo deja recibiendo peticiones.

<br>

Este archivo centraliza la configuración general y conecta todos los módulos hijos del sistema para que funcionen como una API organizada bajo la ruta base /api.

<br><br>


## 🔹 style.css

Este archivo contiene la configuración general del proyecto y sus dependencias.

### Funciones principales:

- Define el nombre y versión del proyecto       (sistema-de-biblioteca).

- Establece index.js como archivo principal.

- Configura los scripts de ejecución:

- npm start → Ejecuta el servidor con Node.

- npm run dev → Ejecuta el servidor con Nodemon (reinicio automático).

- Declara las dependencias necesarias:

- Express → Framework para crear la API REST.

- Nodemon → Herramienta de desarrollo que reinicia el servidor automáticamente.

- Usa el sistema de módulos commonjs.


<br><br>

## Routes

<br>

### Autores.js

Este archivo gestiona todas las operaciones relacionadas con los autores dentro del sistema de biblioteca.

 ### Funcionalidades principales:

GET /autores

 - Obtiene la lista de autores.

- Permite filtrar por nombre y nacionalidad mediante parámetros query.

GET /autores/:id

- Busca y devuelve un autor específico según su ID.

- Retorna error 404 si no existe.

POST /autores

- Permite crear un nuevo autor.

- Agrega el autor al arreglo en memoria.

PUT /autores/:id

- Actualiza los datos de un autor existente.

- Modifica solo los campos enviados en la petición.

DELETE /autores/:id

- Elimina un autor según su ID.

- Retorna error si el autor no existe.

<br>

Este módulo utiliza express.Router() para organizar las rutas y mantener el proyecto estructurado bajo el estándar REST.

<br><br>

## Usuarios.js

Este archivo administra todas las operaciones relacionadas con los usuarios del sistema de biblioteca.

### Funcionalidades principales:

 GET /usuarios

- Devuelve la lista completa de usuarios.

- Protegido mediante una API Key enviada en los headers (password).

- Retorna error 401 si no se envía la clave.

- Retorna error 403 si la clave es incorrecta.

 GET /usuarios/:id

- Obtiene un usuario específico según su ID.

- Retorna error 404 si el usuario no existe.

GET /usuarios (con query params)

- Permite filtrar usuarios por nombre o tipo de usuario (Estudiante, Docente).

POST /usuarios

- Permite crear un nuevo usuario.

- Agrega el usuario al arreglo en memoria.

PUT /usuarios/:id

- Actualiza los datos de un usuario existente.

- Modifica solo los campos enviados en la petición.

DELETE /usuarios/:id

- Elimina un usuario según su ID.

- Retorna error si el usuario no existe.

<br><br>

## Libros.js

Este archivo gestiona todas las operaciones relacionadas con los libros dentro del sistema de biblioteca.

### Funcionalidades principales:

GET /libros

- Devuelve la lista completa de libros registrados.

GET /libros/:id

- Obtiene un libro específico según su ID.

- Retorna error 404 si el libro no existe.

POST /libros

- Permite agregar un nuevo libro al sistema.

- Registra datos como nombre, fecha de publicación, stock e ID del autor.

PUT /libros/:id

- Actualiza la información de un libro existente.

- Modifica únicamente los campos enviados en la petición.

DELETE /libros/:id

- Elimina un libro según su ID.

- Retorna error si el libro no se encuentra.

<br><br>

## Prestamos.js

Este archivo administra todas las operaciones relacionadas con los préstamos de libros dentro del sistema de biblioteca.

### Funcionalidades principales:

GET /prestamos

- Devuelve la lista completa de préstamos registrados.

GET /prestamos/:id

- Obtiene un préstamo específico según su ID.

- Retorna error 404 si el préstamo no existe.

POST /prestamos

- Permite registrar un nuevo préstamo.

- Guarda datos como nombre del usuario, ID del libro y fecha del préstamo.

PUT /prestamos/:id

- Actualiza la información de un préstamo existente.

- Modifica únicamente los campos enviados en la petición.

DELETE /prestamos/:id

- Elimina un registro de préstamo según su ID.

- Retorna error si no se encuentra el préstamo.




<br><br>

## Integrantes

- Nombre: Emmanuel Villa Valencia 
- Rol: Tech Lead <br>

- Nombre: Emanuel Castaño Espinosa<br>
- Rol: Backend Developer <br>

- Nombre: Jhon Fredy Cardona<br>
- Rol: Documentador<br>
<br><br>

## Proyecto Elegido

Proyecto 2 – Sistema de Biblioteca APIs: Libros, Autores, Usuarios, Préstamos

<br><br>
## URL Git Hub



<br><br>

### FIcha: 3229209

