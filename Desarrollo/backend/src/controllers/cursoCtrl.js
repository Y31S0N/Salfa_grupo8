import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const crearcursos = async (req, res) => {
  try {
    const newCurso = await prisma.cursoCapacitacion.create({
      data: req.body,
      include: { modulos: true },
    });
    console.log(newCurso);
    res.status(201).json(newCurso); // Código 201 para recurso creado
  } catch (error) {
    console.error("Error al crear curso:", error);
    res.status(500).json({ error: "Error al crear el curso" });
  }
};

export const obtenerCursos = async (req, res) => {
  try {
    const cursos = await prisma.cursoCapacitacion.findMany();
    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos:", error);
    res.status(500).json({ error: "Error al obtener cursos" });
  }
};

export const obtenerCurso = async (req, res) => {
  try {
    const cursobuscado = await prisma.cursoCapacitacion.findUnique({
      where: {
        id_curso: parseInt(req.params.id),
      },
    });

    if (!cursobuscado)
      return res.status(404).json({ error: "No hay ningún curso con ese ID" });

    return res.json(cursobuscado);
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    res.status(500).json({ error: "Error al obtener el curso" });
  }
};

export const deleteCurso = async (req, res) => {
  try {
    await prisma.cursoCapacitacion.delete({
      where: {
        id_curso: parseInt(req.params.id),
      },
    });

    return res.status(204).send(); // Respuesta sin contenido
  } catch (error) {
    console.error("Error al eliminar el curso:", error);
    if (error.code === "P2025") {
      // Código de error de Prisma si no se encuentra
      return res
        .status(404)
        .json({ error: "No hay ningún curso con ese ID para eliminar" });
    }
    res.status(500).json({ error: "Error al eliminar el curso" });
  }
};

export const editCurso = async (req, res) => {
  const { nombre_curso, descripcion_curso, fecha_limite, estado_curso } =
    req.body; // Desestructurando los campos del cuerpo

  try {
    const updatedCurso = await prisma.cursoCapacitacion.update({
      where: { id_curso: parseInt(req.params.id) },
      data: {
        nombre_curso,
        descripcion_curso,
        fecha_limite,
        estado_curso,
      },
    });

    return res.json(updatedCurso);
  } catch (error) {
    console.error("Error al actualizar el curso:", error);
    if (error.code === "P2025") {
      return res
        .status(404)
        .json({ error: "No hay ningún curso con ese ID para actualizar" });
    }
    res.status(500).json({ error: "Error al actualizar el curso" });
  }
};

export const obtenerCursosUsuario = async (req, res) => {
  const { usuarioId } = req.params;

  try {
    const cursos = await prisma.cursoCapacitacion.findMany({
      where: {
        cursoAsignados: {
          some: {
            usuarioId: usuarioId,
          },
        },
        estado_curso: true,
      },
    });
    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos por ID:", error);
    res.status(500).json({ error: "Error al obtener cursos" });
  }
};

export const obtenerCursosNoUsuario = async (req, res) => {
  const { usuarioId } = req.params;
  try {
    const cursos = await prisma.cursoCapacitacion.findMany({
      where: {
        cursoAsignados: {
          none: {
            usuarioId: usuarioId,
          },
        },
        estado_curso: true,
      },
    });
    res.json(cursos);
  } catch (error) {
    console.error("Error al obtener cursos por no ID:", error);
    res.status(500).json({ error: "Error al obtener cursos" });
  }
};

export const obtenerCursoEstructura = async (req, res) => {
  const { id } = req.params;

  try {
    const curso = await prisma.cursoCapacitacion.findUnique({
      where: {
        id_curso: parseInt(id),
      },
      include: {
        modulos: {
          where: {},
          include: {
            lecciones: {},
          },
        },
      },
    });
    if (!curso) {
      return res.status(404).json({ error: "Curso no encontrado" });
    }
    res.json(curso);
  } catch (error) {
    console.error("Error al obtener el curso:", error);
    res.status(500).json({ error: "Error al obtener el curso" });
  }
};
