import { useState, useEffect } from "react";
import { Book, Home, LogOut, User, Activity, UserCog } from "lucide-react";
import Header from "@/components/header";
import NavItem from "@/components/nav-home";
import { Outlet } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";

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
    event.preventDefault(); // Previene la navegación por defecto
    try {
      await logout(); // Espera a que logout termine
      navigate("/login"); // Navega programáticamente después del logout
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      // Aquí podrías mostrar un mensaje de error al usuario
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
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
            key="users"
            to="/usuarios"
            icon={<UserCog size={20} />}
            text="Gestión de usuarios"
          />,
        ];
        break;
      case "Trabajador":
        roleSpecificItems = [
          <NavItem
            key="profile-worker"
            to="/perfil"
            icon={<User size={20} />}
            text="Perfil vista trabajador"
          />,
          <NavItem
            key="courses-worker"
            to="/listado_cursos"
            icon={<Book size={20} />}
            text="Cursos vista trabajador"
          />,
          <NavItem
            key="activity-worker"
            to="/dashboard-rh"
            icon={<Activity size={20} />}
            text="Actividad vista trabajador"
          />,
          <NavItem
            key="courses-admin"
            to="/listado_cursos"
            icon={<Book size={20} />}
            text="Cursos vista trabajador"
          />,
          <NavItem
            key="activity-admin"
            to="/dashboard-rh"
            icon={<Activity size={20} />}
            text="Actividad vista trabajador"
          />,
        ];
        break;
      case "Usuario":
        roleSpecificItems = [
          <NavItem
            key="profile-user"
            to="/perfilUsuario"
            icon={<User size={20} />}
            text="Perfil vista usuario"
          />,
          <NavItem
            key="courses-user"
            to="/listado_cursos_usuario"
            icon={<Book size={20} />}
            text="Cursos vista usuario"
          />,
          <NavItem
            key="activity-user"
            to="/dashboard-perfil-rh"
            icon={<Activity size={20} />}
            text="Actividad vista usuario"
          />,
        ];
        break;
    }

    return [homeItem, ...roleSpecificItems, logoutItem];
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
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