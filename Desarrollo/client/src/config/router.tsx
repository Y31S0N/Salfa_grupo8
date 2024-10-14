//Layouts
//Privadas
import PrivateLayout_clean from "@/page/layouts/private-layout";
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

import { createBrowserRouter } from "react-router-dom";
import DashboardRRHH from "@/page/private/dashboard-rh";
import DetalleUsuarioRRHH from "@/page/private/vista-perfil-rh";
import Cursos_home from "@/page/private/cursos";
import ListadoCursosUsuario from "@/page/private/listado-cursos-usuario";
import ManejoUsuarios from "@/page/private/usuarios-admin";
import PerfilUsuario from "@/page/private/perfil-usuario";
// import VistaCursosAdmin from "@/page/private/cursos-admin";

export const router = createBrowserRouter([
  //publicos
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Login />,
      },
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
  //privados
  {
    path: "/home",
    element: <PrivateLayout_flex />,
    children: [
      {
        index: true,
        element: <Cursos_home />,
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
  {
    path: "/listado_cursos",
    element: <PrivateLayout_flex />,
    children: [
      {
        index: true,
        element: <Listado_cursos />,
      },
    ],
  },
  {
    path: "/listado_cursos_usuario",
    element: <PrivateLayout_flex />,
    children: [
      {
        index: true,
        element: <ListadoCursosUsuario />,
      },
    ],
  },
  {
    path: "/agregar_cursos",
    element: <PrivateLayout_clean />,
    children: [
      {
        index: true,
        element: <Agregar_cursos />,
      },
    ],
  },
  {
    path: "/modificar_curso",
    element: <PrivateLayout_clean />,
    children: [
      {
        index: true,
        element: <Modificar_cursos />,
      },
    ],
  },
  {
    path: "/vercurso",
    element: <PrivateLayout_flex />,
    children: [
      {
        index: true,
        element: <Vercurso />,
      },
    ],
  },
  {
    path: "/agregar_modulos",
    element: <PrivateLayout_clean />,
    children: [
      {
        index: true,
        element: <Agregar_modulos />,
      },
    ],
  },
  {
    path: "/agregar_lecciones",
    element: <PrivateLayout_clean />,
    children: [
      {
        index: true,
        element: <Agregar_lecciones />,
      },
    ],
  },
  {
    path: "/agregar_contenido",
    element: <PrivateLayout_clean />,
    children: [
      {
        index: true,
        element: <Agregar_contenido />,
      },
    ],
  },

  // USUARIOS
  {
    path: "/nuevo_usuario",
    element: <PrivateLayout_clean />,
    children: [
      {
        index: true,
        element: <N_usuario />,
      },
    ],
  },
  {
    path: "/usuarios",
    element: <PrivateLayout_flex />,
    children: [
      {
        index: true,
        element: <ManejoUsuarios />,
      },
    ],
  },
  {
    path: "/perfil",
    element: <PrivateLayout_flex />,
    children: [
      {
        index: true,
        element: <Perfiladm />,
      },
    ],
  },
  {
    path: "/dashboard-rh",
    element: <PrivateLayout_flex />,
    children: [
      {
        index: true,
        element: <DashboardRRHH />,
      },
    ],
  },
  {
    path: "/dashboard-perfil-rh",
    element: <PrivateLayout_flex />,
    children: [
      {
        index: true,
        element: <DetalleUsuarioRRHH />,
      },
    ],
  },
  {
    path: "/perfilUsuario",
    element: <PrivateLayout_flex />,
    children: [
      {
        index: true,
        element: <PerfilUsuario />,
      },
    ],
  },
]);
