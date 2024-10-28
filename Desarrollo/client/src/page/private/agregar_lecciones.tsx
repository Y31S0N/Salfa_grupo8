import { useState } from "react";
import { Link } from "react-router-dom";

// Simulación de los módulos disponibles (puedes reemplazar esto con datos reales)
const modulosDisponibles = [
  { id: 1, nombre: "Módulo 1: Introducción" },
  { id: 2, nombre: "Módulo 2: Técnicas Avanzadas" },
  { id: 3, nombre: "Módulo 3: Seguridad" },
];

const Agregar_lecciones = () => {
  const [moduloSeleccionado, setModuloSeleccionado] = useState<number | null>(
    null
  ); // Estado para módulo seleccionado
  const [numLecciones, setNumLecciones] = useState(1); // Estado para la cantidad de lecciones
  const [lecciones, setLecciones] = useState([{ nombre: "", descripcion: "" }]); // Estado para las lecciones

  // Función para seleccionar el módulo
  const handleModuloSeleccionado = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const moduloId = parseInt(e.target.value);
    setModuloSeleccionado(moduloId);
  };

  // Función para actualizar el número de lecciones y crear los campos correspondientes
  const handleChangeLecciones = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cantidad = parseInt(e.target.value) || 1;
    setNumLecciones(cantidad);

    // Ajustar el estado de las lecciones en base a la cantidad
    setLecciones(
      Array.from(
        { length: cantidad },
        (_, index) => lecciones[index] || { nombre: "", descripcion: "" }
      )
    );
  };

  // Función para manejar cambios en los campos de texto de cada lección
  const handleLeccionChange = (
    index: number,
    field: "nombre" | "descripcion",
    value: string
  ) => {
    const nuevasLecciones = [...lecciones];
    nuevasLecciones[index][field] = value;
    setLecciones(nuevasLecciones);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Agregar Lecciones a un Módulo
        </h2>

        {/* Selección del módulo */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="moduloSeleccionado"
          >
            Selecciona el Módulo
          </label>
          <select
            id="moduloSeleccionado"
            value={moduloSeleccionado ?? ""}
            onChange={handleModuloSeleccionado}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              Selecciona un módulo
            </option>
            {modulosDisponibles.map((modulo) => (
              <option key={modulo.id} value={modulo.id}>
                {modulo.nombre}
              </option>
            ))}
          </select>
        </div>

        {/* Campo para seleccionar la cantidad de lecciones solo si hay un módulo seleccionado */}
        {moduloSeleccionado && (
          <div className="mb-4">
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="cantidadLecciones"
            >
              ¿Cuántas lecciones deseas agregar?
            </label>
            <input
              type="number"
              id="cantidadLecciones"
              min={1}
              value={numLecciones}
              onChange={handleChangeLecciones}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        <form className="space-y-4">
          {/* Generar campos dinámicamente según la cantidad de lecciones */}
          {moduloSeleccionado &&
            lecciones.map((leccion, index) => (
              <div key={index} className="border p-4 rounded-lg shadow-sm mb-4">
                <h3 className="font-semibold mb-2">Lección {index + 1}</h3>

                {/* Nombre de la lección */}
                <div className="mb-2">
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor={`leccionNombre-${index}`}
                  >
                    Nombre de la Lección
                  </label>
                  <input
                    type="text"
                    id={`leccionNombre-${index}`}
                    value={leccion.nombre}
                    onChange={(e) =>
                      handleLeccionChange(index, "nombre", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Nombre de la lección ${index + 1}`}
                  />
                </div>

                {/* Descripción de la lección */}
                <div>
                  <label
                    className="block text-sm font-medium text-gray-700 mb-1"
                    htmlFor={`leccionDescripcion-${index}`}
                  >
                    Descripción de la Lección
                  </label>
                  <textarea
                    id={`leccionDescripcion-${index}`}
                    rows={4}
                    value={leccion.descripcion}
                    onChange={(e) =>
                      handleLeccionChange(index, "descripcion", e.target.value)
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder={`Descripción de la lección ${index + 1}`}
                  />
                </div>
              </div>
            ))}

          {/* Botones de volver y crear */}
          {moduloSeleccionado && (
            <div className="flex justify-center space-x-2">
              <Link to="/listado_modulos">
                <button
                  type="button"
                  className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
                >
                  Volver a cursos
                </button>
              </Link>
              <Link to="/agregar_contenido">
                <button
                  type="button"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Crear Lecciones
                </button>
              </Link>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Agregar_lecciones;
