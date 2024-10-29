import React from "react";
import Swal from "sweetalert2";

// Definimos las props que el componente recibirá
interface AlertaConfirmacionProps {
  title: string;
  text: string;
  confirmText: string;
  cancelText: string;
  onConfirm: () => void; // Función que se ejecutará si el usuario confirma
}

const AlertaConfirmacion: React.FC<AlertaConfirmacionProps> = ({
  title,
  text,
  confirmText,
  cancelText,
  onConfirm,
}) => {
  
  // Función para mostrar la alerta
  const mostrarAlerta = () => {
    Swal.fire({
      title: title,
      text: text,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmText,
      cancelButtonText: cancelText,
    }).then((result) => {
      if (result.isConfirmed) {
        onConfirm(); // Ejecutar la acción de confirmación si se presiona "Sí"
      }
    });
  };

  // Retornamos un botón que disparará la alerta cuando sea clicado
  return (
    <button onClick={mostrarAlerta} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 text-sm">
      {confirmText}
    </button>
  );
};

export default AlertaConfirmacion;
