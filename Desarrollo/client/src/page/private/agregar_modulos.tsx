import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";

// Definir la interfaz para los datos del curso
interface Curso {
  nombre_curso: string;
  // Agrega otros campos según sea necesario
}

const Agregar_modulos = () => {
  const { id } = useParams<{ id: string }>(); // Obtiene el ID del curso
  const [nombreModulo, setNombreModulo] = useState("");
  const [descripcionModulo, setDescripcionModulo] = useState("");
  const [nombreCurso, setNombreCurso] = useState(""); // Estado para almacenar el nombre del curso
  const navigate = useNavigate(); // Para redirigir después de crear el módulo

  // Cargar el nombre del curso al montar el componente
  useEffect(() => {
    const fetchCurso = async () => {
      try {
        // Tipar la respuesta con la interfaz Curso
        const response = await axios.get<Curso>(
          `http://localhost:3000/cursos/${id}`
        );
        setNombreCurso(response.data.nombre_curso); // Asigna el nombre del curso al estado
      } catch (error) {
        console.error("Error al obtener el curso:", error);
      }
    };

    fetchCurso();
  }, [id]);

  // Función para manejar el envío del formulario
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const nuevoModulo = {
      nombre_modulo: nombreModulo,
      descripcion_modulo: descripcionModulo,
      cursoId: id, // Asocia el módulo al curso mediante el ID
    };

    try {
      // Realizar solicitud POST a la API
      const response = await axios.post(
        `http://localhost:3000/cursos/${id}/modulos`,
        nuevoModulo
      );
      console.log("Módulo creado:", response.data);

      // Redirigir a la página del curso donde se agregó el módulo
      navigate(`/vercurso/${id}`); // Cambia a la ruta correspondiente
    } catch (error) {
      console.error("Error al crear el módulo:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Agregar Nuevo Módulo
        </h2>

        {/* Mostrar el nombre del curso */}
        <p className="text-lg mb-4 text-center text-gray-700">
          Creando módulo para el curso:{" "}
          <span className="font-semibold">{nombreCurso}</span>
        </p>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Nombre del módulo */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="moduloNombre"
            >
              Nombre del Módulo
            </label>
            <input
              type="text"
              id="moduloNombre"
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej. Introducción a la Minería"
              value={nombreModulo}
              onChange={(e) => setNombreModulo(e.target.value)} // Actualiza el estado
              required
            />
          </div>

          {/* Descripción del módulo */}
          <div>
            <label
              className="block text-sm font-medium text-gray-700 mb-1"
              htmlFor="moduloDescripcion"
            >
              Descripción del Módulo
            </label>
            <textarea
              id="moduloDescripcion"
              rows={4}
              className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Descripción del módulo aquí..."
              value={descripcionModulo}
              onChange={(e) => setDescripcionModulo(e.target.value)} // Actualiza el estado
              required
            />
          </div>

          {/* Botones de volver y agregar */}
          <div className="flex justify-center space-x-2">
            <Link to={`/vercurso/${id}`}>
              <button
                type="button"
                className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
              >
                Volver
              </button>
            </Link>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Agregar Módulo
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Agregar_modulos;
