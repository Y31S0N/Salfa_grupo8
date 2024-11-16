import React, { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ChevronRight, ChevronDown, BookOpen } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../../components/ui/accordion"
// import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "../../components/ui/breadcrumbs"

interface Leccion {
    id_leccion: string
    nombre_leccion: string
    descripcion_leccion: string
    estado_leccion: string
}

interface Modulo {
    id_modulo: string
    nombre_modulo: string
    descripcion_modulo: string
    estado_modulo: boolean
    lecciones: Leccion[]
}

interface Curso {
    cursoId: string
    nombre_curso: string
    descripcion_curso: string
    modulos: Modulo[]
}

const DetalleCurso = () => {
    const { id } = useParams<{ id: string }>();

    const [curso, setCurso] = useState<Curso>();
    const fetchCursos = async (id_curso) => {
        try {
            const response = await fetch(`http://localhost:3000/api/cursoEstructura/${id_curso}`);
            if (!response.ok) {
                throw new Error(`HHTP error! status: ${response.status}`)
            }
            const data = await response.json();
            setCurso(data)
        } catch (error) {
            console.log("ERROOOR =>", error);
        }
    }
    useEffect(() => {
        fetchCursos(id);
    }, [id])
    console.log(curso);

    return (
        <div className="container mx-auto px-4 py-4">
            <Card className="mt-6">
                <CardHeader>
                    <CardTitle className="text-3xl mb-3">{curso?.nombre_curso}</CardTitle>
                    <CardDescription className="text-lg">{curso?.descripcion_curso}</CardDescription>
                </CardHeader>
                <CardContent>
                    <h2 className="text-2xl font-semibold mb-4">Módulos del Curso</h2>
                    <Accordion type="single" collapsible className="w-full">
                        {curso?.modulos.map((modulo) => (
                            <AccordionItem value={modulo.id_modulo} key={modulo.id_modulo}>
                                <AccordionTrigger className="text-lg font-medium">
                                    {modulo.nombre_modulo}
                                </AccordionTrigger>
                                <AccordionContent>
                                    <ul className="space-y-2">
                                        {modulo.lecciones.map((leccion) => (
                                            <li key={leccion.id_leccion} className="flex items-center space-x-2">
                                                <BookOpen className="h-4 w-4 text-muted-foreground" />
                                                <Link
                                                    to={`/courses/${curso.cursoId}/lessons/${leccion.id_leccion}`}
                                                    className="text-blue-600 hover:underline"
                                                >
                                                    {leccion.nombre_leccion}
                                                </Link>
                                            </li>
                                        ))}
                                    </ul>
                                </AccordionContent>
                            </AccordionItem>
                        ))}
                    </Accordion>
                </CardContent>
            </Card>
        </div>
    )
}

export default DetalleCurso;