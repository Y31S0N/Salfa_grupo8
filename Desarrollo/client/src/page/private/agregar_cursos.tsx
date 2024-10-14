import { Link } from "react-router-dom";
const Agregar_cursos = () => {
  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Crear Nuevo Curso
        </h2>
        <form className="space-y-4">
          {/* Nombre del curso */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="cursoNombre"
            >
              Nombre del Curso
            </label>
            <input
              type="text"
              id="cursoNombre"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Capacitación Minera"
            />
          </div>

          {/* Descripción del curso */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="cursoDescripcion"
            >
              Descripción del Curso
            </label>
            <textarea
              id="cursoDescripcion"
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del curso aquí..."
            />
          </div>

          {/* Fecha límite */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="fechaLimite"
            >
              Fecha Límite (opcional)
            </label>
            <input
              type="date"
              id="fechaLimite"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Botones de volver y crear */}
          <div className="flex justify-center space-x-2">
            <Link to="/listado_cursos">
              <button
                type="button"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Volver
              </button>
            </Link>
            <Link to="/agregar_modulos">
              <button
                type="button"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Crear Curso
              </button>
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Agregar_cursos;
