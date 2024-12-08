import React, { useState, useEffect } from "react";
import RutInput from "../../components/rutinput";
import axios from "axios";
import api from "../../services/api";

import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";

interface NuevoUsuarioProps {
  isModal: boolean;
  onClose: () => void;
  userRole?: string;
}

interface Area {
  id_area: number;
  nombre_area: string;
}

interface Rol {
  id_rol: number;
  nombre_rol: string;
}

const N_usuario: React.FC<NuevoUsuarioProps> = ({ isModal, onClose, userRole }) => {
  const [formData, setFormData] = useState({
    rut: "",
    nombre: "",
    apellido_paterno: "",
    apellido_materno: "",
    correo: "",
    rol: "",
    area: "",
  });

  const [isRutValid, setIsRutValid] = useState(false);
  const [areas, setAreas] = useState<Area[]>([]);
  const [roles, setRoles] = useState<Rol[]>([]);

  useEffect(() => {
    const cargarDatos = async () => {
      try {
        const [areasRes, rolesRes] = await Promise.all([
          api.get("/api/area"),
          api.get("/api/rol"),
        ]);
        setAreas(areasRes.data);
        setRoles(rolesRes.data);
      } catch (error) {
        console.error("Error al cargar áreas y roles:", error);
      }
    };
    cargarDatos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRutChange = (rut: string, isValid: boolean) => {
    setFormData((prevData) => ({
      ...prevData,
      rut,
    }));
    setIsRutValid(isValid);
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prevData) => {
      if (name === "rol") {
        const selectedRole = roles.find(rol => String(rol.id_rol) === value);
        if (selectedRole?.nombre_rol.toLowerCase() === "administrador") {
          return {
            ...prevData,
            [name]: value,
            area: ""
          };
        }
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rut || !formData.nombre || !formData.apellido_paterno || 
        !formData.apellido_materno || !formData.correo || !formData.rol) {
      alert("Todos los campos son obligatorios");
      return;
    }

    const esAdmin = roles.find(rol => String(rol.id_rol) === formData.rol)?.nombre_rol.toLowerCase() === "administrador";

    if (!esAdmin && !formData.area) {
      alert("El área es obligatoria para usuarios no administradores");
      return;
    }

    const datosAEnviar = {
      rut: formData.rut,
      nombre: formData.nombre,
      apellido_paterno: formData.apellido_paterno,
      apellido_materno: formData.apellido_materno,
      correo: formData.correo,
      rolId: parseInt(formData.rol),
      areaId: esAdmin ? null : parseInt(formData.area),
    };

    try {
      const response = await api.post("/newuser", datosAEnviar);

      console.log('Respuesta exitosa:', response.data);

      if (response.data.mensaje) {
        alert(response.data.mensaje);
        if (isModal && onClose) {
          onClose();
        }
      }

    } catch (error) {
      console.error("Error completo:", error);
      
      if (axios.isAxiosError(error)) {
        console.error('Error response:', error.response?.data);
        console.error('Error status:', error.response?.status);
        console.error('Error headers:', error.response?.headers);

        if (error.response?.data?.mensaje) {
          alert(error.response.data.mensaje);
        } else if (error.response?.status === 500) {
          alert("Error interno del servidor. Por favor, contacte al administrador.");
        } else {
          alert("Error al crear el usuario. Por favor, verifique los datos e intente nuevamente.");
        }
      } else {
        alert("Error inesperado al crear el usuario.");
      }
    }
  };

  const getRolesDisponibles = (userRole: string) => {
    switch (userRole.toLowerCase()) {
      case "administrador":
        return roles.filter(rol => 
          ["administrador", "trabajador"].includes(rol.nombre_rol.toLowerCase())
        );
      case "trabajador":
        return roles.filter(rol => 
          ["trabajador", "usuario"].includes(rol.nombre_rol.toLowerCase())
        );
      default:
        return [];
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      //className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-4"
    >
      <div className="space-y-2">
        <Label htmlFor="rut">RUT</Label>
        <RutInput value={formData.rut} onChange={handleRutChange} />
      </div>

      <div className="space-y-2">
        <Label htmlFor="nombre">Nombre</Label>
        <Input
          id="nombre"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
        <Input
          id="apellido_paterno"
          name="apellido_paterno"
          value={formData.apellido_paterno}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="apellido_materno">Apellido Materno</Label>
        <Input
          id="apellido_materno"
          name="apellido_materno"
          value={formData.apellido_materno}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="correo">Correo Electrónico</Label>
        <Input
          id="correo"
          name="correo"
          type="email"
          value={formData.correo}
          onChange={handleChange}
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="rol">Rol</Label>
        {userRole && (
          <Select
            value={formData.rol}
            onValueChange={(value) => handleSelectChange("rol", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecciona un rol" />
            </SelectTrigger>
            <SelectContent>
              {getRolesDisponibles(userRole).map((rol) => (
                <SelectItem key={rol.id_rol} value={String(rol.id_rol)}>
                  {rol.nombre_rol}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Área</Label>
        <Select
          value={formData.area}
          onValueChange={(value) => handleSelectChange("area", value)}
          disabled={roles.find(rol => String(rol.id_rol) === formData.rol)?.nombre_rol.toLowerCase() === "administrador"}
        >
          <SelectTrigger>
            <SelectValue placeholder={
              roles.find(rol => String(rol.id_rol) === formData.rol)?.nombre_rol.toLowerCase() === "administrador" 
              ? "N/A" 
              : "Selecciona un área"
            } />
          </SelectTrigger>
          <SelectContent>
            {areas.map((area) => (
              <SelectItem key={area.id_area} value={String(area.id_area)}>
                {area.nombre_area}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full mt-4">
        Crear Usuario
      </Button>
    </form>
  );
};

export default N_usuario;
