'use client'

import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Toaster, toast } from 'sonner';
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { PlusCircle, Search } from 'lucide-react'

import { useEffect } from "react";
import { DialogHeader, Dialog, DialogContent, DialogTrigger, DialogTitle } from '@/components/ui/dialog'
import FormularioArea from './nueva-area'

import { useNavigate } from 'react-router-dom';


export default function ListadoAreas() {
    const [open, setOpen] = useState(false);
    const [busqueda, setBusqueda] = useState('')
    const [areas, setAreas] = useState<any[]>([])

    const navigate = useNavigate();

    const handleVerUsuarios = (userId: string): void => {
        navigate(`/listado_cursos?area=${userId}`);
    }

    const cargarAreas = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/area/')
            if (!response.ok) {
                throw new Error("HHTP error! status:");
            }
            const data = await response.json()
            setAreas(data);
        } catch (error) {
            console.error('Error al cargar áreas:', error);
        }
    }
    const handleCreateArea = () => {
        setOpen(false);
        cargarAreas();
    };

    const areasFiltradas = areas.filter(area =>
        area.nombre_area.toLowerCase().includes(busqueda.toLowerCase())
    )
    useEffect(() => {
        cargarAreas();
    }, []);

    return (
        <div className="container mx-auto p-4">
            <Toaster />
            <h1 className="text-2xl font-bold mb-6">Listado de Áreas</h1>

            <div className="flex items-center space-x-2 mb-6">
                <Input
                    type="text"
                    placeholder="Buscar áreas..."
                    value={busqueda}
                    onChange={(e) => setBusqueda(e.target.value)}
                    className="flex-grow"
                />
                <Button variant="outline" size="icon">
                    <Search className="h-4 w-4" />
                    <span className="sr-only">Buscar</span>
                </Button>
            </div>


            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="mb-4" onClick={() => setOpen(true)}>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Crear área
                    </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle></DialogTitle>
                    </DialogHeader>
                    <FormularioArea onCreate={handleCreateArea} />
                </DialogContent>
            </Dialog>



            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {areasFiltradas.map((area) => (
                    <Card key={area.id_area}>
                        <CardHeader>
                            <CardTitle>{area.nombre_area}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-sm text-gray-600 mb-4">{area.descripcion}</p>
                            {/* <Link> */}
                            <Button onClick={() => handleVerUsuarios(area.id_area)} variant="outline" className="w-full">
                                Ver Usuarios
                            </Button>
                            {/* </Link> */}
                        </CardContent>
                    </Card>
                ))}
            </div>

            {areasFiltradas.length === 0 && (
                <p className="text-center text-gray-500 mt-6">
                    No se encontraron áreas que coincidan con la búsqueda.
                </p>
            )}
        </div>
    )
}