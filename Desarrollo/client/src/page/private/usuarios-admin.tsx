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

interface User {
  id: number;
  name: string;
  email: string;
}

// Simular datos de usuarios
const mockUsers: User[] = Array.from({ length: 50 }, (_, i) => ({
  id: i + 1,
  name: `Usuario ${i + 1}`,
  email: `usuario${i + 1}@example.com`,
}));

export default function ManejoUsuarios() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingUser, setEditingUser] = useState<User | null>(null);

  const usersPerPage = 10;
  const totalPages = Math.ceil(users.length / usersPerPage);

  const getCurrentUsers = () => {
    const startIndex = (currentPage - 1) * usersPerPage;
    return users.slice(startIndex, startIndex + usersPerPage);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      setUsers(
        users.map((user) => (user.id === editingUser.id ? editingUser : user))
      );
      setEditingUser(null);
    }
  };

  const handleDeleteUser = (id: number) => {
    setUsers(users.filter((user) => user.id !== id));
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
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {getCurrentUsers().map((user) => (
            <TableRow key={user.id}>
              <TableCell>{user.id}</TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
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