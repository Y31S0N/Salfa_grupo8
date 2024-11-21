import React from "react";
import { useState, useEffect } from "react";
import {
  Book,
  Home,
  LogOut,
  User,
  Activity,
  UserCog,
  Users,
  ChartArea,
  HardHat,
} from "lucide-react";
import Header from "../../components/header";
import NavItem from "../../components/nav-home";
import { Outlet } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";

export default function PrivateLayout_flex() {
  const [isNavOpen, setIsNavOpen] = useState(false);
  const { user, logout, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleClickSignOut = async (
    event: React.MouseEvent<HTMLAnchorElement>
  ) => {
    event.preventDefault();
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <SyncLoader />
      </div>
    );
  }

  if (!user || !user.role) {
    return null;
  }

  const renderNavItems = () => {
    const homeItem = (
      <NavItem key="home" to="/home" icon={<Home size={20} />} text="Inicio" />
    );
    const logoutItem = (
      <NavItem
        key="logout"
        to="/login" // Cambiamos esto a "#" para prevenir la navegación automática
        icon={<LogOut size={20} />}
        text="Cerrar Sesión"
        onClick={handleClickSignOut}
      />
    );

    if (!user) {
      return [homeItem, logoutItem];
    }

    let roleSpecificItems: JSX.Element[] = [];

    switch (user.role) {
      case "Administrador":
        roleSpecificItems = [
          <NavItem
            key="leerusers"
            to="/usuarios"
            icon={<UserCog size={20} />}
            text="Carga de usuarios"
          />,
          <NavItem
            key="user-worker"
            to="/listarUsuarios"
            icon={<Activity size={20} />}
            text="Gestión de usuarios"
          />,
        ];
        break;
      case "Trabajador":
        roleSpecificItems = [
          <NavItem
            key="courses-worker"
            to="/listado_cursos"
            icon={<Book size={20} />}
            text="Cursos"
          />,
          <NavItem
            key="activity-worker"
            to="/dashboard-rh"
            icon={<ChartArea size={20} />}
            text="Dashboard"
          />,
          <NavItem
            key="area-worker"
            to="/listarAreas"
            icon={<HardHat size={20} />}
            text="Áreas"
          />,
          <NavItem
            key="user-worker"
            to="/listarUsuarios"
            icon={<Users size={20} />}
            text="Listado Usuarios"
          />,
        ];
        break;
      case "Usuario":
        roleSpecificItems = [
          <NavItem
            key="profile-user"
            to="/perfilUsuario"
            icon={<User size={20} />}
            text="Mi Perfil"
          />,
        ];
        break;
    }

    return [homeItem, ...roleSpecificItems, logoutItem];
  };

  return (
    <div className="flex flex-col h-screen">
      <Header toggleNav={toggleNav} />
      <div className="flex flex-1 relative">
        <nav
          className={`w-64 bg-white shadow-md absolute inset-y-0 left-0 transform ${
            isNavOpen ? "translate-x-0" : "-translate-x-full"
          } transition-transform duration-300 ease-in-out z-10 md:relative md:translate-x-0`}
        >
          <div className="p-4 md:hidden">
            <h1 className="text-2xl font-bold text-gray-800">Mi Dashboard</h1>
          </div>
          <ul className="mt-4">{renderNavItems()}</ul>
        </nav>

        <main className="flex-1 p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
