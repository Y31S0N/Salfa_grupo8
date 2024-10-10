import PrivateLayout from "@/page/layouts/private-layout";
import PrivateLayout_wthead from "@/page/layouts/private-layout-wtothead";
import RootLayout from "@/page/layouts/root-layout";
import Home from "@/page/private/dashboard-page";
import C_usuario from "@/page/private/nuevo-usuario";
import Login from "@/page/public/home";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
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
        path: "about",
        element: <h1>Hola</h1>,
      },
      {
        path: "*",
        element: <h1>HOLA XD</h1>,
      },
    ],
  },
  {
    path: "/Home",
    element: <PrivateLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
    ],
  },
  {
    path: "/nuevo_usuario",
    element: <PrivateLayout_wthead />,
    children: [
      {
        index: true,
        element: <C_usuario />,
      },
    ],
  },
]);
