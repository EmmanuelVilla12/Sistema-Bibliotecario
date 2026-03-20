import { useEffect, useState } from "react";
import "./App.css";

const API = "https://sistema-bibliotecario-ta4p.onrender.com/api";

function App() {
  const [tabla, setTabla] = useState("libros");
  const [datos, setDatos] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  const [filtros, setFiltros] = useState({});
  const [page, setPage] = useState(1);
  const limit = 5;

  // 🔥 CAMPOS POR TABLA
  const camposPorTabla = {
    libros: ["nombre", "fecha_publicacion", "stock"],
    autores: ["nombre", "nacionalidad"],
    empleados: ["nombre", "apellidos", "cargo"],
    usuarios: ["nombre", "tipo_usuario"],
    prestamos: ["id_usuario", "id_libro", "fecha_prestamo"],
  };

  useEffect(() => {
    cargarDatos();
  }, [tabla, filtros, page]);

  const cargarDatos = async () => {
    try {
      setCargando(true);
      setError("");

      const query = new URLSearchParams({
        ...filtros,
        page,
        limit,
      });

      const res = await fetch(`${API}/${tabla}?${query.toString()}`, {
        headers:
          tabla === "usuarios" || tabla === "empleados"
            ? { password: "HolaMundo123" }
            : {},
      });

      const data = await res.json();

      setDatos(data.data || []);
    } catch (err) {
      console.error(err);
      setError("Error cargando datos");
    } finally {
      setCargando(false);
    }
  };

  // 🔥 LIMPIAR FILTROS
  const limpiarFiltros = () => {
    setFiltros({});
    setPage(1);
  };

  return (
    <div className="app-container">
      <h1 className="title">📚 Sistema Bibliotecario PRO</h1>

      {/* SELECT TABLA */}
      <select
        className="select"
        value={tabla}
        onChange={(e) => {
          setTabla(e.target.value);
          setFiltros({});
          setPage(1);
        }}
      >
        <option value="libros">Libros</option>
        <option value="autores">Autores</option>
        <option value="usuarios">Usuarios</option>
        <option value="prestamos">Préstamos</option>
        <option value="empleados">Empleados</option>
      </select>

      <div className="grid">
        {/* 🔍 FILTROS */}
        <div className="card">
          <h2>Filtros</h2>

          {/* 🔥 BUSCADOR GLOBAL */}
          <input
            placeholder="Buscar en todo..."
            onChange={(e) =>
              setFiltros({ ...filtros, q: e.target.value })
            }
          />

          {/* 🔥 FILTROS DINÁMICOS */}
          <div className="filtros-grid">
            {camposPorTabla[tabla]?.map((campo) => (
              <input
                key={campo}
                placeholder={campo}
                onChange={(e) =>
                  setFiltros({ ...filtros, [campo]: e.target.value })
                }
              />
            ))}
          </div>

          {/* 🔥 ORDENAMIENTO */}
          <div className="orden-box">
            <select
              onChange={(e) =>
                setFiltros({ ...filtros, sort: e.target.value })
              }
            >
              <option value="">Ordenar por</option>
              {camposPorTabla[tabla]?.map((campo) => (
                <option key={campo} value={campo}>
                  {campo}
                </option>
              ))}
            </select>

            <select
              onChange={(e) =>
                setFiltros({ ...filtros, order: e.target.value })
              }
            >
              <option value="asc">Ascendente</option>
              <option value="desc">Descendente</option>
            </select>
          </div>

          <button onClick={limpiarFiltros}>Limpiar filtros</button>
        </div>

        {/* 📊 DATOS */}
        <div className="card">
          <h2>Datos</h2>

          {cargando && <p>Cargando...</p>}
          {error && <p className="error">{error}</p>}

          {datos.map((item) => (
            <div key={item.id} className="item-card">
              {Object.entries(item).map(([k, v]) => (
                <p key={k}>
                  <strong>{k}:</strong> {v}
                </p>
              ))}
            </div>
          ))}

          {/* 🔥 PAGINACIÓN */}
          <div className="paginacion">
            <button onClick={() => setPage((p) => Math.max(p - 1, 1))}>
              ⬅
            </button>

            <span>Página {page}</span>

            <button onClick={() => setPage((p) => p + 1)}>
              ➡
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;