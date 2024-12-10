import React, { useState } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import * as XLSX from "xlsx";
import axios from "axios";
import { toast } from "sonner";

const CargaUsuarios = ({ onClose, onSuccess }) => {
  const [errorMessages, setErrorMessages] = useState([]);
  const [fileData, setFileData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const validarUsuario = (usuario) => {
    const errores = [];

    if (!usuario.rut) errores.push(`Falta RUT para usuario ${usuario.nombre}`);
    if (!usuario.correo || !usuario.correo.includes("@"))
      errores.push(`Correo inválido para usuario ${usuario.nombre}`);
    if (!usuario.nombre) errores.push("El nombre es requerido");
    if (!usuario.apellido_paterno) errores.push("El apellido paterno es requerido");
    if (!usuario.apellido_materno) errores.push("El apellido materno es requerido");
    if (!usuario.rolId) errores.push("El rol es requerido");
    if (!usuario.areaId) errores.push("El área es requerida");

    return errores;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileData(file);
  };

  const handleSubmit = async () => {
    if (!fileData) {
      toast.error("Por favor, seleccione un archivo primero");
      return;
    }

    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append('file', fileData);

      const response = await axios.post(
        "http://localhost:4000/api/usuarios/bulk/upload",
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      // Mostrar resultados de usuarios creados/actualizados
      if (response.data.resultadoCreacion) {
        if (response.data.resultadoCreacion.creados.length > 0) {
          toast.success(`${response.data.resultadoCreacion.creados.length} usuarios creados exitosamente`);
        }
        if (response.data.resultadoCreacion.existentes.length > 0) {
          toast.warning(`${response.data.resultadoCreacion.existentes.length} usuarios ya existían`);
        }
      }

      // Mostrar errores de validación
      if (response.data.erroresValidacion && response.data.erroresValidacion.length > 0) {
        const mensajesError = response.data.erroresValidacion.map(error => 
          `Fila ${error.fila} (RUT: ${error.rut}): ${error.errores.join(', ')}`
        );
        setErrorMessages(mensajesError);
        toast.error(`${response.data.erroresValidacion.length} usuarios no pudieron ser procesados`);
      }

      if (onSuccess) onSuccess();
      if (onClose && !response.data.erroresValidacion?.length) onClose();
      
    } catch (error) {
      console.error("Error al enviar archivo:", error);
      setErrorMessages([error.response?.data?.mensaje || "Error al procesar el archivo"]);
      toast.error("Error al procesar el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownloadTemplate = () => {
    const template = XLSX.utils.book_new();
    const templateData = [
      {
        rut: "12.345.678-9",
        nombre: "Juan",
        apellido_paterno: "Pérez",
        apellido_materno: "González",
        correo: "juan.perez@ejemplo.com",
        contrasena: "juan123456",
        rolId: "2",
        areaId: "1",
        activo: "true"
      },
      {
        rut: "11.111.111-1",
        nombre: "María",
        apellido_paterno: "López",
        apellido_materno: "Soto",
        correo: "maria.lopez@ejemplo.com",
        contrasena: "maria123456",
        rolId: "3",
        areaId: "1",
        activo: "true"
      },
      {
        rut: "22.222.222-2",
        nombre: "Pedro",
        apellido_paterno: "Rodríguez",
        apellido_materno: "Muñoz",
        correo: "pedro.rodriguez@ejemplo.com",
        contrasena: "pedro123456",
        rolId: "4",
        areaId: "1",
        activo: "true"
      },
      {
        rut: "33.333.333-3",
        nombre: "Ana",
        apellido_paterno: "García",
        apellido_materno: "Martínez",
        correo: "ana.garcia@ejemplo.com",
        contrasena: "ana123456",
        rolId: "2",
        areaId: "1",
        activo: "true"
      },
      {
        rut: "44.444.444-4",
        nombre: "Carlos",
        apellido_paterno: "Fernández",
        apellido_materno: "Silva",
        correo: "carlos.fernandez@ejemplo.com",
        contrasena: "carlos123456",
        rolId: "3",
        areaId: "1",
        activo: "true"
      },
      {
        rut: "55.555.555-5",
        nombre: "Laura",
        apellido_paterno: "Torres",
        apellido_materno: "Rojas",
        correo: "laura.torres@ejemplo.com",
        contrasena: "laura123456",
        rolId: "4",
        areaId: "1",
        activo: "true"
      },
      {
        rut: "66.666.666-6",
        nombre: "Diego",
        apellido_paterno: "Vargas",
        apellido_materno: "Castro",
        correo: "diego.vargas@ejemplo.com",
        contrasena: "diego123456",
        rolId: "2",
        areaId: "1",
        activo: "true"
      },
      {
        rut: "77.777.777-7",
        nombre: "Carmen",
        apellido_paterno: "Morales",
        apellido_materno: "Flores",
        correo: "carmen.morales@ejemplo.com",
        contrasena: "carmen123456",
        rolId: "3",
        areaId: "1",
        activo: "true"
      },
      {
        rut: "88.888.888-8",
        nombre: "Roberto",
        apellido_paterno: "Herrera",
        apellido_materno: "Díaz",
        correo: "roberto.herrera@ejemplo.com",
        contrasena: "roberto123456",
        rolId: "4",
        areaId: "1",
        activo: "true"
      },
      {
        rut: "99.999.999-9",
        nombre: "Patricia",
        apellido_paterno: "Navarro",
        apellido_materno: "Pinto",
        correo: "patricia.navarro@ejemplo.com",
        contrasena: "patricia123456",
        rolId: "2",
        areaId: "1",
        activo: "true"
      },
    ];

    const ws = XLSX.utils.json_to_sheet(templateData);
    XLSX.utils.book_append_sheet(template, ws, "Template");
    XLSX.writeFile(template, "plantilla_usuarios.xlsx");
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Administración de Usuarios</h1>

      <div className="space-y-4">
        <Button onClick={handleDownloadTemplate}>
          Descargar Plantilla Excel
        </Button>

        <form onSubmit={(e) => {
          e.preventDefault();
          handleSubmit();
        }} className="flex items-center space-x-2">
          <Input
            type="file"
            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={handleFileSelect}
            className="max-w-md"
          />
          <Button 
            type="submit"
            disabled={!fileData || isLoading}
          >
            {isLoading ? "Cargando..." : "Cargar Usuarios"}
          </Button>
        </form>

        {errorMessages.length > 0 && (
          <div className="mt-4 p-4 bg-red-100 rounded">
            <h3 className="font-bold text-red-700">Errores encontrados:</h3>
            <ul className="list-disc pl-4">
              {errorMessages.map((error, index) => (
                <li key={index} className="text-red-600">
                  {error}
                </li>
              ))}
            </ul>
          </div>
        )}

        {fileData && (
          <div className="mt-4 p-4 bg-green-100 rounded">
            <p className="text-green-700">
              Archivo cargado correctamente. {fileData.length} usuarios listos para procesar.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CargaUsuarios;
