// ComprobarExistencia.tsx
import React from "react";
import datosPrueba from "@/components/datosprueba";

interface ComprobarExistenciaProps {
  rut: string;
  correo: string;
}

const ComprobarExistencia: React.FC<ComprobarExistenciaProps> = ({
  rut,
  correo,
}) => {
  // Función para comprobar si existe un usuario con el mismo RUT o correo
  const comprobarExistencia = () => {
    return datosPrueba.some(
      (usuario) => usuario.rut === rut || usuario.correo === correo
    );
  };

  // Retornar el resultado de la comprobación
  return comprobarExistencia();
};

export default ComprobarExistencia;
