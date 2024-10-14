import { useState } from "react";
import { Link } from "react-router-dom";

// Definición de las interfaces
interface Contenido {
  archivo: File | null;
  url: string;
  tipoArchivo: "video" | "documento" | "imagen";
}

interface Leccion {
  id: number;
  nombre: string;
  contenidos: Contenido[];
  habilitado: boolean; // Nueva propiedad para habilitar/deshabilitar
}

interface Modulo {
  id: number;
  nombre: string;
  descripcion: string;
  lecciones: Leccion[];
  habilitado: boolean; // Nueva propiedad para habilitar/deshabilitar
}

interface Curso {
  nombre: string;
  descripcion: string;
  fechaLimite: string;
  modulos: Modulo[];
}

// Simulación de los datos existentes
const cursoData: Curso = {
  nombre: "Curso de Capacitación Minera",
  descripcion: "Este es un curso sobre prácticas de seguridad minera.",
  fechaLimite: "2024-12-31",
  modulos: [
    {
      id: 1,
      nombre: "Módulo 1: Introducción",
      descripcion: "Introducción al curso y conceptos básicos.",
      lecciones: [
        {
          id: 1,
          nombre: "Lección 1",
          contenidos: [{ archivo: null, url: "", tipoArchivo: "video" }],
          habilitado: true,
        },
        {
          id: 2,
          nombre: "Lección 2",
          contenidos: [
            {
              archivo: null,
              url: "https://example.com",
              tipoArchivo: "documento",
            },
          ],
          habilitado: true,
        },
      ],
      habilitado: true,
    },
    {
      id: 2,
      nombre: "Módulo 2: Técnicas Avanzadas",
      descripcion: "Técnicas avanzadas de operación.",
      lecciones: [
        {
          id: 1,
          nombre: "Lección 1",
          contenidos: [{ archivo: null, url: "", tipoArchivo: "imagen" }],
          habilitado: true,
        },
      ],
      habilitado: true,
    },
  ],
};

const Modificar_cursos = () => {
  const [curso, setCurso] = useState<Curso>(cursoData);
  const [modulos, setModulos] = useState<Modulo[]>(cursoData.modulos);

  const handleCursoChange = (
    field: "nombre" | "descripcion" | "fechaLimite",
    value: string
  ) => {
    setCurso({ ...curso, [field]: value });
  };

  const handleModuloChange = (
    moduloIndex: number,
    field: "nombre" | "descripcion",
    value: string
  ) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex][field] = value;
    setModulos(nuevosModulos);
  };

  const handleLeccionChange = (
    moduloIndex: number,
    leccionIndex: number,
    field: "nombre",
    value: string
  ) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex].lecciones[leccionIndex][field] = value;
    setModulos(nuevosModulos);
  };

  const handleContenidoChange = (
    moduloIndex: number,
    leccionIndex: number,
    contenidoIndex: number,
    field: keyof Contenido,
    value: string | File | null
  ) => {
    const nuevosModulos = [...modulos];

    if (field === "archivo") {
      nuevosModulos[moduloIndex].lecciones[leccionIndex].contenidos[
        contenidoIndex
      ].archivo = value as File | null;
    } else if (field === "url") {
      nuevosModulos[moduloIndex].lecciones[leccionIndex].contenidos[
        contenidoIndex
      ].url = value as string;
    } else if (field === "tipoArchivo") {
      nuevosModulos[moduloIndex].lecciones[leccionIndex].contenidos[
        contenidoIndex
      ].tipoArchivo = value as "video" | "documento" | "imagen";
    }

    setModulos(nuevosModulos);
  };

  // Maneja la habilitación/deshabilitación de un módulo
  const toggleModuloHabilitado = (moduloIndex: number) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex].habilitado =
      !nuevosModulos[moduloIndex].habilitado;
    setModulos(nuevosModulos);
  };

  // Maneja la habilitación/deshabilitación de una lección
  const toggleLeccionHabilitada = (
    moduloIndex: number,
    leccionIndex: number
  ) => {
    const nuevosModulos = [...modulos];
    nuevosModulos[moduloIndex].lecciones[leccionIndex].habilitado =
      !nuevosModulos[moduloIndex].lecciones[leccionIndex].habilitado;
    setModulos(nuevosModulos);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full">
        <h2 className="text-2xl font-bold mb-4 text-center">Editar Curso</h2>

        {/* Información general del curso */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nombre del Curso
          </label>
          <input
            type="text"
            value={curso.nombre}
            onChange={(e) => handleCursoChange("nombre", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descripción del Curso
          </label>
          <textarea
            value={curso.descripcion}
            onChange={(e) => handleCursoChange("descripcion", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Fecha Límite (opcional)
          </label>
          <input
            type="date"
            value={curso.fechaLimite}
            onChange={(e) => handleCursoChange("fechaLimite", e.target.value)}
            className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Listado de módulos y lecciones */}
        {modulos.map((modulo, moduloIndex) => (
          <div key={modulo.id} className="mb-6 border-b pb-4">
            <h3 className="text-xl font-bold mb-2">Módulo {moduloIndex + 1}</h3>

            {/* Nombre del módulo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre del Módulo
              </label>
              <input
                type="text"
                value={modulo.nombre}
                onChange={(e) =>
                  handleModuloChange(moduloIndex, "nombre", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Descripción del módulo */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Descripción del Módulo
              </label>
              <textarea
                value={modulo.descripcion}
                onChange={(e) =>
                  handleModuloChange(moduloIndex, "descripcion", e.target.value)
                }
                className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Botón para habilitar/deshabilitar módulo */}
            <button
              onClick={() => toggleModuloHabilitado(moduloIndex)}
              className={`bg-${
                modulo.habilitado ? "red" : "green"
              }-500 text-white rounded-lg py-2 px-4 mb-4`}
            >
              {modulo.habilitado ? "Deshabilitar Módulo" : "Habilitar Módulo"}
            </button>

            {/* Lecciones del módulo */}
            {modulo.lecciones.map((leccion, leccionIndex) => (
              <div key={leccion.id} className="mb-4">
                <h4 className="font-semibold">Lección {leccionIndex + 1}</h4>

                {/* Nombre de la lección */}
                <div className="mb-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nombre de la Lección
                  </label>
                  <input
                    type="text"
                    value={leccion.nombre}
                    onChange={(e) =>
                      handleLeccionChange(
                        moduloIndex,
                        leccionIndex,
                        "nombre",
                        e.target.value
                      )
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Botón para habilitar/deshabilitar lección */}
                <button
                  onClick={() =>
                    toggleLeccionHabilitada(moduloIndex, leccionIndex)
                  }
                  className={`bg-${
                    leccion.habilitado ? "red" : "green"
                  }-500 text-white rounded-lg py-1 px-3`}
                >
                  {leccion.habilitado
                    ? "Deshabilitar lección"
                    : "Habilitar Lección"}
                </button>

                {/* Contenidos de la lección */}
                {leccion.contenidos.map((contenido, contenidoIndex) => (
                  <div
                    key={contenidoIndex}
                    className="mt-2 p-2 border border-gray-300 rounded-lg"
                  >
                    <h5 className="font-medium">
                      Contenido {contenidoIndex + 1}
                    </h5>

                    {/* Archivo */}
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Archivo
                      </label>
                      <input
                        type="file"
                        onChange={(e) =>
                          handleContenidoChange(
                            moduloIndex,
                            leccionIndex,
                            contenidoIndex,
                            "archivo",
                            e.target.files?.[0] || null
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* URL */}
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        URL
                      </label>
                      <input
                        type="text"
                        value={contenido.url}
                        onChange={(e) =>
                          handleContenidoChange(
                            moduloIndex,
                            leccionIndex,
                            contenidoIndex,
                            "url",
                            e.target.value
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Tipo de archivo */}
                    <div className="mb-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Tipo de Archivo
                      </label>
                      <select
                        value={contenido.tipoArchivo}
                        onChange={(e) =>
                          handleContenidoChange(
                            moduloIndex,
                            leccionIndex,
                            contenidoIndex,
                            "tipoArchivo",
                            e.target.value as "video" | "documento" | "imagen"
                          )
                        }
                        className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="video">Video</option>
                        <option value="documento">Documento</option>
                        <option value="imagen">Imagen</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        ))}

        {/* Botones de acción */}
        <div className="flex justify-between mt-6">
          <Link
            to="/listado_cursos"
            className="bg-gray-500 text-white rounded-lg py-2 px-4"
          >
            Volver
          </Link>
          <Link
            to="/listado_cursos"
            className="bg-blue-500 text-white rounded-lg py-2 px-4"
          >
            Guardar Cambios
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Modificar_cursos;
