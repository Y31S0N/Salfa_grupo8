import React from "react";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import axios from "axios";
import { Folder, ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Toggle } from "../../components/ui/toggle";
import { toast } from "sonner";
import Swal from "sweetalert2";

type Curso = {
  id_curso: number;
  nombre_curso: string;
  descripcion_curso: string;
  fecha_creacion: string;
  fecha_limite?: string | null;
  estado_curso: boolean;
};

type Modulo = {
  id_modulo: number;
  nombre_modulo: string;
  descripcion_modulo: string;
  cursoId: number;
  estado_modulo: boolean;
};

type Leccion = {
  id_leccion: number;
  nombre_leccion: string;
  descripcion_leccion: string;
  estado_leccion: boolean;
};

export default function Vercurso() {
  const { id } = useParams<{ id: string }>();

  const navigate = useNavigate();
  const [curso, setCurso] = useState<Curso | null>(null);
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [lecciones, setLecciones] = useState<{ [key: number]: Leccion[] }>({});
  const [expandedModulo, setExpandedModulo] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const obtenerCursoYModulos = async () => {
      if (id) {
        setLoading(true);
        try {
          const cursoResponse = await axios.get<Curso>(
            `http://localhost:3000/cursos/${id}`
          );
          setCurso(cursoResponse.data);

          const modulosResponse = await axios.get<Modulo[]>(
            `http://localhost:3000/cursos/${id}/modulos`
          );
          setModulos(modulosResponse.data);
        } catch (error) {
          setError(
            "Error al obtener el curso y los módulos. Por favor, intenta nuevamente."
          );
          console.error("Error al obtener el curso y los módulos:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    obtenerCursoYModulos();
  }, [id]);

  const handleModuloClick = async (moduloId: number) => {
    if (expandedModulo === moduloId) {
      setExpandedModulo(null);
    } else {
      setExpandedModulo(moduloId);
      try {
        const leccionesResponse = await axios.get<Leccion[]>(
          `http://localhost:3000/modulos/${moduloId}/lecciones`
        );
        setLecciones((prev) => ({
          ...prev,
          [moduloId]: leccionesResponse.data,
        }));
      } catch (error) {
        console.error("Error al obtener las lecciones:", error);
      }
    }
  };
  const handleToggleModulo = async (
    moduloId: number,
    estadoActual: boolean
  ) => {
    try {
      await axios.put(`http://localhost:3000/modulos/${moduloId}`, {
        estado_modulo: !estadoActual,
      });

      setModulos(
        modulos.map((modulo) =>
          modulo.id_modulo === moduloId
            ? { ...modulo, estado_modulo: !estadoActual }
            : modulo
        )
      );

      toast.success(
        `Módulo ${!estadoActual ? "habilitado" : "deshabilitado"} correctamente`
      );
    } catch (error) {
      console.error("Error al cambiar estado del módulo:", error);
      toast.error("Error al cambiar el estado del módulo");
    }
  };

  const handleToggleLeccion = async (
    leccionId: number,
    estadoActual: boolean
  ) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/lecciones/${leccionId}/toggle`,
        {
          estado_leccion: !estadoActual,
        }
      );

      if (response.data.success) {
        setLecciones((prevLecciones) => ({
          ...prevLecciones,
          [expandedModulo!]: prevLecciones[expandedModulo!].map((leccion) =>
            leccion.id_leccion === leccionId
              ? { ...leccion, estado_leccion: !estadoActual }
              : leccion
          ),
        }));

        toast.success(response.data.message);
      }
    } catch (error) {
      console.error("Error al cambiar estado de la lección:", error);
      toast.error("Error al cambiar el estado de la lección");
    }
  };

  if (loading) {
    return <p>Cargando curso y módulos...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  if (!curso) {
    return <p>No se encontró el curso.</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{curso.nombre_curso}</CardTitle>
          <CardDescription>{curso.descripcion_curso}</CardDescription>
        </CardHeader>
        <CardContent>
          <p>
            <strong>Fecha de creación:</strong>{" "}
            {new Date(curso.fecha_creacion).toLocaleDateString()}
          </p>
          {curso.fecha_limite && (
            <p>
              <strong>Fecha límite:</strong>{" "}
              {new Date(curso.fecha_limite).toLocaleDateString()}
            </p>
          )}
          <p>
            <strong>Estado:</strong>{" "}
            {curso.estado_curso ? "Habilitado" : "Deshabilitado"}
          </p>
        </CardContent>
      </Card>

      <Card className="mt-4 overflow-x-auto">
        <CardHeader>
          <div className="flex items-center justify-between min-w-[600px]">
            <CardTitle>Módulos del Curso</CardTitle>
            <div className="flex justify-end gap-2 p-2">
              <Button
                className="bg-green-500 text-white hover:bg-green-600 w-[150px]"
                onClick={() => navigate(`/cursos/${id}/agregar_modulos`)}
              >
                Agregar módulo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {modulos.length > 0 ? (
            <div className="space-y-2 min-w-[600px]">
              {modulos.map((modulo) => (
                <div key={modulo.id_modulo}>
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => handleModuloClick(modulo.id_modulo)}
                  >
                    <div className="flex items-center">
                      <Folder className="mr-2" size={18} />
                      <strong className="truncate break-all text-ellipsis">
                        {modulo.nombre_modulo}
                      </strong>
                    </div>
                    {expandedModulo === modulo.id_modulo ? (
                      <ChevronDown className="ml-2" />
                    ) : (
                      <ChevronRight className="ml-2" />
                    )}
                  </div>

                  {expandedModulo === modulo.id_modulo &&
                    lecciones[modulo.id_modulo] && (
                      <div className="ml-4 mt-2 pl-4 border-l-2 border-gray-300">
                        <div className="flex justify-end gap-2 p-2">
                          <Toggle
                            pressed={modulo.estado_modulo}
                            onPressedChange={() =>
                              handleToggleModulo(
                                modulo.id_modulo,
                                modulo.estado_modulo
                              )
                            }
                            className={`w-[150px] ${
                              modulo.estado_modulo
                                ? "bg-green-500 text-white hover:bg-green-600"
                                : "bg-red-500 text-white hover:bg-red-600"
                            }`}
                          >
                            {modulo.estado_modulo
                              ? "Habilitado"
                              : "Deshabilitado"}
                          </Toggle>
                          <Button
                            className="bg-green-500 text-white hover:bg-green-600 w-[150px]"
                            onClick={() =>
                              navigate(
                                `/cursos/${id}/modulos/${modulo.id_modulo}/agregar_lecciones`
                              )
                            }
                          >
                            Agregar lección
                          </Button>
                          <Button
                            className="bg-yellow-500 text-white hover:bg-yellow-600 w-[150px]"
                            onClick={() =>
                              navigate(
                                `/cursos/${id}/modulos/${modulo.id_modulo}/modificar`
                              )
                            }
                          >
                            Modificar
                          </Button>
                        </div>
                        {lecciones[modulo.id_modulo].map((leccion) => (
                          <div
                            key={leccion.id_leccion}
                            className="flex items-center justify-between hover:bg-gray-100 cursor-pointer p-2 rounded"
                            onClick={() =>
                              navigate(
                                `/ver_contenido/${curso.id_curso}/${modulo.id_modulo}/${leccion.id_leccion}`
                              )
                            }
                          >
                            <span className="mr-2 truncate">
                              • {leccion.nombre_leccion}
                            </span>
                            <div
                              className="flex justify-end gap-2 p-2"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Button
                                onClick={() =>
                                  handleToggleLeccion(
                                    leccion.id_leccion,
                                    Boolean(leccion.estado_leccion)
                                  )
                                }
                                className={`w-[150px] ${
                                  leccion.estado_leccion
                                    ? "bg-green-500 text-white hover:bg-green-600"
                                    : "bg-red-500 text-white hover:bg-red-600"
                                }`}
                              >
                                {leccion.estado_leccion
                                  ? "Habilitado"
                                  : "Deshabilitado"}
                              </Button>
                              <Button
                                className="bg-yellow-500 text-white hover:bg-yellow-600 w-[150px]"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  navigate(
                                    `/cursos/${id}/modulos/${modulo.id_modulo}/modificar_lecciones/${leccion.id_leccion}`
                                  );
                                }}
                              >
                                Modificar
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
              ))}
            </div>
          ) : (
            <p>No hay módulos disponibles para este curso.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
