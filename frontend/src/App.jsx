import { useEffect, useState } from "react";
import "./App.css";

const API = "https://sistema-bibliotecario-ta4p.onrender.com/api";

function App() {
  const [tabla, setTabla] = useState("libros");
  const [datos, setDatos] = useState([]);
  const [autores, setAutores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    cargarTodo();
  }, []);

  useEffect(() => {
    cargarDatos();
  }, [tabla]);

  const cargarTodo = async () => {
    try {
      const [a, u, l, e] = await Promise.all([
        fetch(`${API}/autores`).then((r) => r.json()),
        fetch(`${API}/usuarios`, {
          headers: { password: "HolaMundo123" },
        }).then((r) => r.json()),
        fetch(`${API}/libros`).then((r) => r.json()),
        fetch(`${API}/empleados`, {
          headers: { password: "HolaMundo123" },
        }).then((r) => r.json()),
      ]);

      setAutores(a.data || a);
      setUsuarios(u.data || u);
      setLibros(l.data || l);
      setEmpleados(e.data || e);
    } catch (err) {
      console.error(err);
      setError("Error cargando datos base");
    }
  };

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const res = await fetch(`${API}/${tabla}`, {
        headers:
          tabla === "usuarios" || tabla === "empleados"
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
      setDatos(Array.isArray(lista) ? lista : []);
    } catch (err) {
      console.error(err);
      setError("Error cargando datos");
    } finally {
      setCargando(false);
    }
  };

  const crear = async (body) => {
    try {
      const res = await fetch(`${API}/${tabla}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(tabla === "usuarios" || tabla === "empleados"
            ? { password: "HolaMundo123" }
            : {}),
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success === false) throw new Error(data.message);

      await cargarDatos();
      await cargarTodo();
    } catch (err) {
      console.error(err);
      setError("Error al crear");
    }
  };

  const eliminar = async (id) => {
    try {
      await fetch(`${API}/${tabla}/${id}`, {
        method: "DELETE",
        headers:
          tabla === "usuarios" || tabla === "empleados"
            ? { password: "HolaMundo123" }
            : {},
      });

      setDatos((prev) => prev.filter((d) => d.id !== id));
    } catch (err) {
      console.error(err);
      setError("Error al eliminar");
    }
  };

  const editar = async (item) => {
    try {
      // Construir objeto actualizado
      const actualizado = {};
      for (const key of Object.keys(item)) {
        if (key === "id") continue;
        const nuevoValor = prompt(`Editar ${key}:`, item[key]);
        actualizado[key] = nuevoValor ?? item[key];
      }

      const res = await fetch(`${API}/${tabla}/${item.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(tabla === "usuarios" || tabla === "empleados"
            ? { password: "HolaMundo123" }
            : {}),
        },
        body: JSON.stringify(actualizado),
      });

      const data = await res.json();
      if (data.success === false) throw new Error(data.message);

      await cargarDatos();
    } catch (err) {
      console.error(err);
      setError("Error al actualizar");
    }
  };

  const formulario = () => {
    if (tabla === "libros") {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            crear({
              nombre: e.target.nombre.value,
              id_autor: Number(e.target.autor.value),
              fecha_publicacion: Number(e.target.fecha.value),
              stock: Number(e.target.stock.value),
            });
            e.target.reset();
          }}
        >
          <h3>📘 Libro</h3>
          <input name="nombre" placeholder="Nombre" required />
          <select name="autor" required>
            <option value="">Selecciona autor</option>
            {autores.map((a) => (
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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            crear({
              nombre: e.target.nombre.value,
              nacionalidad: e.target.nacionalidad.value,
            });
            e.target.reset();
          }}
        >
          <h3>✍️ Autor</h3>
          <input name="nombre" placeholder="Nombre" required />
          <input name="nacionalidad" placeholder="Nacionalidad" />
          <button>Guardar</button>
        </form>
      );
    }

    if (tabla === "usuarios") {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            crear({
              nombre: e.target.nombre.value,
              tipo_usuario: e.target.tipo.value,
            });
            e.target.reset();
          }}
        >
          <h3>👤 Usuario</h3>
          <input name="nombre" placeholder="Nombre" required />
          <input name="tipo" placeholder="Tipo usuario" required />
          <button>Guardar</button>
        </form>
      );
    }

    if (tabla === "prestamos") {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            crear({
              id_usuario: Number(e.target.usuario.value),
              id_libro: Number(e.target.libro.value),
              fecha_prestamo: e.target.fecha.value,
            });
            e.target.reset();
          }}
        >
          <h3>📦 Préstamo</h3>
          <select name="usuario" required>
            <option value="">Usuario</option>
            {usuarios.map((u) => (
              <option key={u.id} value={u.id}>
                {u.nombre}
              </option>
            ))}
          </select>
          <select name="libro" required>
            <option value="">Libro</option>
            {libros.map((l) => (
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

    if (tabla === "empleados") {
      return (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            crear({
              nombre: e.target.nombre.value,
              apellidos: e.target.apellidos.value,
              cargo: e.target.cargo.value,
              telefono: e.target.telefono.value,
              correo_electronico: e.target.correo_electronico.value,
            });
            e.target.reset();
          }}
        >
          <h3>🧑‍💼 Empleado</h3>
          <input name="nombre" placeholder="Nombre" required />
          <input name="apellidos" placeholder="Apellidos" required />
          <input name="cargo" placeholder="Cargo" required />
          <input name="telefono" placeholder="Teléfono" required />
          <input name="correo_electronico" placeholder="Correo" required />
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
        <option value="empleados">Empleados</option>
      </select>

      <div className="grid">
        <div className="card">{formulario()}</div>

        <div className="card">
          <h2>Datos</h2>

          {cargando && <p>Cargando...</p>}
          {error && <p className="error">{error}</p>}

          {Array.isArray(datos) &&
            datos.map((item) => (
              <div key={item.id} className="item-card">
                {Object.entries(item).map(([k, v]) => (
                  <p key={k}>
                    <strong>{k}:</strong> {v}
                  </p>
                ))}

                <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                  <button className="btn-edit" onClick={() => editar(item)}>
                    ✏️ Editar
                  </button>

                  <button className="btn-delete" onClick={() => eliminar(item.id)}>
                    🗑 Eliminar
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}

export default App;