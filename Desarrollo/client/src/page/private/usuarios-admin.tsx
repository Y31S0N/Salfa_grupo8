"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle, Pencil, Trash2 } from "lucide-react";
import N_usuario from "./nuevo-usuario";

interface Usuario {
  rut: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  correo: string;
  contrasena: string;
  rol: string;
  area: string;
}

// Simular datos de usuarios
const usuarios: Usuario[] = [{
  rut: "217652343",
  nombre: "Carlos", apellido_paterno: "Alcayaga", apellido_materno: "Araneda",
  correo: "ca.alcayaga@salfamantenciones.cl", contrasena: "calcayaga2176",
  rol: "1",
  area: "2",
},
{
  rut: "22345876",
  nombre: "José", apellido_paterno: "Irving", apellido_materno: "Correa",
  correo: "cualquiera@salfamantenciones", contrasena: "jose22",
  rol: "3",
  area: "2",
},
{
  rut: "19345476",
  nombre: "Josefa", apellido_paterno: "Aliaga", apellido_materno: "Flores",
  correo: "jo.aliaga@salfamantenciones.cl", contrasena: "josefa19",
  rol: "3",
  area: "1",
}
];

export default function ManejoUsuarios() {
  const [users, setUsers] = useState<Usuario[]>(usuarios);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState(null);

  const usersPerPage = 10;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const getCurrentUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return users.slice(startIndex, startIndex + usersPerPage);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      const { rut } = editingUser;
      setUsers(
        users.map((user) => (user.rut === rut ? editingUser : user))
      );
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (id: string) => {
    setUsers(users.filter((user) => user.rut !== id));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Gestión de Usuarios</h1>

      <Dialog>
        <DialogTrigger asChild>
          <Button className="mb-4">
            <PlusCircle className="mr-2 h-4 w-4" />
            Crear Usuario
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader></DialogHeader>
          <N_usuario />
        </DialogContent>
      </Dialog>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>ID</TableHead>
            <TableHead>Nombre</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Rol</TableHead>
            <TableHead>Área</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getCurrentUsers().map((user) => (
            <TableRow key={user.rut}>
              <TableCell className="font-medium">{user.rut}</TableCell>
              <TableCell>{user.nombre} {user.apellido_paterno} {user.apellido_materno}</TableCell>
              <TableCell>{user.correo}</TableCell>
              <TableCell>{user.rol}</TableCell>
              <TableCell>{user.area}</TableCell>
              <TableCell>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="icon" className="mr-2">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Editar Usuario</DialogTitle>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <Input
                        placeholder="Nombre"
                        value={editingUser?.name || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser!,
                            name: e.target.value,
                          })
                        }
                      />
                      <Input
                        placeholder="Email"
                        value={editingUser?.email || ""}
                        onChange={(e) =>
                          setEditingUser({
                            ...editingUser!,
                            email: e.target.value,
                          })
                        }
                      />
                      <Button onClick={handleUpdateUser}>Actualizar</Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleDeleteUser(user.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <div className="flex justify-between items-center mt-4">
        <Button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Anterior
        </Button>
        <span>
          Página {currentPage} de {totalPages}
        </span>
        <Button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
}
