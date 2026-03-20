import { useEffect, useRef, useState } from "react";
import "./App.css";
import EditModal from "./EditModal";

const API = "https://sistema-bibliotecario-ta4p.onrender.com/api";

// ─── FILTROS POR TABLA ────────────────────────────────────
const FILTROS_CONFIG = {
  libros: [
    { key: "nombre", label: "Nombre del libro", placeholder: "ej. El Quijote" },
    {
      key: "fecha_publicacion",
      label: "Año publicación",
      placeholder: "ej. 1967",
    },
  ],
  autores: [
    { key: "nombre", label: "Nombre", placeholder: "ej. García Márquez" },
    {
      key: "nacionalidad",
      label: "Nacionalidad",
      placeholder: "ej. Colombiana",
    },
  ],
  usuarios: [
    { key: "nombre", label: "Nombre", placeholder: "ej. Juan Pérez" },
    {
      key: "tipo_usuario",
      label: "Tipo de usuario",
      placeholder: "ej. Estudiante",
    },
  ],
  prestamos: [
    { key: "id_usuario", label: "ID Usuario", placeholder: "ej. 1" },
    { key: "id_libro", label: "ID Libro", placeholder: "ej. 2" },
    { key: "fecha_prestamo", label: "Fecha", placeholder: "ej. 2024-01-15" },
  ],
  empleados: [
    { key: "nombre", label: "Nombre", placeholder: "ej. Pepito" },
    { key: "apellidos", label: "Apellidos", placeholder: "ej. Álvarez" },
    { key: "cargo", label: "Cargo", placeholder: "ej. Auxiliar" },
    { key: "telefono", label: "Teléfono", placeholder: "ej. 301 456" },
  ],
};

// ─── Hook Notificaciones ──────────────────────────────────
function useNotif() {
  const stackRef = useRef(null);

  const notify = (type, title, msg, icon = "●") => {
    const stack = stackRef.current;
    if (!stack) return;
    const el = document.createElement("div");
    el.className = `notif notif-${type}`;
    el.innerHTML = `
      <span class="notif-icon">${icon}</span>
      <div class="notif-body">
        <div class="notif-title">${title}</div>
        <div class="notif-msg">${msg}</div>
      </div>
      <span class="notif-close">✕</span>`;
    el.querySelector(".notif-close").onclick = () => dismiss(el);
    stack.appendChild(el);
    requestAnimationFrame(() =>
      requestAnimationFrame(() => el.classList.add("show")),
    );
    el._timer = setTimeout(() => dismiss(el), 4000);
  };

  const dismiss = (el) => {
    if (!el || !el.parentElement) return;
    clearTimeout(el._timer);
    el.classList.add("hide");
    setTimeout(() => el.remove(), 280);
  };

  return { stackRef, notify };
}

// ─── Componente Field ─────────────────────────────────────
function Field({ label, children }) {
  return (
    <div className="field">
      <label>{label}</label>
      {children}
    </div>
  );
}

// ─── App ──────────────────────────────────────────────────
function App() {
  const [tabla, setTabla] = useState("libros");
  const [datos, setDatos] = useState([]);
  const [autores, setAutores] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [libros, setLibros] = useState([]);
  const [empleados, setEmpleados] = useState([]);
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [filtros, setFiltros] = useState({});

  // Estado del modal de edición
  const [itemEditando, setItemEditando] = useState(null);

  const { stackRef, notify } = useNotif();

  useEffect(() => {
    cargarTodo();
  }, []);
  useEffect(() => {
    cargarDatos();
  }, [tabla, filtros]);

  // ── Fetch ────────────────────────────────────────────────
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
      const query = new URLSearchParams();
      Object.entries(filtros).forEach(([key, value]) => {
        if (value) query.append(key, value);
      });
      const res = await fetch(`${API}/${tabla}?${query.toString()}`, {
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
      notify("error", "Error", "No se pudieron cargar los datos.", "⚠");
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
      notify("success", "Guardado", "Registro creado correctamente.", "✓");
    } catch (err) {
      console.error(err);
      setError("Error al crear");
      notify(
        "error",
        "Error al crear",
        err.message || "Intenta de nuevo.",
        "⚠",
      );
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
      notify("warn", "Eliminado", `El registro #${id} fue removido.`, "🗑");
    } catch (err) {
      console.error(err);
      setError("Error al eliminar");
      notify("error", "Error al eliminar", "Intenta de nuevo.", "⚠");
    }
  };

  // ── Editar: ahora abre el modal en vez de usar prompt() ──
  const abrirEditar = (item) => {
    setItemEditando(item);
  };

  const guardarEdicion = async (id, actualizado) => {
    try {
      const res = await fetch(`${API}/${tabla}/${id}`, {
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
      setItemEditando(null);
      await cargarDatos();
      notify("success", "Actualizado", `Registro #${id} modificado.`, "✓");
    } catch (err) {
      console.error(err);
      setError("Error al actualizar");
      notify(
        "error",
        "Error al actualizar",
        err.message || "Intenta de nuevo.",
        "⚠",
      );
    }
  };

  // ── Formularios ──────────────────────────────────────────
  const formulario = () => {
    if (tabla === "libros")
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
          <div className="form-header">
            <h2>Nuevo registro</h2>
            <p>Libro</p>
          </div>
          <div className="form-body">
            <Field label="Nombre">
              <input name="nombre" placeholder="ej. El Quijote" required />
            </Field>
            <Field label="Autor">
              <select name="autor" required>
                <option value="">Selecciona autor</option>
                {autores.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Año de publicación">
              <input name="fecha" placeholder="ej. 1605" required />
            </Field>
            <Field label="Stock">
              <input name="stock" placeholder="ej. 10" required />
            </Field>
            <div className="add-mode">
              <button className="btn btn-primary">+ Guardar libro</button>
            </div>
          </div>
        </form>
      );

    if (tabla === "autores")
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
          <div className="form-header">
            <h2>Nuevo registro</h2>
            <p>Autor</p>
          </div>
          <div className="form-body">
            <Field label="Nombre">
              <input
                name="nombre"
                placeholder="ej. Gabriel García Márquez"
                required
              />
            </Field>
            <Field label="Nacionalidad">
              <input name="nacionalidad" placeholder="ej. Colombiana" />
            </Field>
            <div className="add-mode">
              <button className="btn btn-primary">+ Guardar autor</button>
            </div>
          </div>
        </form>
      );

    if (tabla === "usuarios")
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
          <div className="form-header">
            <h2>Nuevo registro</h2>
            <p>Usuario</p>
          </div>
          <div className="form-body">
            <Field label="Nombre">
              <input name="nombre" placeholder="ej. Juan Pérez" required />
            </Field>
            <Field label="Tipo de usuario">
              <input name="tipo" placeholder="ej. Estudiante" required />
            </Field>
            <div className="add-mode">
              <button className="btn btn-primary">+ Guardar usuario</button>
            </div>
          </div>
        </form>
      );

    if (tabla === "prestamos")
      return (
        <form
          // ✅ ahora sí incluye id_empleado
          onSubmit={(e) => {
            e.preventDefault();
            crear({
              id_empleado: Number(e.target.empleado.value),
              id_usuario: Number(e.target.usuario.value),
              id_libro: Number(e.target.libro.value),
              fecha_prestamo: e.target.fecha.value,
            });
            e.target.reset();
          }}
        >
          <div className="form-header">
            <h2>Nuevo registro</h2>
            <p>Préstamo</p>
          </div>
          <div className="form-body">
            <Field label="Empleado">
              <select name="empleado" required>
                <option value="">Seleccionar empleado</option>
                {empleados.map((e) => (
                  <option key={e.id} value={e.id}>
                    {e.nombre} {e.apellidos}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Usuario">
              <select name="usuario" required>
                <option value="">Seleccionar usuario</option>
                {usuarios.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Libro">
              <select name="libro" required>
                <option value="">Seleccionar libro</option>
                {libros.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.nombre}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Fecha de préstamo">
              <input name="fecha" placeholder="ej. 2024-01-15" required />
            </Field>
            <div className="add-mode">
              <button className="btn btn-primary">+ Guardar préstamo</button>
            </div>
          </div>
        </form>
      );

    if (tabla === "empleados")
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
          <div className="form-header">
            <h2>Nuevo registro</h2>
            <p>Empleado</p>
          </div>
          <div className="form-body">
            <Field label="Nombre">
              <input name="nombre" placeholder="ej. Pepito" required />
            </Field>
            <Field label="Apellidos">
              <input name="apellidos" placeholder="ej. Álvarez" required />
            </Field>
            <Field label="Cargo">
              <input name="cargo" placeholder="ej. Auxiliar" required />
            </Field>
            <Field label="Teléfono">
              <input name="telefono" placeholder="ej. 301 456 78 25" required />
            </Field>
            <Field label="Correo electrónico">
              <input
                name="correo_electronico"
                placeholder="ej. pepito@gmail.com"
                required
              />
            </Field>
            <div className="add-mode">
              <button className="btn btn-primary">+ Guardar empleado</button>
            </div>
          </div>
        </form>
      );
  };

  // ── Filtros universales ──────────────────────────────────
  const renderFiltros = () => {
    const campos = FILTROS_CONFIG[tabla] || [];
    if (!campos.length) return null;
    const hayFiltrosActivos = Object.values(filtros).some(Boolean);

    return (
      <div className="filtros-box">
        <div className="filtros-grid">
          {campos.map(({ key, label, placeholder }) => (
            <div key={key} className="filtro-field">
              <label className="filtro-label">{label}</label>
              <input
                placeholder={placeholder}
                value={filtros[key] || ""}
                onChange={(e) =>
                  setFiltros((prev) => ({ ...prev, [key]: e.target.value }))
                }
              />
            </div>
          ))}
        </div>
        {hayFiltrosActivos && (
          <button className="btn-limpiar" onClick={() => setFiltros({})}>
            ✕ Limpiar filtros
          </button>
        )}
      </div>
    );
  };

  // ── Render ───────────────────────────────────────────────
  return (
    <>
      {/* HEADER */}
      <header className="header">
        <div className="logo">
          <div className="logo-bars">
            <span />
            <span />
            <span />
          </div>
          Sistema Bibliotecario{" "}
          <span style={{ color: "var(--t3)", marginLeft: 2, fontWeight: 400 }}>
            PRO
          </span>
        </div>
        <select
          className="nav-select"
          value={tabla}
          onChange={(e) => {
            setTabla(e.target.value);
            setFiltros({});
          }}
        >
          <option value="libros">Libros</option>
          <option value="autores">Autores</option>
          <option value="usuarios">Usuarios</option>
          <option value="prestamos">Préstamos</option>
          <option value="empleados">Empleados</option>
        </select>
        <div className="avatar">AD</div>
      </header>

      {/* BODY */}
      <div className="body">
        {/* FORMULARIO */}
        <div className="form-card">{formulario()}</div>

        {/* PANEL DE DATOS */}
        <div className="data-panel">
          <div className="panel-header">
            <div className="panel-header-left">
              <h2>Datos</h2>
              <span className="count-pill">{datos.length}</span>
            </div>
          </div>

          {renderFiltros()}

          {cargando && (
            <p
              style={{
                padding: "16px 20px",
                color: "var(--t3)",
                fontSize: ".85rem",
              }}
            >
              Cargando…
            </p>
          )}
          {error && (
            <p
              style={{
                padding: "10px 20px",
                color: "var(--danger)",
                fontSize: ".85rem",
              }}
            >
              ⚠ {error}
            </p>
          )}

          <div style={{ padding: "12px 20px 20px" }}>
            {Array.isArray(datos) &&
              datos.map((item) => (
                <div key={item.id} className="item-card">
                  <div className="item-card-content">
                    {Object.entries(item).map(([k, v]) => (
                      <p key={k}>
                        <span className="item-key">{k}:</span>
                        <span className="item-val">{v}</span>
                      </p>
                    ))}
                  </div>
                  <div className="row-actions" style={{ marginTop: 10 }}>
                    <button
                      className="btn-sm btn-edit"
                      onClick={() => abrirEditar(item)}
                    >
                      ✏ Editar
                    </button>
                    <button
                      className="btn-sm btn-del"
                      onClick={() => eliminar(item.id)}
                    >
                      ✕
                    </button>
                  </div>
                </div>
              ))}

            {!cargando && datos.length === 0 && !error && (
              <div className="empty-state">
                <p>No hay registros para mostrar.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MODAL DE EDICIÓN */}
      <EditModal
        item={itemEditando}
        onSave={guardarEdicion}
        onClose={() => setItemEditando(null)}
      />

      {/* NOTIFICACIONES */}
      <div className="notif-stack" ref={stackRef} />
    </>
  );
}

export default App;
