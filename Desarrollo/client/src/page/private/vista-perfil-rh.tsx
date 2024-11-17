import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { FileText } from "lucide-react";
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

interface Cumplimiento_leccion {
  usuarioId: string;
  leccionId: number;
  fecha_modificacion_estado: Date;
  estado: boolean;
}
interface Leccion {
  id_leccion: number;
  nombre_leccion: string;
  descripcion_leccion: string;
  estado_leccion: boolean;
  Cumplimiento_leccion: Cumplimiento_leccion[];
}

interface Modulo {
  id_modulo: number;
  nombre_modulo: string;
  lecciones: Leccion[];
}

interface Curso {
  id_curso: number;
  nombre_curso: string;
  descripcion_curso: string;
  modulos: Modulo[];
}

interface Usuario {
  rut: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  cursoAsignados: {
    fecha_asignacion: string;
    curso: Curso;
  }[];
}

export default function DetalleUsuarioLecciones() {
  const { id } = useParams<{ id: string }>();
  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [activeTab, setActiveTab] = useState("todos");

  const fetchUsuarioCursos = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarioLecciones/${id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      console.error("Error al cargar los cursos del usuario:", error);
    }
  };

  useEffect(() => {
    fetchUsuarioCursos();
  }, [id]);
  console.log(usuario);
  

  const generatePDF = () => {
    if (!usuario) return;

    const doc = new jsPDF();
    doc.setFontSize(18);
    doc.text('Informe de Cursos y Lecciones', 14, 22);

    usuario.cursoAsignados.forEach((cursoAsignado, index) => {
      const startY = 40 + index * 80;
      doc.setFontSize(14);
      doc.text(`Curso: ${cursoAsignado.curso.nombre_curso}`, 14, startY);
      doc.setFontSize(12);
      doc.text(cursoAsignado.curso.descripcion_curso, 14, startY + 10);

      const tableColumn = ["Lección", "Estado", "Progreso"];
      const tableRows = cursoAsignado.curso.modulos.flatMap((modulo) =>
        modulo.lecciones.map((leccion) => [
          leccion.nombre_leccion,
          leccion.estado_leccion ? "Completada" : "En Progreso",
          `${leccion.estado_leccion ? 100 : 50}%`, // Progreso simulado
        ])
      );

      doc.autoTable({
        startY: startY + 20,
        head: [tableColumn],
        body: tableRows,
      });
    });

    doc.save(`informe_cursos_lecciones_${usuario.nombre}.pdf`);
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Cursos Asignados a {usuario?.nombre} {usuario?.apellido_paterno} {usuario?.apellido_materno}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold">{usuario?.cursoAsignados.length}</p>
              <p className="text-sm text-muted-foreground">Total de Cursos</p>
            </div>
          </div>
          <div className="mt-4 flex justify-center">
            <Button onClick={generatePDF} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Generar Informe PDF
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Tabs defaultValue="todos">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="completadas">Completados</TabsTrigger>
              <TabsTrigger value="en_progreso">En Progreso</TabsTrigger>
              <TabsTrigger value="no_iniciadas">No Iniciados</TabsTrigger>
            </TabsList>

            <TabsContent value="todos">
              <ListaCursosFiltrados cursos={usuario?.cursoAsignados.map(ca => ca.curso) || []} filtro="todos" />
            </TabsContent>
            <TabsContent value="completadas">
              <ListaCursosFiltrados cursos={usuario?.cursoAsignados.map(ca => ca.curso) || []} filtro="completadas" />
            </TabsContent>
            <TabsContent value="en_progreso">
              <ListaCursosFiltrados cursos={usuario?.cursoAsignados.map(ca => ca.curso) || []} filtro="en_progreso" />
            </TabsContent>
            <TabsContent value="no_iniciadas">
              <ListaCursosFiltrados cursos={usuario?.cursoAsignados.map(ca => ca.curso) || []} filtro="no_iniciadas" />
            </TabsContent>
          </Tabs>

        </CardContent>
      </Card>
    </div>
  );
}

function ListaCursosFiltrados({ cursos, filtro }: { cursos: Curso[]; filtro: string }) {
  // Cálculo del progreso del curso
  const calcularProgresoCurso = (curso: Curso) => {
    const todasLasLecciones = curso.modulos.flatMap(modulo => modulo.lecciones);
    const totalLecciones = todasLasLecciones.length;
    const leccionesCompletadas = todasLasLecciones.filter(leccion => 
      leccion.Cumplimiento_leccion && 
      leccion.Cumplimiento_leccion.length > 0 && 
      leccion.Cumplimiento_leccion[0].estado
    ).length;

    return totalLecciones > 0 ? Math.round((leccionesCompletadas / totalLecciones) * 100) : 0;
  };

  // Filtrar cursos según su progreso
  const cursosFiltrados = cursos.filter(curso => {
    const progreso = calcularProgresoCurso(curso);
    
    switch (filtro) {
      case "completadas":
        return progreso === 100;
      case "en_progreso":
        return progreso > 0 && progreso < 100;
      case "no_iniciadas":
        return progreso === 0;
      default:
        return true; // "todos"
    }
  });

  return (
    <div className="space-y-4">
      {cursosFiltrados.map((curso) => {
        const progresoCurso = calcularProgresoCurso(curso);
        let estadoCurso = progresoCurso === 100 
          ? "completado"
          : progresoCurso > 0 
            ? "en_progreso" 
            : "no_iniciado";

        return (
          <Card key={curso.id_curso}>
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>{curso.nombre_curso}</CardTitle>
                <EstadoCursoBadge estado={estadoCurso} />
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progresoCurso} max={100} />
              <p className="mt-2 text-sm text-gray-600">
                {progresoCurso}% Progreso
              </p>
            </CardContent>
          </Card>
        );
      })}
      {cursosFiltrados.length === 0 && (
        <p className="text-center text-gray-500 py-4">
          No hay cursos {filtro === "completadas" ? "completados" : 
                        filtro === "en_progreso" ? "en progreso" : 
                        filtro === "no_iniciadas" ? "sin iniciar" : ""}
        </p>
      )}
    </div>
  );
}

function EstadoCursoBadge({ estado }) {
  const badgeVariants = {
    completado: "bg-green-500",
    en_progreso: "bg-yellow-500",
    no_iniciado: "bg-gray-500"
  }

  const badgeTexts = {
    completado: "Completado",
    en_progreso: "En Progreso",
    no_iniciado: "No Iniciado"
  }

  return (
    <Badge className={`${badgeVariants[estado]} text-white`}>
      {badgeTexts[estado]}
    </Badge>
  )
}
