import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Progress } from "../../components/ui/progress";
import { Badge } from "../../components/ui/badge";
import { Button } from "../../components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { useUser } from "../../contexts/UserContext";
import { Avatar, AvatarFallback, AvatarImage } from "../../components/ui/avatar";
import { Mail } from "lucide-react";

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

export default function PerfilUsuario() {
  const { user } = useUser();
  const [usuario, setUsuario] = useState<Usuario | null>(null);

  const cargarCursos = async (userRut: string) => {
    try {
      const response = await fetch(`http://localhost:3000/api/usuarioLecciones/${userRut}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setUsuario(data);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    }
  };

  useEffect(() => {
    if (user?.rut) {
      cargarCursos(user.rut);
    }
  }, [user?.rut]);

  return (
    <>
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.nombre} alt={user?.nombre} />
              <AvatarFallback>
                {`${user?.nombre?.charAt(0) || ""}${user?.apellido_paterno?.charAt(0) || ""}`}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {user?.nombre} {user?.apellido_paterno} {user?.apellido_materno}
              </h1>
              <p className="text-muted-foreground">{user?.area}</p>
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-center md:justify-start gap-2">
                  <Mail className="w-4 h-4" />
                  <span>{user?.email}</span>
                </div>
              </div>
            </div>
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
              <ListaCursosFiltrados cursos={usuario?.cursoAsignados?.map(ca => ca.curso) || []} filtro="todos" />
            </TabsContent>
            <TabsContent value="completadas">
              <ListaCursosFiltrados cursos={usuario?.cursoAsignados?.map(ca => ca.curso) || []} filtro="completadas" />
            </TabsContent>
            <TabsContent value="en_progreso">
              <ListaCursosFiltrados cursos={usuario?.cursoAsignados?.map(ca => ca.curso) || []} filtro="en_progreso" />
            </TabsContent>
            <TabsContent value="no_iniciadas">
              <ListaCursosFiltrados cursos={usuario?.cursoAsignados?.map(ca => ca.curso) || []} filtro="no_iniciadas" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </>
  );
}

function ListaCursosFiltrados({ cursos, filtro }: { cursos: Curso[]; filtro: string }) {
  const calcularProgresoCurso = (curso: Curso) => {
    try {
      const todasLasLecciones = curso.modulos.flatMap(modulo => modulo.lecciones);
      const totalLecciones = todasLasLecciones.length;
      const leccionesCompletadas = todasLasLecciones.filter(leccion => 
        leccion.Cumplimiento_leccion && 
        leccion.Cumplimiento_leccion.length > 0 && 
        leccion.Cumplimiento_leccion[0].estado
      ).length;

      return totalLecciones > 0 ? Math.round((leccionesCompletadas / totalLecciones) * 100) : 0;
    } catch (error) {
      console.error("Error calculando progreso:", error);
      return 0;
    }
  };

  const cursosArray = Array.isArray(cursos) ? cursos : [];

  const cursosFiltrados = cursosArray.filter(curso => {
    const progreso = calcularProgresoCurso(curso);
    switch (filtro) {
      case "completadas": return progreso === 100;
      case "en_progreso": return progreso > 0 && progreso < 100;
      case "no_iniciadas": return progreso === 0;
      default: return true;
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
                <div className="flex items-center gap-4">
                  <EstadoCursoBadge estado={estadoCurso} />
                  <Link to={`/verCursoUsuario/${curso.id_curso}`}>
                    <Button variant="outline">Ver Curso</Button>
                  </Link>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Progress value={progresoCurso} max={100} />
              <p className="mt-2 text-sm text-gray-600">
                {progresoCurso}% Completado
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
