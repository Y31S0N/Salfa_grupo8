import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import capacitacion from "@/assets/capacitacion.png";
import Swal from "sweetalert2";
import { PublishAlert } from "../../components/ui/mensaje_alerta";
import { SearchBar } from "../../components/ui/barra_busqueda";

interface Curso {
  id_curso: number;
  nombre_curso: string;
  descripcion_curso: string;
  estado_curso: boolean;
  fecha_limite: string; // Agregar la fecha de vencimiento
}

interface CardProps {
  image: string;
  title: string;
  description: string;
  link: string;
  id_curso: number;
  estado_curso: boolean;
  fecha_vencimiento: string; // Agregar la fecha de vencimiento
  onToggle: (curso: Curso) => void;
}

// Componente de la carta
const Card: React.FC<CardProps> = ({
  image,
  title,
  description,
  link,
  id_curso,
  estado_curso,
  fecha_vencimiento,
  onToggle,
}) => {
  const handleToggle = () => {
    Swal.fire({
      title: `¿Estás seguro de ${
        estado_curso ? "deshabilitar" : "habilitar"
      } este curso?`,
      text: "Este cambio afectará la disponibilidad del curso para los usuarios.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: estado_curso ? "Sí, deshabilitar" : "Sí, habilitar",
      cancelButtonText: "Cancelar",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const response = await axios.put<Curso>(
            `http://localhost:3000/cursos/${id_curso}`,
            {
              estado_curso: !estado_curso,
            }
          );
          onToggle(response.data);

          Swal.fire(
            estado_curso ? "Deshabilitado" : "Habilitado",
            `El curso ha sido ${
              estado_curso ? "deshabilitado" : "habilitado"
            } correctamente.`,
            "success"
          );
        } catch (error) {
          console.error("Error al cambiar el estado del curso:", error);
          Swal.fire(
            "Error",
            "Hubo un problema al intentar cambiar el estado del curso.",
            "error"
          );
        }
      }
    });
  };

  return (
    <div className="max-w-md w-full bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden mb-6 flex flex-col h-full">
      <Link to={link}>
        <img className="w-full h-48 object-cover" src={image} alt={title} />
      </Link>
      <div className="p-4 flex flex-col flex-grow">
        <h5 className="text-xl font-semibold mb-2 break-words">{title}</h5>
        <p className="text-gray-700 break-words flex-grow">{description}</p>

        {/* Verificar si la fecha de vencimiento es válida */}
        {fecha_vencimiento && fecha_vencimiento !== null ? (
          <p className="text-sm font-bold text-gray-800 bg-yellow-100 border border-red-500 p-2 mb-4 rounded">
            Este curso dejará de estar disponible el:{" "}
            {new Date(fecha_vencimiento).toLocaleDateString("es-ES", {
              timeZone: "UTC",
            })}
          </p>
        ) : (
          <p className="text-sm font-bold text-gray-600 bg-green-100 border border-green-500 p-2 mb-4 rounded">
            Este curso no tiene fecha de vencimiento.
          </p>
        )}

        <div className="flex flex-col items-center mt-auto space-y-1">
          <PublishAlert onConfirm={() => console.log("Curso publicado")} />
          <Link to={`/modificar_curso/${id_curso}`}>
            <button className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm">
              Modificar
            </button>
          </Link>
          <button
            onClick={handleToggle}
            className={`bg-${
              estado_curso ? "red" : "green"
            }-500 text-white px-3 py-1 rounded hover:bg-${
              estado_curso ? "red" : "green"
            }-600 text-sm`}
          >
            {estado_curso ? "Deshabilitar" : "Habilitar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default function Listado_cursos() {
  const [cursos, setCursos] = useState<Curso[]>([]);
  const [filter, setFilter] = useState<
    "todos" | "habilitados" | "deshabilitados"
  >("habilitados");

  const handleSearch = (query: string) => {
    console.log("Buscando:", query);
  };

  const fetchCursos = async () => {
    try {
      const response = await axios.get<Curso[]>("http://localhost:3000/cursos");
      setCursos(response.data);
    } catch (error) {
      console.error("Error al obtener los cursos:", error);
    }
  };

  useEffect(() => {
    fetchCursos();
  }, []);

  const handleToggleCurso = (updatedCurso: Curso) => {
    setCursos((prevCursos) =>
      prevCursos.map((curso) =>
        curso.id_curso === updatedCurso.id_curso ? updatedCurso : curso
      )
    );
  };

  const filteredCursos = cursos.filter((curso) => {
    if (filter === "habilitados") return curso.estado_curso;
    if (filter === "deshabilitados") return !curso.estado_curso;
    return true;
  });

  return (
    <>
      <h2 className="text-2xl font-bold mb-4 text-center">
        Cursos disponibles
      </h2>
      <SearchBar onSearch={handleSearch} setFilter={setFilter} />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 justify-items-center">
        {filteredCursos.map((curso) => (
          <Card
            key={curso.id_curso}
            image={capacitacion}
            title={curso.nombre_curso}
            description={curso.descripcion_curso}
            link={`/vercurso/${curso.id_curso}`}
            id_curso={curso.id_curso}
            estado_curso={curso.estado_curso}
            fecha_vencimiento={curso.fecha_limite}
            onToggle={handleToggleCurso}
          />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <Link to="/agregar_cursos">
          <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            + Agregar Nuevo Curso
          </button>
        </Link>
      </div>
    </>
  );
}
