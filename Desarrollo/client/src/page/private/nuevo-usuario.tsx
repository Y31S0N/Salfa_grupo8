import { useState } from "react";
import RutInput from "@/components/rutinput";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CrearUsuarioEnFirebase from "@/components/crearusuariofire";

const C_usuario = () => {
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
    setIsRutValid(isValid); // Guardamos el estado de la validez del RUT
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
    const { rut, correo } = formData;
    try {
      const response = await axios.post(
        "http://localhost:5000/api/verificarUsuario",
        {
          rut,
          correo,
        }
      );
      const { existeEnBD, existeEnFirebase } = response.data as {
        existeEnBD: boolean;
        existeEnFirebase: boolean;
      };
      if (existeEnBD && !existeEnFirebase) {
        // Si existe en la BD pero no en Firebase, crearlo en Firebase
        CrearUsuarioEnFirebase(correo);
      }
      //
      else if (!existeEnBD && existeEnFirebase) {
        // Si existe en Firebase pero no en la BD, crear usuario normalmente en la BD
        alert(
          "El usuario existe en Firebase. Creando usuario en la base de datos."
        );
      } else if (!existeEnBD && !existeEnFirebase) {
        // Si no existe ni en la BD ni en Firebase, crearlo en ambos lados
        CrearUsuarioEnFirebase(formData.correo); // Deberías tener otra API para crear el usuario en la base de datos
        alert("Usuario creado en Firebase y en la base de datos.");
      } else {
        alert("Ya existe un usuario con el mismo RUT o correo.");
      }
    } catch (err) {
      console.log(err);
      alert("Error al verificar el usuario. Intente nuevamente.");
    }
    // Si pasa las validaciones, crear el nuevo usuario (simulación)
    // Aquí puedes agregar la lógica para enviar los datos al servidor
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-4"
    >
      <h2 className="text-2xl font-bold text-center mb-6">Crear Usuario</h2>

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
        <Select onValueChange={(value) => handleSelectChange("rol", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un rol" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="administracion">Administracion</SelectItem>
            <SelectItem value="trabajador">trabajador</SelectItem>
            <SelectItem value="temporal">Temporal</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="area">Área</Label>
        <Select onValueChange={(value) => handleSelectChange("area", value)}>
          <SelectTrigger>
            <SelectValue placeholder="Selecciona un área" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="rrhh">Recursos Humanos</SelectItem>
            <SelectItem value="it">IT</SelectItem>
            <SelectItem value="ventas">Ventas</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button type="submit" className="w-full">
        Crear Usuario
      </Button>
    </form>
  );
};

export default C_usuario;
