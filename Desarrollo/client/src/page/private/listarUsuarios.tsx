'use client'

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom'; // Importa useNavigate
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../../components/ui/table";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../../components/ui/select";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Search } from 'lucide-react';
import { Toaster, toast } from 'sonner';

interface Usuario {
    id: string;
    rut: string;
    nombre: string;
    apellido_paterno: string;
    apellido_materno: string;
    correo: string;
    rol: {
        id_rol: Number,
        nombre_rol: string;
    };
    Area: {
        id_area: Number;
        nombre_area: string;
    };
    areaId: Number;
    rolId: Number;
}

interface Area {
    id_area: Number;
    nombre_area: string;
}

export default function ListadoUsuarios() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate(); // Inicializa useNavigate
    // const id_area = searchParams.get('id_area');

    const [usuarios, setUsuarios] = useState<Usuario[]>([]);
    const [busqueda, setBusqueda] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDept, setSelectedDept] = useState<string>("Todos");
    const [areas, setAreas] = useState<Area[]>([]);

    useEffect(() => {
        cargarAreas();
    }, []);
    // useEffect(() => {
    //     if (!id_area) {
    //         navigate("/listarUsuarios", {replace: true})
    //     }
    // }, [id_area, navigate])

    // useEffect(() => {
    //     if (id_area) {
    //         setSelectedDept(id_area);
    //     }
    //     cargarUsuarios(selectedDept);
    // }, [id_area]);

    useEffect(() => {
        cargarUsuarios(selectedDept);
        if (selectedDept === "Todos") {
            navigate('/listarUsuarios');
        } else {
            navigate(`?id_area=${selectedDept}`);
        }
    }, [selectedDept, navigate]);

    function formatRut(rut: Number) {
        const numero = rut.toString();
        if (numero.length === 9) {
            return `${numero.slice(0, 8)}-${numero.slice(8)}`;
        } else if (numero.length === 8) {
            return `${numero.slice(0, 7)}-${7}`;
        } else {
            return numero;
        }
    }

    const cargarAreas = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/area');
            if (!response.ok) {
                throw new Error(`HTTP Error! status: ${response.status}`);
            }
            const data = await response.json();
            setAreas(data);
        } catch (error) {
            console.error('Error al cargar Áreas', error);
            toast('Error al cargar los Áreas');
        }
    };

    const cargarUsuarios = async (area?: string) => {
        setIsLoading(true);
        try {
            let url = 'http://localhost:3000/api/usuarios/';
            if (area && area !== 'Todos') {
                url += `?id_area=${area}`;
            }
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const usuarios = data.usuarios.map(usr => ({
                ...usr,
                rut: formatRut(usr.rut)
            }));
            setUsuarios(usuarios);
        } catch (error) {
            console.error('Error al cargar usuarios:', error);
            toast.error('Error al cargar los usuarios');
        } finally {
            setIsLoading(false);
        }
    };

    const usuariosFiltrados = usuarios.filter(usuario => {
        const coincideBuscar = Object.values(usuario).some(value =>
            value && value.toString().toLowerCase().includes(busqueda.toLowerCase())
        );
        const coincideArea = selectedDept === 'Todos' || usuario.areaId.toString() === selectedDept;
        return coincideBuscar && coincideArea;
    });

    return (
        <div className="container mx-auto p-4">
            <Toaster />
            <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Listado de Usuarios</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center space-x-2 mb-6">
                        <Input
                            type="text"
                            placeholder="Buscar usuarios..."
                            value={busqueda}
                            onChange={(e) => setBusqueda(e.target.value)}
                            className="flex-grow"
                        />
                        <Button variant="outline" size="icon">
                            <Search className="h-4 w-4" />
                            <span className="sr-only">Buscar</span>
                        </Button>
                    </div>
                    <div className="mb-6">
                        <Select onValueChange={(value) => setSelectedDept(value)} value={selectedDept}>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Seleccionar Área" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="Todos">Todas las Áreas</SelectItem>
                                {areas.map((area) => (
                                    <SelectItem key={area.id_area.toString()} value={area.id_area.toString()}>
                                        {area.nombre_area}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {isLoading ? (
                        <div className="text-center py-4">Cargando usuarios...</div>
                    ) : (
                        <Table>
                            <TableCaption>Listado de usuarios registrados en el sistema</TableCaption>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>RUT</TableHead>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Apellido Paterno</TableHead>
                                    <TableHead>Apellido Materno</TableHead>
                                    <TableHead>Correo</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Área</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {usuariosFiltrados.map((usuario) => (
                                    <TableRow key={usuario.rut}>
                                        <TableCell>
                                            <Link to={`/dashboard-perfil-rh/${usuario.rut}`}>
                                                {usuario.rut}
                                            </Link>
                                        </TableCell>
                                        <TableCell>{usuario.nombre}</TableCell>
                                        <TableCell>{usuario.apellido_paterno}</TableCell>
                                        <TableCell>{usuario.apellido_materno}</TableCell>
                                        <TableCell>{usuario.correo}</TableCell>
                                        <TableCell>{usuario.rol.nombre_rol}</TableCell>
                                        <TableCell>{usuario.Area.nombre_area}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}

                    {!isLoading && usuariosFiltrados.length === 0 && (
                        <p className="text-center text-gray-500 mt-6">
                            No se encontraron usuarios que coincidan con la búsqueda.
                        </p>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
