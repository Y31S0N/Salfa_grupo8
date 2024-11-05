//Layouts
//Privada
import PrivateLayout_flex from "../page/layouts/private-layout-flex";
//Publica
import RootLayout from "../page/layouts/root-layout";
//About
import About_layout from "../page/layouts/about-layout";
//Publics
import Login from "../page/public/Login";
import NotFound from "../page/public/notfound";
//Private
import N_usuario from "../page/private/nuevo-usuario";
import Perfiladm from "../page/private/perfiladmin";
import Agregar_cursos from "../page/private/agregar_cursos";
import Listado_cursos from "../page/private/listado_cursos";
import Vercurso from "../page/private/vercurso";
import Agregar_modulos from "../page/private/agregar_modulos";
import Modificar_modulos from "../page/private/modificar_modulos";
import Agregar_lecciones from "../page/private/agregar_lecciones";
import Agregar_contenido from "../page/private/agregar_contenido";
import Modificar_curso from "../page/private/modificar_curso";
import Modificar_lecciones from "../page/private/modificar_lecciones";
import DashboardRRHH from "../page/private/dashboard-rh";
import DetalleUsuarioRRHH from "../page/private/vista-perfil-rh";
import Cursos_home from "../page/private/cursos";
import ListadoCursosUsuario from "../page/private/listado-cursos-usuario";
import ManejoUsuarios from "../page/private/usuarios-admin";
import PerfilUsuario from "../page/private/perfil-usuario";

import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "../contexts/UserContext";
import FormularioArea from "../page/private/nueva-area";
import ListadoAreas from "../page/private/listar-areas";
import ListadoUsuarios from "../page/private/listarUsuarios";

// Definimos un tipo para los roles permitidos
type UserRole = "Administrador" | "Trabajador" | "Usuario";

// Definimos la interfaz para los props de ProtectedRoute
interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles,
}) => {
  const { user, loading } = useUser();

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (!user || !allowedRoles.includes(user.role as UserRole)) {
    return <Navigate to="/home" replace />;
  }

  return <>{children}</>;
};

export const router = createBrowserRouter([
  //privados
  {
    path: "/",
    element: (
      <UserProvider>
        <PrivateLayout_flex />
      </UserProvider>
    ),
    children: [
      {
        path: "home",
        element: (
          <ProtectedRoute
            allowedRoles={["Administrador", "Trabajador", "Usuario"]}
          >
            <Cursos_home />
          </ProtectedRoute>
        ),
      },
      {
        path: "listado_cursos",
        element: (
          <ProtectedRoute allowedRoles={["Administrador", "Trabajador"]}>
            <Listado_cursos />
          </ProtectedRoute>
        ),
      },
      {
        path: "listado_cursos_usuario",
        element: (
          <ProtectedRoute allowedRoles={["Usuario"]}>
            <ListadoCursosUsuario />
          </ProtectedRoute>
        ),
      },
      {
        path: "agregar_cursos",
        element: <Agregar_cursos />,
      },
      {
        path: "modificar_curso/:id",
        element: <Modificar_curso />,
      },
      {
        path: "vercurso/:id",
        element: <Vercurso />,
      },
      {
        path: "/cursos/:id/agregar_modulos",
        element: <Agregar_modulos />,
      },
      {
        path: "/cursos/:cursoId/modulos/:moduloId/modificar_lecciones/:leccionId",
        element: <Modificar_lecciones />,
      },
      {
        path: "/cursos/:cursoId/modulos/:moduloId/modificar",
        element: <Modificar_modulos />,
      },
      {
        path: "/cursos/:cursoId/modulos/:moduloId/agregar_lecciones",
        element: <Agregar_lecciones />,
      },
      {
        path: "agregar_contenido",
        element: <Agregar_contenido />,
      },
      // USUARIOS
      {
        path: "listarUsuarios",
        element: <ListadoUsuarios/>,
      },
      {
        path: "nuevo_usuario",
        element: <N_usuario />,
      },
      {
        path: "usuarios",
        element: (
          <ProtectedRoute allowedRoles={["Administrador"]}>
            <ManejoUsuarios />
          </ProtectedRoute>
        ),
      },
      {
        path: "perfil",
        element: <Perfiladm />,
      },
      {
        path: "dashboard-rh",
        element: <DashboardRRHH />,
      },
      {
        path: "dashboard-perfil-rh",
        element: <DetalleUsuarioRRHH />,
      },
      {
        path: "perfilUsuario",
        element: <PerfilUsuario />,
      },
      {
        path: "/formArea",
        element: <FormularioArea onCreate={function (): void {
          throw new Error("Function not implemented.");
        }} />,
      },
      // ÁREAS
      {
        path: "/listarAreas",
        element: <ListadoAreas />,
      },
      {
        path: "/modificar_area",
        element: <ListadoAreas />,
      },
    ],


  },
  //publicos
  {
    path: "/",
    element: (
      <UserProvider>
        <RootLayout />
      </UserProvider>
    ),
    children: [
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
      {
        path: "/about",
        element: <About_layout />,
      },
    ],
  },

  // CURSOS
  // {
  //   path: "/cursos",
  //   element: <PrivateLayout_clean />,
  //   children: [
  //     {
  //       index: true,
  //       element: <VistaCursosAdmin />,
  //     },
  //   ],
  // },
  //   {
  //     path: "/listado_cursos",
  //     element: <PrivateLayout_flex />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Listado_cursos />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/listado_cursos_usuario",
  //     element: <PrivateLayout_flex />,
  //     children: [
  //       {
  //         index: true,
  //         element: <ListadoCursosUsuario />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/agregar_cursos",
  //     element: <PrivateLayout_clean />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Agregar_cursos />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/modificar_curso/:id",
  //     element: <PrivateLayout_clean />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Modificar_curso />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/vercurso/:id",
  //     element: <PrivateLayout_flex />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Vercurso />,
  //       },
  //     ],
  //   },
  //   //MODULOS
  //   {
  //     path: "/cursos/:id/agregar_modulos", // Cambiado para incluir el ID del curso
  //     element: <PrivateLayout_clean />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Agregar_modulos />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/cursos/:cursoId/modulos/:moduloId/modificar",
  //     element: <PrivateLayout_clean />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Modificar_modulos />, // Asegúrate de que este componente maneje la carga del módulo
  //       },
  //     ],
  //   },
  //   //MODULOS

  //   //LECCIONES
  //   {
  //     path: "/cursos/:cursoId/modulos/:moduloId/agregar_lecciones",
  //     element: <PrivateLayout_clean />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Agregar_lecciones />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/cursos/:cursoId/modulos/:moduloId/modificar_lecciones/:leccionId", // Incluye el ID de la lección
  //     element: <PrivateLayout_clean />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Modificar_lecciones />,
  //       },
  //     ],
  //   },
  //   //LECCIONES
  //   {
  //     path: "/agregar_contenido",
  //     element: <PrivateLayout_clean />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Agregar_contenido />,
  //       },
  //     ],
  //   },

  //   // USUARIOS
  //   {
  //     path: "/nuevo_usuario",
  //     element: <PrivateLayout_clean />,
  //     children: [
  //       {
  //         index: true,
  //         element: <N_usuario />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/usuarios",
  //     element: <PrivateLayout_flex />,
  //     children: [
  //       {
  //         index: true,
  //         element: <ManejoUsuarios />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/perfil",
  //     element: <PrivateLayout_flex />,
  //     children: [
  //       {
  //         index: true,
  //         element: <Perfiladm />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/dashboard-rh",
  //     element: <PrivateLayout_flex />,
  //     children: [
  //       {
  //         index: true,
  //         element: <DashboardRRHH />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/dashboard-perfil-rh",
  //     element: <PrivateLayout_flex />,
  //     children: [
  //       {
  //         index: true,
  //         element: <DetalleUsuarioRRHH />,
  //       },
  //     ],
  //   },
  //   {
  //     path: "/perfilUsuario",
  //     element: <PrivateLayout_flex />,
  //     children: [
  //       {
  //         index: true,
  //         element: <PerfilUsuario />,
  //       },
  //     ],
  //   },
]);