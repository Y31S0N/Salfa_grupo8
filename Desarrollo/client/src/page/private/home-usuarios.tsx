import React, { useEffect, useState } from "react";
import capacitaciones from "@/assets/capacitacion.png";
import mantenimiento from "@/assets/mantenimiento.png";
import seguridad from "@/assets/seguridad.png";
import { Link } from "react-router-dom";
import { Button } from '../../components/ui/button'
import { Toaster, toast } from 'sonner';
import { useUser } from "../../contexts/UserContext";
import { Card, CardHeader, CardTitle, CardContent, CardDescription, CardFooter } from "../../components/ui/card"
import { SearchBar } from "../../components/ui/barra_busqueda";


interface CardProps {
    name: string;
    image: string;
}
interface Curso {
    id_curso: number;
    nombre_curso: string;
    descripcion_curso: string;
    estado_curso: boolean;
    fecha_limite: string;
}
// function CourseCard({ name, image }: CardProps) {
//     return (
//         <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <img src={image} alt={name} className="w-full h-32 object-cover" />
//             <div className="p-4">
//                 <h3 className="text-lg font-semibold text-gray-800">{name}</h3>
//             </div>
//         </div>
//     );
// }

const HomeUsuarios = () => {
    const { user } = useUser();
    const [cursos, setCursos] = useState<Curso[]>([]);

    const fetchCursos = async (userRut) => {
        try {
            const response = await fetch(`http://localhost:3000/api/cursosNoUsuario/${userRut}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`)
            }
            const data = await response.json();
            setCursos(data);
        } catch (error) {
            console.error("Error al obtener los cursos:", error);
            toast("Error al cargar los cursos");
        }
    };

    useEffect(() => {
        if (user?.rut) {
            fetchCursos(user.rut);
        }
    }, [user?.rut])
    return (
        <>
            <Toaster />
            <h2 className="text-3xl font-bold mb-4 text-center">Cursos Disponibles</h2>
            {/* <SearchBar onSearch={handleSearch} setFilter={setFilter} /> */}
            {/* <h2 className="text-3xl font-semibold text-gray-800">
                    Cursos Disponibles
                </h2> */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {cursos.map((curso) => (
                    <Card key={curso.id_curso}>
                        <CardHeader>
                            <img
                                src={capacitaciones}
                                alt={curso.nombre_curso}
                                className="w-full h-40 object-cover rounded-md"
                            />
                            <CardTitle className="pt-3 pb-1">{curso.nombre_curso}</CardTitle>
                            <CardDescription>{curso.descripcion_curso}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            {/* <CardDescription
                                className="mb-3 overflow-hidden text-ellipsis line-clamp-3"
                                style={{
                                    display: '-webkit-box',
                                    WebkitLineClamp: 3,
                                    WebkitBoxOrient: 'vertical',
                                }}
                            >
                                {curso.descripcion_curso}
                            </CardDescription> */}
                            {/* Otros contenidos */}
                        </CardContent>
                        <CardFooter>
                            <Link to={`/verCursoUsuario/${curso.id_curso}`}>
                                <Button variant="outline">Ver Detalles</Button>
                            </Link>
                        </CardFooter>
                    </Card>
                ))}
            </div>

        </>
    );
}
export default HomeUsuarios;