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
  isModal?: boolean;
  onClose?: () => void;
}

interface Area {
  id_area: number;
  nombre_area: string;
}

interface Rol {
  id_rol: number;
  nombre_rol: string;
}

const N_usuario: React.FC<NuevoUsuarioProps> = ({ isModal, onClose }) => {
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
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isRutValid) {
      alert("Por favor ingresa un RUT válido.");
      return;
    }

    try {
      const response = await api.post("/newuser", {
        rut: formData.rut,
        nombre: formData.nombre,
        apellido_paterno: formData.apellido_paterno,
        apellido_materno: formData.apellido_materno,
        correo: formData.correo,
        rolId: parseInt(formData.rol),
        areaId: parseInt(formData.area),
      });

      const { accion, mensaje } = response.data;
      alert(mensaje);

      if (accion === "Crear en ambos") {
        console.log(mensaje);
      } else if (accion === "Crear solo en Firebase") {
        console.log(mensaje);
      } else if (accion === "Crear solo en la base de datos") {
        console.log(mensaje);
      } else if (accion === "No crear") {
        console.log(mensaje);
      } else if (accion === "Error") {
        console.log(mensaje);
      }

      if (isModal && onClose) {
        onClose();
      }
    } catch (error) {
      console.error("Ocurrió un error en la verificación", error);
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        alert(
          "Sesión expirada o inválida. Por favor, inicie sesión nuevamente."
        );
      } else {
        alert("Error en la verificación del usuario");
      }
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
        <Select
          value={formData.rol}
          onValueChange={(value) => handleSelectChange("rol", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            {roles.map((rol) => (
              <SelectItem key={rol.id_rol} value={String(rol.id_rol)}>
                {rol.nombre_rol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Área</Label>
        <Select
          value={formData.area}
          onValueChange={(value) => handleSelectChange("area", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un área" />
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
