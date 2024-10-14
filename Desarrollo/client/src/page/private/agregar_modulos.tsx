import { useState } from "react";
import { Link } from "react-router-dom";

const Agregar_modulos = () => {
  const [numModulos, setNumModulos] = useState(1); // Estado para la cantidad de módulos
  const [modulos, setModulos] = useState([{ nombre: "", descripcion: "" }]); // Estado para los módulos

  // Función para actualizar el número de módulos y crear los campos correspondientes
  const handleChangeModulos = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cantidad = parseInt(e.target.value) || 1;
    setNumModulos(cantidad);

    // Ajustar el estado de los módulos en base a la cantidad
    setModulos(
      Array.from(
        { length: cantidad },
        (_, index) => modulos[index] || { nombre: "", descripcion: "" }
      )
    );
  };

  // Función para manejar cambios en los campos de texto de cada módulo
  const handleModuloChange = (
    index: number,
    field: "nombre" | "descripcion",
    value: string
  ) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[index][field] = value;
    setModulos(nuevosModulos);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Crear Nuevos Módulos
        </h2>

        {/* Campo para seleccionar la cantidad de módulos */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700 mb-1"
            htmlFor="cantidadModulos"
          >
            ¿Cuántos módulos deseas crear?
          </label>
          <input
            type="number"
            id="cantidadModulos"
            min={1}
            value={numModulos}
            onChange={handleChangeModulos}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <form className="space-y-4">
          {/* Generar campos dinámicamente según la cantidad de módulos */}
          {modulos.map((modulo, index) => (
            <div key={index} className="border p-4 rounded-lg shadow-sm mb-4">
              <h3 className="font-semibold mb-2">Módulo {index + 1}</h3>

              {/* Nombre del módulo */}
              <div className="mb-2">
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor={`moduloNombre-${index}`}
                >
                  Nombre del Módulo
                </label>
                <input
                  type="text"
                  id={`moduloNombre-${index}`}
                  value={modulo.nombre}
                  onChange={(e) =>
                    handleModuloChange(index, "nombre", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Nombre del módulo ${index + 1}`}
                />
              </div>

              {/* Descripción del módulo */}
              <div>
                <label
                  className="block text-sm font-medium text-gray-700 mb-1"
                  htmlFor={`moduloDescripcion-${index}`}
                >
                  Descripción del Módulo
                </label>
                <textarea
                  id={`moduloDescripcion-${index}`}
                  rows={4}
                  value={modulo.descripcion}
                  onChange={(e) =>
                    handleModuloChange(index, "descripcion", e.target.value)
                  }
                  className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder={`Descripción del módulo ${index + 1}`}
                />
              </div>
            </div>
          ))}

          {/* Botones de volver y crear */}
          <div className="flex justify-center space-x-2">
            <Link to="/listado_cursos">
              <button
                type="button"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Volver a cursos
              </button>
            </Link>
            <Link to="/agregar_lecciones">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Crear Módulos
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Agregar_modulos;
