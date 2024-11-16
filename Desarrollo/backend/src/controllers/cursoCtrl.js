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

export const obtenerEstadisticasCursos = async (req, res) => {
  try {
    // Obtener todos los cursos activos con información detallada
    const cursosActivos = await prisma.cursoCapacitacion.findMany({
      where: {
        estado_curso: true,
      },
      include: {
        cursoAsignados: {
          include: {
            usuario: {
              select: {
                rut: true,
                cumplimiento_lecciones: true,
              },
            },
          },
        },
        modulos: {
          include: {
            lecciones: true,
          },
        },
      },
    });

    // Procesar información de cursos
    const cursosProcesados = await Promise.all(
      cursosActivos.map(async (curso) => {
        const totalLecciones = curso.modulos.reduce(
          (total, modulo) => total + modulo.lecciones.length,
          0
        );

        const usuariosAsignados = curso.cursoAsignados.length;
        const usuariosCompletados = curso.cursoAsignados.filter(
          (asignacion) => {
            const leccionesCompletadas =
              asignacion.usuario.cumplimiento_lecciones.filter((cumplimiento) =>
                curso.modulos.some((modulo) =>
                  modulo.lecciones.some(
                    (leccion) =>
                      leccion.id_leccion === cumplimiento.leccionId &&
                      cumplimiento.estado === true
                  )
                )
              ).length;

            return leccionesCompletadas === totalLecciones;
          }
        ).length;

        return {
          id: curso.id_curso,
          nombre: curso.nombre_curso,
          descripcion: curso.descripcion_curso,
          usuariosAsignados,
          usuariosCompletados,
          completado:
            usuariosAsignados > 0 && usuariosAsignados === usuariosCompletados,
        };
      })
    );

    // Obtener total de cursos activos
    const totalCursos = await prisma.cursoCapacitacion.count({
      where: {
        estado_curso: true,
      },
    });

    // Obtener estadísticas por área
    const estadisticasPorArea = await prisma.area.findMany({
      select: {
        nombre_area: true,
        usuarios: {
          select: {
            rut: true,
            cursoAsignados: {
              where: {
                curso: {
                  estado_curso: true,
                },
              },
              include: {
                curso: {
                  include: {
                    modulos: {
                      include: {
                        lecciones: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // Procesar estadísticas por área
    const estadisticasProcesadas = await Promise.all(
      estadisticasPorArea.map(async (area) => {
        const cursosAsignadosPorArea = area.usuarios.flatMap(
          (u) => u.cursoAsignados
        );
        const cursosUnicos = [
          ...new Set(cursosAsignadosPorArea.map((ca) => ca.curso.id_curso)),
        ];

        let completados = 0;

        for (const cursoId of cursosUnicos) {
          const usuariosConCurso = area.usuarios.filter((u) =>
            u.cursoAsignados.some((ca) => ca.curso.id_curso === cursoId)
          );

          const todasLecciones =
            cursosAsignadosPorArea
              .find((ca) => ca.curso.id_curso === cursoId)
              ?.curso.modulos.flatMap((m) => m.lecciones) || [];

          if (todasLecciones.length === 0) continue;

          const todosCompletaron = await prisma.cumplimiento_leccion.findMany({
            where: {
              leccionId: {
                in: todasLecciones.map((l) => l.id_leccion),
              },
              usuarioId: {
                in: usuariosConCurso.map((u) => u.rut),
              },
            },
          });

          const cursoCompletado = usuariosConCurso.every((usuario) => {
            return todasLecciones.every((leccion) =>
              todosCompletaron.some(
                (cumplimiento) =>
                  cumplimiento.usuarioId === usuario.rut &&
                  cumplimiento.leccionId === leccion.id_leccion &&
                  cumplimiento.estado === true
              )
            );
          });

          if (cursoCompletado) {
            completados++;
          }
        }

        return {
          name: area.nombre_area,
          total: cursosUnicos.length,
          completed: completados,
        };
      })
    );

    const totalCompletados = estadisticasProcesadas.reduce(
      (sum, area) => sum + area.completed,
      0
    );
    const tasaFinalizacion =
      totalCursos > 0 ? Math.round((totalCompletados / totalCursos) * 100) : 0;

    res.json({
      total: totalCursos,
      completed: totalCompletados,
      completionRate: tasaFinalizacion,
      byDepartment: estadisticasProcesadas,
      cursos: cursosProcesados,
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({ error: "Error al obtener estadísticas de cursos" });
  }
};
