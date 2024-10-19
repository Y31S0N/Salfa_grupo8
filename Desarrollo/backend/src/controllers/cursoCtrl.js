import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const listarCurso = async (req, res) => {

    const uid = parseInt(req.params.id)

    try {
        const courseRecord = await prisma.cursoCapacitacion.findUnique({
            where: {
                "id_curso": uid,
            },
        });
        res.status(200).json(courseRecord);
    } catch (error) {
        console.log("Error al Listar el curso");
        res.status(500).json({ error: error.message });

    }
}

export const listarCursos = async (req, res) => {
    try {
        const cursos = await prisma.cursoCapacitacion.findMany();
        res.json(cursos);
    } catch (error) {
        console.log("Error al Listar los cursos");
        res.status(500).json({ error: error.message });
    }
}

export const crearCurso = async (req, res) => {
    try {
        const nuevoCurso = await prisma.cursoCapacitacion.create({
            data: req.body,
        });

        res.status(201).json({ curso: nuevoCurso });
    } catch (error) {
        console.error("Error al crear el curso:", error);
        res.status(500).json({ error: error.message });
    }
}

export const modificarCurso = async (req, res) => {

    const { nombre_curso, descripcion_curso, fecha_creacion, fecha_limite, estado_curso } = req.body;

    try {
        await prisma.cursoCapacitacion.update({
            where: { id_curso: parseInt(req.params.id) },
            data: {
                nombre_curso,
                descripcion_curso,
                fecha_creacion,
                fecha_limite,
                estado_curso
            }
        });
        res.status(200).json({ message: "Curso Modificadio exitosamente" });
    } catch (error) {
        console.error("Error al Modificar el curso:", error);
        res.status(500).json({ error: error.message });
    }
}


export const eliminarCurso = async (req, res) => {

    const { id } = req.params;

    try {
        await prisma.cursoCapacitacion.delete({
            where: { id_curso: Number(id) },
        });

        res.status(204).send();
    } catch (error) {
        console.error("Error al eliminar el curso:", error);
        res.status(500).json({ error: error.message });
    }
}