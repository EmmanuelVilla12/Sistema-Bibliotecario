import { useEffect, useState } from "react";
import "./App.css";

const API = "https://sistema-bibliotecario-ta4p.onrender.com/api";

function App() {
  const [tabla, setTabla] = useState("libros");
  const [datos, setDatos] = useState([]);
  const [autores, setAutores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  // 🔥 cargar todo
  useEffect(() => {
    cargarTodo();
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [tabla]);

  // 🔥 traer datos base para selects
  const cargarTodo = async () => {
    try {
      const [a, u, l] = await Promise.all([
        fetch(`${API}/autores`).then(r => r.json()),
        fetch(`${API}/usuarios`, {
          headers: { password: "HolaMundo123" }
        }).then(r => r.json()),
        fetch(`${API}/libros`).then(r => r.json()),
      ]);

      setAutores(a.data || a);
      setUsuarios(u.data || u);
      setLibros(l.data || l);

    } catch (err) {
      console.error(err);
    }
  };

  // 🔥 cargar tabla actual
  const cargarDatos = async () => {
    try {
      setCargando(true);

      const res = await fetch(`${API}/${tabla}`, {
        headers:
          tabla === "usuarios"
            ? { password: "HolaMundo123" }
            : {},
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error("Error de API");
      }

      const lista = data.data || data;
      setDatos(lista);

    } catch (err) {
      console.error(err);
      setError("Error cargando datos");
    } finally {
      setCargando(false);
    }
  };

  // 🔥 CREAR + tiempo real
  const crear = async (body) => {
    try {
      const res = await fetch(`${API}/${tabla}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (data.success === false) {
        throw new Error(data.message);
      }

      // 🔥 actualización inmediata
      await cargarDatos();
      await cargarTodo();

    } catch (err) {
      console.error(err);
      setError("Error al crear");
    }
  };

  // 🔥 ELIMINAR + tiempo real
  const eliminar = async (id) => {
    try {
      await fetch(`${API}/${tabla}/${id}`, {
        method: "DELETE",
      });

      setDatos(prev => prev.filter(d => d.id !== id));

    } catch (err) {
      console.error(err);
      setError("Error al eliminar");
    }
  };

  // 🔥 FORMULARIOS PRO (con selects)
  const formulario = () => {

    if (tabla === "libros") {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          crear({
            nombre: e.target.nombre.value,
            id_autor: Number(e.target.autor.value),
            fecha_publicacion: Number(e.target.fecha.value),
            stock: Number(e.target.stock.value),
          });
          e.target.reset();
        }}>
          <h3>📘 Libro</h3>
          <input name="nombre" placeholder="Nombre" required />

          <select name="autor" required>
            <option value="">Selecciona autor</option>
            {autores.map(a => (
              <option key={a.id} value={a.id}>
                {a.nombre}
              </option>
            ))}
          </select>

          <input name="fecha" placeholder="Año" required />
          <input name="stock" placeholder="Stock" required />
          <button>Guardar</button>
        </form>
      );
    }

    if (tabla === "autores") {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          crear({
            nombre: e.target.nombre.value,
            nacionalidad: e.target.nacionalidad.value,
          });
          e.target.reset();
        }}>
          <h3>✍️ Autor</h3>
          <input name="nombre" placeholder="Nombre" required />
          <input name="nacionalidad" placeholder="Nacionalidad" />
          <button>Guardar</button>
        </form>
      );
    }

    if (tabla === "usuarios") {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          crear({
            nombre: e.target.nombre.value,
            tipo_usuario: e.target.tipo.value,
          });
          e.target.reset();
        }}>
          <h3>👤 Usuario</h3>
          <input name="nombre" placeholder="Nombre" required />
          <input name="tipo" placeholder="Tipo usuario" required />
          <button>Guardar</button>
        </form>
      );
    }

    if (tabla === "prestamos") {
      return (
        <form onSubmit={(e) => {
          e.preventDefault();
          crear({
            id_usuario: Number(e.target.usuario.value),
            id_libro: Number(e.target.libro.value),
            fecha_prestamo: e.target.fecha.value,
          });
          e.target.reset();
        }}>
          <h3>📦 Préstamo</h3>

          <select name="usuario" required>
            <option value="">Usuario</option>
            {usuarios.map(u => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>

          <select name="libro" required>
            <option value="">Libro</option>
            {libros.map(l => (
              <option key={l.id} value={l.id}>
                {l.nombre}
              </option>
            ))}
          </select>

          <input name="fecha" placeholder="Fecha" required />
          <button>Guardar</button>
        </form>
      );
    }
  };

  return (
  <div className="app-container">
    <h1 className="title">📚 Sistema Bibliotecario PRO</h1>

    <select 
      className="select"
      value={tabla} 
      onChange={(e) => setTabla(e.target.value)}
    >
      <option value="libros">Libros</option>
      <option value="autores">Autores</option>
      <option value="usuarios">Usuarios</option>
      <option value="prestamos">Préstamos</option>
    </select>

    <div className="grid">

      {/* FORM */}
      <div className="card">
        {formulario()}
      </div>

      {/* LISTA */}
      <div className="card">
        <h2>Datos</h2>

        {cargando && <p>Cargando...</p>}
        {error && <p className="error">{error}</p>}

        {datos.map(item => (
          <div key={item.id} className="item-card">

            {Object.entries(item).map(([k, v]) => (
              <p key={k}>
                <strong>{k}:</strong> {v}
              </p>
            ))}

            <button 
              className="btn-delete"
              onClick={() => eliminar(item.id)}
            >
              🗑 Eliminar
            </button>

          </div>
        ))}
      </div>

    </div>
  </div>
);
}

export default App;