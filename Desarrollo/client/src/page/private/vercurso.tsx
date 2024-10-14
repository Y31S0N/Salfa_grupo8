import { useState } from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@radix-ui/react-accordion";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { ChevronRight, FileText, Folder, Video } from "lucide-react";

// Tipos para la estructura del curso
type Contenido = { tipo: "archivo" | "video"; nombre: string; url: string };
type Leccion = { nombre: string; descripcion: string; contenidos: Contenido[] };
type Modulo = { nombre: string; descripcion: string; lecciones: Leccion[] };
type Curso = {
  nombre: string;
  descripcion: string;
  imagenUrl: string;
  modulos: Modulo[];
};

// Datos de ejemplo del curso
const cursoDePrueba: Curso = {
  nombre: "Mantenimiento de maquinaria",
  descripcion:
    "Aprende las técnicas más avanzadas para el mantenimiento de maquinaria industrial.",
  imagenUrl: "/placeholder.svg?height=400&width=800",
  modulos: [
    {
      nombre: "Contenido del curso",
      descripcion: "Descripción general de los contenidos del curso.",
      lecciones: [
        {
          nombre: "Introducción al curso",
          descripcion:
            "Una breve introducción sobre lo que se cubre en el curso.",
          contenidos: [
            {
              tipo: "video",
              nombre: "Bienvenida al curso",
              url: "/videos/bienvenida.mp4",
            },
            {
              tipo: "archivo",
              nombre: "Guía del estudiante",
              url: "/docs/guia-estudiante.pdf",
            },
          ],
        },
        {
          nombre: "Objetivos de aprendizaje",
          descripcion:
            "Los principales objetivos que se espera lograr al finalizar el curso.",
          contenidos: [
            {
              tipo: "archivo",
              nombre: "Metas del curso",
              url: "/docs/metas-curso.pdf",
            },
          ],
        },
      ],
    },
    {
      nombre: "Fundamentos de mantenimiento",
      descripcion:
        "Este módulo cubre los conceptos básicos de mantenimiento industrial.",
      lecciones: [
        {
          nombre: "Conceptos básicos",
          descripcion:
            "Definición de los conceptos clave en el mantenimiento industrial.",
          contenidos: [
            {
              tipo: "video",
              nombre: "¿Qué es el mantenimiento industrial?",
              url: "/videos/intro-mantenimiento.mp4",
            },
            {
              tipo: "archivo",
              nombre: "Tipos de mantenimiento",
              url: "/docs/tipos-mantenimiento.pdf",
            },
          ],
        },
        {
          nombre: "Herramientas y equipos",
          descripcion:
            "Herramientas esenciales para el mantenimiento industrial.",
          contenidos: [
            {
              tipo: "video",
              nombre: "Herramientas esenciales",
              url: "/videos/herramientas-basicas.mp4",
            },
            {
              tipo: "archivo",
              nombre: "Guía de uso de herramientas",
              url: "/docs/guia-herramientas.pdf",
            },
          ],
        },
      ],
    },
    {
      nombre: "Mantenimiento preventivo",
      descripcion:
        "Este módulo trata sobre las mejores prácticas de mantenimiento preventivo.",
      lecciones: [
        {
          nombre: "Planificación del mantenimiento",
          descripcion:
            "Cómo planificar las tareas de mantenimiento preventivo.",
          contenidos: [
            {
              tipo: "video",
              nombre: "Creación de planes de mantenimiento",
              url: "/videos/planes-mantenimiento.mp4",
            },
            {
              tipo: "archivo",
              nombre: "Plantillas de planificación",
              url: "/docs/plantillas-mantenimiento.pdf",
            },
          ],
        },
        {
          nombre: "Inspecciones rutinarias",
          descripcion:
            "Realización de inspecciones periódicas para asegurar el funcionamiento.",
          contenidos: [
            {
              tipo: "video",
              nombre: "Técnicas de inspección",
              url: "/videos/tecnicas-inspeccion.mp4",
            },
            {
              tipo: "archivo",
              nombre: "Checklist de inspección",
              url: "/docs/checklist-inspeccion.pdf",
            },
          ],
        },
      ],
    },
    {
      nombre: "Mantenimiento correctivo",
      descripcion:
        "Este módulo se centra en la reparación y el diagnóstico de fallas.",
      lecciones: [
        {
          nombre: "Diagnóstico de fallas",
          descripcion: "Métodos para identificar fallas en equipos.",
          contenidos: [
            {
              tipo: "video",
              nombre: "Métodos de diagnóstico",
              url: "/videos/metodos-diagnostico.mp4",
            },
            {
              tipo: "archivo",
              nombre: "Informe de diagnóstico",
              url: "/docs/informe-diagnostico.pdf",
            },
          ],
        },
      ],
    },
    {
      nombre: "Gestión del mantenimiento",
      descripcion:
        "Estrategias para gestionar eficientemente las actividades de mantenimiento.",
      lecciones: [
        {
          nombre: "Estrategias de gestión",
          descripcion: "Mejoras en la gestión del mantenimiento.",
          contenidos: [
            {
              tipo: "video",
              nombre: "Mejoras en la gestión",
              url: "/videos/mejoras-gestion.mp4",
            },
            {
              tipo: "archivo",
              nombre: "Guía de gestión del mantenimiento",
              url: "/docs/guia-gestion.pdf",
            },
          ],
        },
      ],
    },
  ],
};

export default function Vercurso() {
  const [cursoActual] = useState<Curso>(cursoDePrueba);
  const [leccionSeleccionada, setLeccionSeleccionada] =
    useState<Leccion | null>(null);
  const [moduloSeleccionado, setModuloSeleccionado] = useState<Modulo | null>(
    null
  );

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6 overflow-hidden">
        <CardHeader>
          <CardTitle>{cursoActual.nombre}</CardTitle>
          <CardDescription>{cursoActual.descripcion}</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tarjeta de Módulos del Curso a la izquierda */}
        <Card className="md:col-span-1">
          <CardHeader>
            <CardTitle>Módulos del Curso</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {cursoActual.modulos.map((modulo, moduloIndex) => (
                <AccordionItem
                  value={`modulo-${moduloIndex}`}
                  key={moduloIndex}
                >
                  <AccordionTrigger
                    onClick={() => setModuloSeleccionado(modulo)}
                    className="flex items-center p-2 cursor-pointer hover:bg-gray-200 transition-colors"
                  >
                    <Folder className="mr-2" size={18} />
                    {modulo.nombre}
                  </AccordionTrigger>
                  <AccordionContent>
                    {modulo.lecciones.map((leccion, leccionIndex) => (
                      <div key={leccionIndex} className="mb-4">
                        <Button
                          variant="ghost"
                          className="w-full justify-start pl-6 mb-1"
                          onClick={() => setLeccionSeleccionada(leccion)}
                        >
                          <ChevronRight className="mr-2" size={18} />
                          {leccion.nombre}
                        </Button>
                        {/* Descripción de la lección debajo del nombre */}
                        <p className="pl-8 text-gray-600">
                          {leccion.descripcion}
                        </p>
                      </div>
                    ))}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>

        {/* Sección de contenido a la derecha */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>
              {leccionSeleccionada
                ? leccionSeleccionada.nombre
                : "Selecciona una lección"}
            </CardTitle>
            {moduloSeleccionado && (
              <CardDescription>
                {moduloSeleccionado.descripcion}
              </CardDescription>
            )}
          </CardHeader>
          <CardContent>
            {leccionSeleccionada ? (
              <ul className="list-disc pl-5">
                {leccionSeleccionada.contenidos.map((contenido, index) => (
                  <li key={index} className="flex items-center">
                    {contenido.tipo === "archivo" ? (
                      <FileText className="mr-2" size={18} />
                    ) : (
                      <Video className="mr-2" size={18} />
                    )}
                    <a
                      href={contenido.url}
                      className="text-blue-600 hover:underline"
                    >
                      {contenido.nombre}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>Selecciona una lección para ver su contenido.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
