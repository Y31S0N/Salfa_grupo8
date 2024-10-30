import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import React from "react";

// Definir tipos para los cursos y el usuario
interface Curso {
  id: number;
  nombre: string;
  estado: "completado" | "en_progreso" | "no_iniciado";
  progreso: number;
}

interface Usuario {
  id: number;
  nombre: string;
  apellido: string;
  cargo: string;
  area: string;
  avatar: string;
  cursos: Curso[];
}

// Datos de ejemplo para un usuario
const userData: Usuario = {
  id: 1,
  nombre: "José",
  apellido: "García",
  cargo: "Ingeniero en Mantenimiento",
  area: "Mantenimiento",
  avatar: "/placeholder.svg?height=100&width=100",
  cursos: [
    {
      id: 1,
      nombre: "Capacitación Minera",
      estado: "completado",
      progreso: 100,
    },
    {
      id: 2,
      nombre: "Mantención de Maquinaria",
      estado: "en_progreso",
      progreso: 60,
    },
    {
      id: 3,
      nombre: "Seguridad industrial",
      estado: "completado",
      progreso: 100,
    },
    {
      id: 4,
      nombre: "Capacitación Avanzada",
      estado: "no_iniciado",
      progreso: 0,
    },
    {
      id: 5,
      nombre: "Mantenimiento Preventivo",
      estado: "no_iniciado",
      progreso: 0,
    },
    {
      id: 6,
      nombre: "Seguridad y Prevención",
      estado: "en_progreso",
      progreso: 30,
    },
  ],
};

export default function DetalleUsuarioRRHH() {
  const cursosEnProgreso = userData.cursos.filter(
    (curso) => curso.estado === "en_progreso"
  );
  const cursosCompletados = userData.cursos.filter(
    (curso) => curso.estado === "completado"
  );
  const cursosNoIniciados = userData.cursos.filter(
    (curso) => curso.estado === "no_iniciado"
  );

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center space-y-0 pb-2">
          <Avatar className="h-16 w-16 mr-4">
            <AvatarImage
              src={userData.avatar}
              alt={`${userData.nombre} ${userData.apellido}`}
            />
            <AvatarFallback>
              {userData.nombre[0]}
              {userData.apellido[0]}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {userData.nombre} {userData.apellido}
            </CardTitle>
            <CardDescription>{userData.cargo}</CardDescription>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Cargo</p>
              <p>{userData.cargo}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Área</p>
              <p>{userData.area}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Cursos Inscritos</CardTitle>
          <CardDescription>
            Estado y progreso de los cursos del trabajador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="todos">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="todos">Todos</TabsTrigger>
              <TabsTrigger value="en_progreso">En Progreso</TabsTrigger>
              <TabsTrigger value="completados">Completados</TabsTrigger>
              <TabsTrigger value="no_iniciados">No Iniciados</TabsTrigger>
            </TabsList>
            <TabsContent value="todos">
              <ListaCursos cursos={userData.cursos} />
            </TabsContent>
            <TabsContent value="en_progreso">
              <ListaCursos cursos={cursosEnProgreso} />
            </TabsContent>
            <TabsContent value="completados">
              <ListaCursos cursos={cursosCompletados} />
            </TabsContent>
            <TabsContent value="no_iniciados">
              <ListaCursos cursos={cursosNoIniciados} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

interface ListaCursosProps {
  cursos: Curso[];
}

function ListaCursos({ cursos }: ListaCursosProps) {
  return (
    <div className="space-y-4">
      {cursos.map((curso) => (
        <Card key={curso.id}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg">{curso.nombre}</CardTitle>
            <EstadoCursoBadge estado={curso.estado} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <Progress value={curso.progreso} className="w-full" />
              <span className="text-sm font-medium">{curso.progreso}%</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

interface EstadoCursoBadgeProps {
  estado: "completado" | "en_progreso" | "no_iniciado";
}

function EstadoCursoBadge({ estado }: EstadoCursoBadgeProps) {
  const badgeVariants = {
    completado: "bg-green-500",
    en_progreso: "bg-yellow-500",
    no_iniciado: "bg-gray-500",
  };

  const badgeTexts = {
    completado: "Completado",
    en_progreso: "En Progreso",
    no_iniciado: "No Iniciado",
  };

  return (
    <Badge className={`${badgeVariants[estado]} text-white`}>
      {badgeTexts[estado]}
    </Badge>
  );
}
