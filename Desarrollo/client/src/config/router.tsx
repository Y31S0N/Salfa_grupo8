//Layouts
//Privada
import PrivateLayout_flex from "@/page/layouts/private-layout-flex";
//Publica
import RootLayout from "@/page/layouts/root-layout";
//About
import About_layout from "@/page/layouts/about-layout";
//Publics
import Login from "@/page/public/Login";
import NotFound from "@/page/public/notfound";
//Private
import N_usuario from "@/page/private/nuevo-usuario";
import Perfiladm from "@/page/private/perfiladmin";
import Agregar_cursos from "@/page/private/agregar_cursos";
import Listado_cursos from "@/page/private/listado_cursos";
import Vercurso from "@/page/private/vercurso";
import Agregar_modulos from "@/page/private/agregar_modulos";
import Agregar_lecciones from "@/page/private/agregar_lecciones";
import Agregar_contenido from "@/page/private/agregar_contenido";
import Modificar_cursos from "@/page/private/modificar_curso";

import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "@/contexts/UserContext";

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

import DashboardRRHH from "@/page/private/dashboard-rh";
import DetalleUsuarioRRHH from "@/page/private/vista-perfil-rh";
import Cursos_home from "@/page/private/cursos";
import ListadoCursosUsuario from "@/page/private/listado-cursos-usuario";
import ManejoUsuarios from "@/page/private/usuarios-admin";
import PerfilUsuario from "@/page/private/perfil-usuario";
// import VistaCursosAdmin from "@/page/private/cursos-admin";

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
        path: "modificar_curso",
        element: <Modificar_cursos />,
      },
      {
        path: "vercurso",
        element: <Vercurso />,
      },
      {
        path: "agregar_modulos",
        element: <Agregar_modulos />,
      },
      {
        path: "agregar_lecciones",
        element: <Agregar_lecciones />,
      },
      {
        path: "agregar_contenido",
        element: <Agregar_contenido />,
      },
      // USUARIOS
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
]);
