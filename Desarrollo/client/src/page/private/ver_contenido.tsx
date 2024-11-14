import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { Button } from "../../components/ui/button";
import SubirContenido from "./subircontenido";
import { ReactSortable, Sortable, SortableEvent } from "react-sortablejs";
import "../../styles/sortable.css";

interface Contenido {
  id: number;
  id_contenido: number;
  nombre_archivo: string;
  indice_archivo: number;
  url: string;
  tipo_contenido:
    | "imagen"
    | "audio"
    | "pdf"
    | "video"
    | "word"
    | "excel"
    | "powerpoint";
  leccionId: number;
  fileExists: boolean;
}

const formatFileName = (fileName: string): string => {
  const parts = fileName.split("_");
  if (parts.length <= 1) return fileName;

  const nameWithExtension = parts.slice(1).join("_");

  const nameWithoutExtension = nameWithExtension.split(".")[0];

  return nameWithoutExtension;
};

// Definir el tipo para los elementos ordenables
interface SortableItem extends Contenido {
  chosen: boolean;
  selected: boolean;
}

export default function VerContenido() {
  const { leccionId } = useParams();
  const [contenidos, setContenidos] = useState<SortableItem[]>([]);
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showEditPopup, setShowEditPopup] = useState(false);
  const [editingContent, setEditingContent] = useState<Contenido | null>(null);
  const [newFileName, setNewFileName] = useState("");
  const [expandedContent, setExpandedContent] = useState<number | null>(null);

  const fetchContenidos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/api/contenido/leccion/${leccionId}`
      );

      const contenidosExistentes = response.data
        .filter((contenido: Contenido) => contenido.fileExists)
        .map((contenido: Contenido) => ({
          ...contenido,
          chosen: false,
          selected: false,
        }));

      setContenidos(contenidosExistentes);
    } catch (error) {
      console.error("Error al obtener contenidos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContenidos();
  }, [leccionId]);

  const renderContenido = (contenido: Contenido) => {
    switch (contenido.tipo_contenido) {
      case "imagen":
        return (
          <img
            src={contenido.url}
            alt={contenido.nombre_archivo}
            className="w-full h-auto rounded-lg"
            onError={() => {
              const newContenidos = contenidos.filter(
                (c) => c.id_contenido !== contenido.id_contenido
              );
              setContenidos(newContenidos);
            }}
          />
        );
      case "audio":
        return (
          <audio
            controls
            className="w-full"
            onError={() => {
              const newContenidos = contenidos.filter(
                (c) => c.id_contenido !== contenido.id_contenido
              );
              setContenidos(newContenidos);
            }}
          >
            <source src={contenido.url} type="audio/mpeg" />
            Tu navegador no soporta el elemento de audio.
          </audio>
        );
      case "video":
        return (
          <div className="flex flex-col gap-2">
            <video
              controls
              className="w-full rounded-lg"
              onError={() => {
                const newContenidos = contenidos.filter(
                  (c) => c.id_contenido !== contenido.id_contenido
                );
                setContenidos(newContenidos);
              }}
            >
              <source src={contenido.url} type="video/mp4" />
              Tu navegador no soporta el elemento de video.
            </video>
            <Button
              onClick={() =>
                window.open(
                  `http://localhost:3000/api/contenido/view/${encodeURIComponent(
                    contenido.nombre_archivo
                  )}`,
                  "_blank"
                )
              }
              className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            >
              Ver en pantalla completa
            </Button>
          </div>
        );
      case "pdf":
        return (
          <div className="flex flex-col gap-2">
            <div className="w-[600px] md:w-full">
              <iframe
                src={contenido.url}
                title={contenido.nombre_archivo}
                className="w-full h-full rounded-lg"
                onError={() => {
                  const newContenidos = contenidos.filter(
                    (c) => c.id_contenido !== contenido.id_contenido
                  );
                  setContenidos(newContenidos);
                }}
              />
            </div>
            <Button
              onClick={() =>
                window.open(
                  `http://localhost:3000/api/contenido/view/${encodeURIComponent(
                    contenido.nombre_archivo
                  )}`,
                  "_blank"
                )
              }
              className="bg-blue-500 hover:bg-blue-600 text-white w-full"
            >
              Ver PDF en pantalla completa
            </Button>
          </div>
        );
      case "word":
      case "excel":
      case "powerpoint":
        return (
          <div className="flex flex-col gap-2">
            <div className="w-full h-[400px]">
              <iframe
                src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(
                  contenido.url
                )}`}
                title={contenido.nombre_archivo}
                className="w-full h-full rounded-lg"
                onError={() => {
                  const newContenidos = contenidos.filter(
                    (c) => c.id_contenido !== contenido.id_contenido
                  );
                  setContenidos(newContenidos);
                }}
              />
            </div>
            <div className="flex gap-2">
              <Button
                onClick={() => window.open(contenido.url, "_blank")}
                className="bg-blue-500 hover:bg-blue-600 text-white flex-1"
              >
                Descargar documento
              </Button>
              <Button
                onClick={() =>
                  window.open(
                    `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(
                      contenido.url
                    )}`,
                    "_blank"
                  )
                }
                className="bg-green-500 hover:bg-green-600 text-white flex-1"
              >
                Ver en pantalla completa
              </Button>
            </div>
          </div>
        );
      default:
        return <p>Tipo de contenido no soportado</p>;
    }
  };

  const handleEdit = (contenido: Contenido) => {
    setEditingContent(contenido);
    const nombreArchivo = formatFileName(contenido.nombre_archivo);
    setNewFileName(nombreArchivo);
    setShowEditPopup(true);
  };

  const handleSaveEdit = async () => {
    if (!editingContent) {
      console.error("No hay contenido seleccionado para editar");
      return;
    }

    try {
      const extension = editingContent.nombre_archivo.split(".").pop();
      const newFileNameWithExtension = `${newFileName}.${extension}`;
      const response = await axios.put(
        `http://localhost:3000/api/contenido/${editingContent.id_contenido}/rename`,
        {
          newFileName: newFileNameWithExtension,
        }
      );

      if (response.status === 200) {
        await fetchContenidos();
        setShowEditPopup(false);
        setEditingContent(null);
        setNewFileName("");
      }
    } catch (error) {
      console.error("Error al renombrar archivo:", error);
    }
  };

  const handleDelete = async (contenido: Contenido) => {
    if (
      window.confirm("¿Estás seguro de que deseas eliminar este contenido?")
    ) {
      try {
        await axios.delete(
          `http://localhost:3000/api/contenido/${contenido.id_contenido}`
        );
        await fetchContenidos();
      } catch (error) {
        console.error("Error al eliminar contenido:", error);
      }
    }
  };

  const handleSort = async (newOrder: SortableItem[]) => {
    setContenidos(newOrder);

    try {
      // Actualizar índices en el backend
      const updates = newOrder.map((contenido, index) => ({
        id_contenido: contenido.id_contenido,
        indice_archivo: index + 1,
      }));

      await axios.put(`http://localhost:3000/api/contenido/reorder`, {
        updates,
      });
    } catch (error) {
      console.error("Error al reordenar contenidos:", error);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Cargando contenidos...</div>;
  }

  return (
    <div className="h-screen flex flex-col p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contenido de la Lección</h1>
        <Button
          onClick={() => setShowPopup(true)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          Agregar Contenido
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contenidos.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No hay contenido disponible</p>
          </div>
        ) : (
          <ReactSortable<SortableItem>
            list={contenidos}
            setList={handleSort}
            className="flex flex-col gap-2"
            animation={200}
            handle=".drag-handle"
          >
            {contenidos.map((contenido) => (
              <div
                key={contenido.id_contenido}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <div className="p-4">
                  {/* Cabecera del item */}
                  <div className="flex items-center gap-4">
                    <div className="drag-handle cursor-move text-gray-400 hover:text-gray-600">
                      <i className="fas fa-grip-vertical text-xl"></i>
                    </div>

                    <div className="flex-1">
                      <span className="font-medium">
                        {formatFileName(contenido.nombre_archivo)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({contenido.tipo_contenido})
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        onClick={() =>
                          setExpandedContent(
                            expandedContent === contenido.id_contenido
                              ? null
                              : contenido.id_contenido
                          )
                        }
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-3 py-1.5"
                        size="sm"
                      >
                        {expandedContent === contenido.id_contenido ? (
                          <>
                            <i className="fas fa-chevron-up mr-2"></i>Ocultar
                          </>
                        ) : (
                          <>
                            <i className="fas fa-chevron-down mr-2"></i>Ver
                          </>
                        )}
                      </Button>

                      <Button
                        onClick={() => handleEdit(contenido)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1.5"
                        size="sm"
                      >
                        <i className="fas fa-edit"></i>
                      </Button>

                      <Button
                        onClick={() => handleDelete(contenido)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5"
                        size="sm"
                      >
                        <i className="fas fa-trash"></i>
                      </Button>
                    </div>
                  </div>

                  {/* Contenido expandible */}
                  {expandedContent === contenido.id_contenido && (
                    <div className="mt-4 border-t pt-4">
                      {renderContenido(contenido)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </ReactSortable>
        )}
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-2xl">
            <SubirContenido
              leccionId={leccionId}
              onClose={() => setShowPopup(false)}
              onSuccess={() => {
                setShowPopup(false);
                fetchContenidos();
              }}
            />
          </div>
        </div>
      )}

      {showEditPopup && editingContent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              Editar nombre del archivo
            </h2>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del archivo
              </label>
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                onClick={() => setShowEditPopup(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white"
              >
                Cancelar
              </Button>
              <Button
                onClick={handleSaveEdit}
                className="bg-blue-500 hover:bg-blue-600 text-white"
              >
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
