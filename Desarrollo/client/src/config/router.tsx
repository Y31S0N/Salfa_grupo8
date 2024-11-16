//Layouts
//Privada
import PrivateLayout_flex from "../page/layouts/private-layout-flex";
import PrivateLayout_content from "../page/layouts/private-layout-content";
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
import HomeUsuarios from "../page/private/home-usuarios";
import SubirContenido from "../page/private/subircontenido";
import DetalleCurso from "../page/private/vercurso-usuario";

import React from "react";
import { createBrowserRouter, Navigate } from "react-router-dom";
import { UserProvider, useUser } from "../contexts/UserContext";
import FormularioArea from "../page/private/nueva-area";
import ListadoAreas from "../page/private/listar-areas";
import ListadoUsuarios from "../page/private/listarUsuarios";
import RoleBasedRedirect from "../components/RoleBasedRedirect";
import DetalleCurso from "../page/private/vercurso-usuario";
import PaginaCurso from "../page/private/ver_contenido";

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

  if (!user) {
    return <Navigate to="/home" replace />;
  }
  if (user.role === "Usuario" && location.pathname === "/home") {
    return <Navigate to="/homeUsuarios" replace />;
  }
  if (!allowedRoles.includes(user.role as UserRole)) {
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
        index: true,
        path: "home",
        element: (
          <ProtectedRoute
            allowedRoles={["Administrador", "Trabajador", "Usuario"]}
          >
            <RoleBasedRedirect />
          </ProtectedRoute>
        ),
      },
      {
        path: "home",
        element: (
          <ProtectedRoute allowedRoles={["Administrador", "Trabajador"]}>
            <Listado_cursos />
          </ProtectedRoute>
        ),
      },
      {
        path: "homeUsuarios",
        element: (
          <ProtectedRoute allowedRoles={["Usuario"]}>
            <HomeUsuarios />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "listado_cursos",
      //   element: (
      //     <ProtectedRoute allowedRoles={["Administrador", "Trabajador"]}>
      //       <Listado_cursos />
      //     </ProtectedRoute>
      //   ),
      // },
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
        element: (
          <ProtectedRoute allowedRoles={["Administrador", "Trabajador"]}>
            <ListadoUsuarios />
          </ProtectedRoute>
        ),
      },
      {
        path: "nuevo_usuario",
        element: (
          <ProtectedRoute allowedRoles={["Administrador", "Trabajador"]}>
            <N_usuario />
          </ProtectedRoute>
        ),
      },
      {
        path: "usuarios",
        element: (
          <ProtectedRoute allowedRoles={["Administrador"]}>
            <ManejoUsuarios />
          </ProtectedRoute>
        ),
      },
      // {
      //   path: "perfil",
      //   element: <Perfiladm />,
      // },
      {
        path: "dashboard-rh",
        element: <DashboardRRHH />,
      },
      {
        path: "/dashboard-perfil-rh/:id",
        element: <DetalleUsuarioRRHH />,
      },
      {
        path: "perfilUsuario",
        element: (
          <UserProvider>
            <PerfilUsuario />
          </UserProvider>
        ),
      },
      {
        path: "verCursoUsuario/:id",
        element: (
          <ProtectedRoute allowedRoles={["Usuario"]}>
            <DetalleCurso />
          </ProtectedRoute>
        ),
      },
      // ÁREAS
      {
        path: "/formArea",
        element: (
          <FormularioArea
            onCreate={function (): void {
              throw new Error("Function not implemented.");
            }}
          />
        ),
      },
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
        index: true,
        path: "/login",
        element: <Login />,
      },
      {
        path: "*",
        element: <NotFound />,
      },
    ],
  },
  {
    path: "ver_contenido/:cursoId/:moduloId/:leccionId",
    element: (
      <UserProvider>
        <PrivateLayout_content>
          <PaginaCurso />
        </PrivateLayout_content>
      </UserProvider>
    ),
  },
  {
    path: "/about",
    element: <About_layout />,
  },
]);
