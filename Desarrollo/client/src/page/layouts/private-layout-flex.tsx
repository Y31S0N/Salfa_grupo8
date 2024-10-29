import { useState } from "react";
import { Book, Home, LogOut, User, Activity, UserCog } from "lucide-react";
import { signOut, getAuth } from "firebase/auth";
import Header from "@/components/header";
import NavItem from "@/components/nav-home";
import { Navigate, Outlet } from "react-router-dom";
import { useSigninCheck } from "reactfire";
import firebaseApp from "../../config/firebase";
const auth = getAuth(firebaseApp);

export default function PrivateLayout_flex() {
  const [isNavOpen, setIsNavOpen] = useState(false);

  const toggleNav = () => setIsNavOpen(!isNavOpen);

  const handleClickSignOut = async () => {
    await signOut(auth);
  };
  const { status, data: singInCheckResult } = useSigninCheck();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (singInCheckResult.signedIn) {
    return (
      <div className="flex flex-col h-screen bg-gray-100">
        <Header toggleNav={toggleNav} />
        <div className="flex flex-1 relative">
          {/* Barra de navegación vertical */}
          <nav
            className={`w-64 bg-white shadow-md absolute inset-y-0 left-0 transform ${
              isNavOpen ? "translate-x-0" : "-translate-x-full"
            } transition-transform duration-300 ease-in-out z-10 md:relative md:translate-x-0`}
          >
            <div className="p-4 md:hidden">
              <h1 className="text-2xl font-bold text-gray-800">Mi Dashboard</h1>
            </div>
            <ul className="mt-4">
              <NavItem to="/" icon={<Home size={20} />} text="Inicio" />
              <NavItem
                to="/perfilUsuario"
                icon={<User size={20} />}
                text="Perfil vista usuario"
              />
              <NavItem
                to="/perfil"
                icon={<User size={20} />}
                text="Perfil vista trabajador"
              />
              <NavItem
                to="/dashboard-perfil-rh"
                icon={<Activity size={20} />}
                text="Actividad vista usuario"
              />
              <NavItem
                to="/dashboard-rh"
                icon={<Activity size={20} />}
                text="Actividad vista trabajador"
              />
              <NavItem
                to="/listado_cursos_usuario"
                icon={<Book size={20} />}
                text="Cursos vista usuario"
              />
              <NavItem
                to="/listado_cursos"
                icon={<Book size={20} />}
                text="Cursos vista trabajador"
              />
              <NavItem
                to="/usuarios"
                icon={<UserCog size={20} />}
                text="Gestion de usuarios"
              />
              <NavItem
                to="/listarAreas"
                icon={<Book size={20} />}
                text="Áreas"
              />
              <NavItem
                to="/login"
                icon={<LogOut size={20} />}
                text="Cerrar Sesión"
                onClick={handleClickSignOut}
              />
            </ul>
          </nav>

          {/* Contenido principal */}
          <main className="flex-1 p-8 overflow-y-auto">
            <Outlet />
          </main>
        </div>
      </div>
    );
  }

  return <Navigate to="/" />;
}
