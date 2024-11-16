import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Mail, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import React, { useEffect, useState } from "react";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/ui/button";
import { toast } from "sonner";
import { toast } from 'sonner'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
// import { Progress } from "@/components/ui/progress";
import { LayoutList, LayoutGrid } from "lucide-react";

// IMÁGENES
import capacitacion from "../../assets/capacitacion.png";
import mantenimiento from "../../assets/mantenimiento.png";
import seguridad from "../../assets/seguridad.png";

const worker = {
  name: "José Barra",
  position: "Ingeniero de Mantenimiento",
  email: "jo.barra@salfamantenciones.com",
  // phone: "+569",
  location: "Talca, Chile",
  avatar: "/placeholder.svg?height=100&width=100",
};

type Leccion = {
  id: number;
  title: string;
  completed: boolean;
};

type Modulo = {
type Modulo = {
  id: number;
  title: string;
  lecciones: Leccion[];
};

type Curso = {
  id_curso: number;
  nombre_curso: string;
  descripcion_curso: string;
  fecha_limite: string;
  modulos: Modulo[];
};

import { useUser } from "../../contexts/UserContext";

export default function PerfilUsuario({}) {
  const [filter, setFilter] = useState<"all" | "completed" | "incomplete">(
    "all"
  );

  const { user } = useUser();


  const { user } = useUser();

  const [view, setView] = useState<"list" | "grid">("grid");
  const [isLoading, setIsLoading] = useState(true);
  const [cursos, setCursos] = useState<Curso[]>([]);

  // CARGA DE USUARIOS Y CURSOS
  const cargarCursos = async (userRut) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:3000/api/cursosUsuario/${userRut}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      data.sort((a, b) => a.nombre_curso.localeCompare(b.nombre_curso));
      setCursos(data);
    } catch (error) {
      console.error("Error al cargar cursos:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user?.rut) {
      cargarCursos(user.rut);
    }
  }, [user?.rut]);

  const isCourseCompleted = (course: Curso) => {
    return course.modulos.every((modulo) =>
      modulo.lecciones.every((lesson) => lesson.completed)
    );
  };

  const filteredCourses = cursos.filter((course) => {
    // if (filter === "all") return true;
    // // if (filter === "completed") return isCourseCompleted(course);
    // // if (filter === "incomplete") return !isCourseCompleted(course);
  const filteredCourses = cursos.filter((course) => {
    // if (filter === "all") return true;
    // // if (filter === "completed") return isCourseCompleted(course);
    // // if (filter === "incomplete") return !isCourseCompleted(course);
    return true;
  });

  return (
    <>
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            <Avatar className="w-24 h-24">
              <AvatarImage src={user?.nombre} alt={user?.nombre} />
              <AvatarImage src={user?.nombre} alt={user?.nombre} />
              <AvatarFallback>
                {((user?.nombre || "") + (user?.apellido_paterno || ""))
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="text-center md:text-left">
              <h1 className="text-2xl font-bold">
                {user?.nombre || ""} {user?.apellido_paterno || ""}{" "}
                {user?.apellido_materno || ""}
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
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Cursos Completados
          </CardTitle>
          <CardTitle></CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {/* {coursesData.filter(isCourseCompleted).length}/{coursesData.length} PINTADO */}
          </div>
        </CardContent>
      </Card>

      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Mis Cursos</h1>

        <div className="flex justify-between items-center mb-4">
          <Select
            onValueChange={(value: "all" | "completed" | "incomplete") =>
              setFilter(value)
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar cursos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los cursos</SelectItem>
              <SelectItem value="completed">Completados</SelectItem>
              <SelectItem value="incomplete">No completados</SelectItem>
            </SelectContent>
          </Select>

          <div className="space-x-2">
            <Button
              variant={view === "list" ? "default" : "outline"}
              onClick={() => setView("list")}
            >
              <LayoutList className="h-4 w-4 mr-2" />
              Lista
            </Button>
            <Button
              variant={view === "grid" ? "default" : "outline"}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Cuadrícula
            </Button>
          </div>
        </div>

        <div
          className={`grid gap-4 ${view === "grid" ? "sm:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"
            }`}
        >
          {cursos.map((course) => (
            <Card key={course.id_curso}>
              <CardHeader>
                <img
                  src={capacitacion}
                  alt={course.nombre_curso}
                  className="w-full h-40 object-cover mb-4 rounded-md"
                />
                <CardTitle>{course.nombre_curso}</CardTitle>
                <CardDescription>{course.descripcion_curso}</CardDescription>
              </CardHeader>
              <CardContent>
                {/* <p className="text-sm mt-2">
                  Módulos: {course.modulos.length} | Lecciones:{" "}
                  {course.modulos.reduce(
                    (acc, module) => acc + module.lecciones.length,
                    0
                  )}
                </p> */}
              </CardContent>
              <CardFooter>
                <Link to={`/verCursoUsuario/${course.id_curso}`}>
                  <Button variant="outline">Ver detalles</Button>
                </Link>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}
