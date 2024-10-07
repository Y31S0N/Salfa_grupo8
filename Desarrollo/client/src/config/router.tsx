import PrivateLayout from "@/page/layouts/private-layout";
import RootLayout from "@/page/layouts/root-layout";
import Dashboard from "@/page/private/dashboard-page";
import Home from "@/page/public/home";
import { createBrowserRouter } from "react-router-dom";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "about",
        element: <h1>Hola</h1>,
      },
      {
        path: "dashboard",
        element: <PrivateLayout />,
        children: [
          {
            index: true,
            element: <Dashboard />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: <h1>HOLA XD</h1>,
  },
]);
