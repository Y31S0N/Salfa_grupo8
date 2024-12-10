import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { UserPen } from "lucide-react";
import { toast } from "sonner";
import api from "../../services/api";

interface Usuario {
  rut: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  rolId: Number;
  areaId: Number | null;
  estadoFirebase: boolean;
  rol: {
    id_rol: Number;
    nombre_rol: string;
  };
  Area: {
    id_area: Number;
    nombre_area: string;
  };
}

interface EditarUsuarioProps {
  usuario: Usuario;
  onUsuarioActualizado: () => void;
}

export function EditarUsuario({
  usuario,
  onUsuarioActualizado,
}: EditarUsuarioProps) {
  const [formData, setFormData] = useState({
    nombre: usuario.nombre,
    apellido_paterno: usuario.apellido_paterno,
    apellido_materno: usuario.apellido_materno,
    correo: usuario.correo,
    rolId: usuario.rolId,
    areaId: usuario.areaId,
  });
  const [roles, setRoles] = useState<any[]>([]);
  const [areas, setAreas] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const cargarDatos = async () => {
      setIsLoading(true);
      try {
        const [areasRes, rolesRes] = await Promise.all([
          api.get("/api/area"),
          api.get("/api/rol"),
        ]);
        setRoles(rolesRes.data);
        setAreas(areasRes.data);
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar datos");
      } finally {
        setIsLoading(false);
      }
    };

    if (open) {
      cargarDatos();
    }
  }, [open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put(`/api/usuarios/${usuario.rut}`, formData);
      toast.success("Usuario actualizado exitosamente");
      onUsuarioActualizado();
      setOpen(false);
    } catch (error: any) {
      console.error("Error al actualizar usuario:", error);
      toast.error(
        error.response?.data?.mensaje || "Error al actualizar usuario"
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="icon" className="mr-2">
          <UserPen className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuario</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center p-4">Cargando...</div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              placeholder="RUT"
              value={usuario.rut}
              disabled
              className="bg-gray-100"
            />
            <Input
              placeholder="Nombre"
              value={formData.nombre}
              onChange={(e) =>
                setFormData({ ...formData, nombre: e.target.value })
              }
            />
            <Input
              placeholder="Apellido Paterno"
              value={formData.apellido_paterno}
              onChange={(e) =>
                setFormData({ ...formData, apellido_paterno: e.target.value })
              }
            />
            <Input
              placeholder="Apellido Materno"
              value={formData.apellido_materno}
              onChange={(e) =>
                setFormData({ ...formData, apellido_materno: e.target.value })
              }
            />
            <Input
              placeholder="Correo"
              value={formData.correo}
              onChange={(e) =>
                setFormData({ ...formData, correo: e.target.value })
              }
            />
            <Select
              value={formData.rolId.toString()}
              onValueChange={(value) =>
                setFormData({ ...formData, rolId: parseInt(value) })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar Rol" />
              </SelectTrigger>
              <SelectContent>
                {roles.map((rol) => (
                  <SelectItem
                    key={rol.id_rol.toString()}
                    value={rol.id_rol.toString()}
                  >
                    {rol.nombre_rol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select
              value={formData.areaId?.toString() || ""}
              onValueChange={(value) =>
                setFormData({
                  ...formData,
                  areaId: value ? parseInt(value) : null,
                })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar Área" />
              </SelectTrigger>
              <SelectContent>
                {areas.map((area) => (
                  <SelectItem
                    key={area.id_area.toString()}
                    value={area.id_area.toString()}
                  >
                    {area.nombre_area}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button type="submit" className="w-full">
              Guardar Cambios
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
