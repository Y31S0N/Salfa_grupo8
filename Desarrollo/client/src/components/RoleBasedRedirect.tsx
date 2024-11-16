import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext"; // Asegúrate de importar useUser correctamente

const RoleBasedRedirect: React.FC = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      if (user.role === "Usuario") {
        navigate("/homeUsuarios", { replace: true });
      } else {
        navigate("/home", { replace: true });
      }
    }
  }, [user, navigate]);

  return <div>Cargando...</div>; // O cualquier indicación de carga
};

export default RoleBasedRedirect;
