// EditModal.jsx
import { useEffect, useRef, useState } from "react";

const FIELD_LABELS = {
  id:                 "ID",
  nombre:             "Nombre",
  apellidos:          "Apellidos",
  cargo:              "Cargo",
  telefono:           "Teléfono",
  correo_electronico: "Correo electrónico",
  nacionalidad:       "Nacionalidad",
  tipo_usuario:       "Tipo de usuario",
  id_autor:           "ID Autor",
  fecha_publicacion:  "Año de publicación",
  stock:              "Stock",
  id_usuario:         "ID Usuario",
  id_libro:           "ID Libro",
  id_empleado:        "ID Empleado",
  fecha_prestamo:     "Fecha de préstamo",
};

export default function EditModal({ item, onSave, onClose }) {
  // ✅ El estado se inicializa UNA sola vez con el item.
  // No hay ningún useEffect que llame a setForm.
  // Cuando el item cambia, App.jsx pasa key={item.id} y React
  // destruye y recrea el componente desde cero automáticamente.
  const [form, setForm] = useState({ ...item });
  const firstRef = useRef(null);

  // Solo para el foco inicial — no toca estado
  useEffect(() => {
    setTimeout(() => firstRef.current?.focus(), 120);
  }, []);

  // Cerrar con Escape — no toca estado
  useEffect(() => {
    const onKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = () => {
    const { id, ...rest } = form;
    onSave(id, rest);
  };

  const campos = Object.entries(form).filter(([k]) => k !== "id");

  return (
    <>
      <div className="modal-overlay" onClick={onClose} />

      <div className="modal-panel">
        <div className="modal-header">
          <div>
            <p className="modal-label">Editando registro</p>
            <p className="modal-title">
              ID #{item.id} — {item.nombre || item.fecha_prestamo || "—"}
            </p>
          </div>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          {campos.map(([key], index) => (
            <div className="field" key={key}>
              <label>{FIELD_LABELS[key] || key}</label>
              <input
                ref={index === 0 ? firstRef : null}
                value={form[key] ?? ""}
                onChange={(e) => handleChange(key, e.target.value)}
                placeholder={FIELD_LABELS[key] || key}
              />
            </div>
          ))}
        </div>

        <div className="modal-footer">
          <button className="btn btn-ghost" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>Guardar cambios</button>
        </div>
      </div>
    </>
  );
}