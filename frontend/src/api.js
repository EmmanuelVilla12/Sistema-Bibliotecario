const API = "https://sistema-bibliotecario-ta4p.onrender.com";

// USUARIOS
export const getUsuarios = () =>
  fetch(`${API}/usuarios`).then(res => res.json());

export const crearUsuario = (data) =>
  fetch(`${API}/usuarios`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data)
  });

// LIBROS
export const getLibros = () =>
  fetch(`${API}/libros`).then(res => res.json());

// PRESTAMOS
export const getPrestamos = () =>
  fetch(`${API}/prestamos`).then(res => res.json());