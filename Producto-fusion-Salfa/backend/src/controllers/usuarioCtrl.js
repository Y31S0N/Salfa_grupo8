import { auth } from "../../firebase/firebaseAdminConfig.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import * as XLSX from 'xlsx';
import { Readable } from 'stream';
import multer from 'multer';

const prisma = new PrismaClient();

// Configurar multer para manejar archivos
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || 
      file.mimetype === 'application/vnd.ms-excel'
    ) {
      cb(null, true);
    } else {
      cb(new Error('Solo se permiten archivos Excel (.xlsx, .xls)'), false);
    }
  }
}).single('file');

export const obtenerUsuarioYCursos = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        rut: id,
      },
      include: {
        cursoAsignados: {
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
        Area: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    // Calcular el progreso de cada curso
    usuario.cursoAsignados = await Promise.all(
      usuario.cursoAsignados.map(async (asignacion) => {
        const curso = asignacion.curso;

        // Contar las lecciones completas
        const totalLecciones = curso.modulos.reduce(
          (acc, modulo) => acc + modulo.lecciones.length,
          0
        );
        const leccionesCompletas = curso.modulos.reduce((acc, modulo) => {
          return (
            acc +
            modulo.lecciones.filter(
              (leccion) => leccion.estado_leccion === true
            ).length
          );
        }, 0);

        // Calcular el progreso como un porcentaje
        const progreso =
          totalLecciones > 0 ? (leccionesCompletas / totalLecciones) * 100 : 0;

        // Añadir el progreso al curso
        return {
          ...asignacion,
          curso: {
            ...curso,
            progreso: progreso, // Agregar el progreso calculado
          },
        };
      })
    );

    res.json(usuario);
  } catch (error) {
    console.error("Error al obtener el usuario con cursos:", error);
    res.status(500).json({ error: "Error al obtener el usuario y sus cursos" });
  }
};

export const obtenerUsuarios = async (req, res) => {
  try {
    const { id_area } = req.query;
    let usuarios;

    if (id_area) {
      usuarios = await prisma.usuario.findMany({
        where: {
          areaId: parseInt(id_area),
        },
        include: {
          rol: true,
          Area: true,
        },
      });
    } else {
      usuarios = await prisma.usuario.findMany({
        include: {
          rol: true,
          Area: true,
        },
      });
    }

    res.json({ usuarios });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      mensaje: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    // Obtenemos el RUT del token verificado por authMiddleware
    const userRut = req.user.rut;

    const usuario = await prisma.usuario.findUnique({
      where: { rut: userRut },
      include: {
        rol: true,
        Area: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({
        mensaje: "Usuario no encontrado",
        details: `No se encontró usuario con RUT: ${userRut}`,
      });
    }

    res.json({
      role: usuario.rol.nombre_rol,
      rut: usuario.rut,
      nombre: usuario.nombre,
      apellido_paterno: usuario.apellido_paterno,
      apellido_materno: usuario.apellido_materno,
      area: usuario.Area?.nombre_area,
      correo: usuario.correo,
    });
  } catch (error) {
    console.error("Error al obtener información del usuario:", error);
    res.status(500).json({
      mensaje: "Error interno del servidor",
      details: error.message,
    });
  }
};

export const usuarioConCursosYLecciones = async (req, res) => {
  const { id } = req.params;

  try {
    const usuario = await prisma.usuario.findUnique({
      where: {
        rut: id,
      },
      include: {
        cursoAsignados: {
          include: {
            curso: {
              include: {
                modulos: {
                  include: {
                    lecciones: {
                      include: {
                        Cumplimiento_leccion: {
                          where: {
                            usuarioId: id,
                          },
                        },
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

    if (!usuario) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    return res.json(usuario);
  } catch (error) {
    console.error("Error en la consulta de usuario:", error);
    return res.status(500).json({ message: "Error en la consulta" });
  }
};

export const actualizarUsuario = async (req, res) => {
  const rut = req.params.rut; // Obtenemos el RUT de los parámetros de la URL
  const { nombre, apellido_paterno, apellido_materno, correo, rolId, areaId } =
    req.body;

  try {
    // Verificar si existe otro usuario con el mismo correo (excluyendo el usuario actual)
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        correo,
        NOT: { rut: rut },
      },
    });

    if (usuarioExistente) {
      return res
        .status(400)
        .json({ mensaje: "El correo ya está en uso por otro usuario" });
    }
    const usuarioActual = await prisma.usuario.findUnique({
      where: { rut: rut },
    });
    const usuarioActualizado = await prisma.usuario.update({
      where: { rut: rut },
      data: {
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        rolId,
        areaId: areaId || undefined,
      },
      include: {
        rol: true,
        Area: true,
      },
    });

    // Actualizar correo en Firebase si cambió
    try {
      const userRecord = await auth.getUserByEmail(usuarioActual.correo);
      await auth.updateUser(userRecord.uid, {
        email: correo,
      });
    } catch (firebaseError) {
      throw firebaseError;
    }

    res.json({
      mensaje: "Usuario actualizado exitosamente",
      usuario: usuarioActualizado,
    });
  } catch (error) {
    console.error("Error al actualizar usuario:", error);
    res.status(500).json({
      mensaje: "Error al actualizar usuario",
      error: error.message,
    });
  }
};

// Función para estandarizar formato de RUT
const estandarizarRut = (rut) => {
  // Eliminar puntos y guión
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
  // Formatear como XXXXXXXX-Y
  return rutLimpio.slice(0, -1) + '-' + rutLimpio.slice(-1).toUpperCase();
};

export const crearUsuariosBulk = async (req) => {
  const { usuarios } = req.body;
  const resultados = {
    creados: [],
    existentes: [],
    errores: []
  };

  try {
    for (const usuario of usuarios) {
      try {
        const rutFormateado = estandarizarRut(usuario.rut);
        const usuarioExistente = await prisma.usuario.findFirst({
          where: { rut: rutFormateado }
        });

        if (usuarioExistente) {
          // Actualizar usuario existente si es necesario
          if (
            usuarioExistente.nombre !== usuario.nombre ||
            usuarioExistente.apellido_paterno !== usuario.apellido_paterno ||
            usuarioExistente.apellido_materno !== usuario.apellido_materno ||
            usuarioExistente.correo !== usuario.correo ||
            usuarioExistente.activo !== usuario.activo // Comparar directamente los booleanos
          ) {
            await prisma.usuario.update({
              where: { rut: rutFormateado },
              data: {
                nombre: usuario.nombre,
                apellido_paterno: usuario.apellido_paterno,
                apellido_materno: usuario.apellido_materno,
                correo: usuario.correo,
                activo: usuario.activo // Usar el booleano directamente
              }
            });

            resultados.existentes.push({
              rut: rutFormateado,
              correo: usuario.correo,
              mensaje: "Usuario actualizado exitosamente"
            });
          } else {
            resultados.existentes.push({
              rut: rutFormateado,
              correo: usuario.correo,
              mensaje: "Usuario ya existe y no requiere actualización"
            });
          }
          continue;
        }

        // Crear nuevo usuario
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(usuario.contrasena, salt);

        const nuevoUsuario = await prisma.usuario.create({
          data: {
            rut: rutFormateado,
            nombre: usuario.nombre,
            apellido_paterno: usuario.apellido_paterno,
            apellido_materno: usuario.apellido_materno,
            correo: usuario.correo,
            contrasena: hashedPassword,
            rolId: Number(usuario.rolId),
            areaId: Number(usuario.areaId),
            activo: usuario.activo // Usar el booleano directamente
          }
        });

        // Crear en Firebase
        await auth.createUser({
          email: usuario.correo,
          password: usuario.contrasena,
          disabled: !usuario.activo // Usar el booleano directamente
        });

        resultados.creados.push({
          rut: rutFormateado,
          correo: usuario.correo,
          mensaje: "Usuario creado exitosamente"
        });

      } catch (error) {
        resultados.errores.push({
          rut: usuario.rut,
          mensaje: error.message
        });
      }
    }

    return resultados; // Retornar los resultados en lugar de enviar respuesta

  } catch (error) {
    throw error; // Propagar el error para manejarlo en el nivel superior
  }
};

export const eliminarUsuarios = async (req, res) => {
  const { usuarios } = req.body;
  const resultados = [];

  try {
    for (const rut of usuarios) {
      try {
        // Obtener el usuario para verificar que existe
        const usuario = await prisma.usuario.findUnique({
          where: { rut },
          include: {
            respuestas: true,
            encuestasAsignadas: true,
            RegistroVisualizacionContenido: true,
            cumplimiento_lecciones: true,
            cursoAsignados: true,
          },
        });

        if (!usuario) {
          resultados.push({
            success: false,
            rut,
            mensaje: "Usuario no encontrado",
          });
          continue;
        }

        // Verificar registros relacionados y construir mensaje
        const registrosActivos = [];
        if (usuario.respuestas.length > 0) {
          registrosActivos.push("respuestas a encuestas");
        }
        if (usuario.encuestasAsignadas.length > 0) {
          registrosActivos.push("encuestas asignadas");
        }
        if (usuario.RegistroVisualizacionContenido.length > 0) {
          registrosActivos.push("registros de visualización de contenido");
        }
        if (usuario.cumplimiento_lecciones.length > 0) {
          registrosActivos.push("lecciones completadas");
        }
        if (usuario.cursoAsignados.length > 0) {
          registrosActivos.push("cursos asignados");
        }

        if (registrosActivos.length > 0) {
          resultados.push({
            success: false,
            rut,
            mensaje: `No se puede eliminar el usuario porque tiene actividad en la plataforma: ${registrosActivos.join(
              ", "
            )}`,
          });
          continue;
        }

        // Si no hay registros activos, proceder con la eliminación
        await prisma.usuario.delete({
          where: { rut },
        });

        resultados.push({
          success: true,
          rut,
          mensaje: "Usuario eliminado exitosamente",
        });
      } catch (error) {
        console.error(`Error procesando usuario ${rut}:`, error);
        resultados.push({
          success: false,
          rut,
          mensaje: `Error al eliminar usuario: ${error.message}`,
        });
      }
    }

    const exitosos = resultados.filter((r) => r.success).length;
    const fallidos = resultados.filter((r) => !r.success).length;

    res.status(200).json({
      mensaje: `Proceso completado. ${exitosos} usuarios eliminados exitosamente, ${fallidos} fallidos.`,
      resultados,
    });
  } catch (error) {
    console.error("Error general en la eliminación de usuarios:", error);
    res.status(500).json({
      mensaje: "Error en el proceso de eliminación",
      error: error.message,
    });
  }
};

// Función para validar RUT chileno
const validarRutChileno = (rut) => {
  if (!rut) return false;

  // Limpiar el RUT de puntos y guiones
  const rutLimpio = rut.replace(/\./g, '').replace(/-/g, '');
  
  // Obtener dígito verificador
  const dv = rutLimpio.slice(-1).toUpperCase();
  // Obtener cuerpo del RUT
  const rutNumerico = parseInt(rutLimpio.slice(0, -1));

  if (rutNumerico <= 0 || rutNumerico > 50000000) return false;

  // Calcular dígito verificador
  const calcularDV = (rutNumerico) => {
    let suma = 0;
    let multiplicador = 2;
    let rutReverso = rutNumerico.toString().split('').reverse();

    for (let digito of rutReverso) {
      suma += parseInt(digito) * multiplicador;
      multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resultado = 11 - (suma % 11);
    if (resultado === 11) return '0';
    if (resultado === 10) return 'K';
    return resultado.toString();
  };

  return calcularDV(rutNumerico) === dv;
};

const validarUsuario = async (usuario) => {
  const errores = [];

  // Validar que el RUT sea válido (sin importar formato)
  if (!validarRutChileno(usuario.rut)) {
    errores.push(`RUT inválido: ${usuario.rut}`);
  }

  // Validar campos requeridos
  if (!usuario.nombre?.trim()) {
    errores.push('El nombre es requerido');
  }
  if (!usuario.apellido_paterno?.trim()) {
    errores.push('El apellido paterno es requerido');
  }
  if (!usuario.apellido_materno?.trim()) {
    errores.push('El apellido materno es requerido');
  }

  // Validar correo
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!usuario.correo || !emailRegex.test(usuario.correo)) {
    errores.push(`Correo inválido: ${usuario.correo}`);
  }

  // Validar contraseña
  if (!usuario.contrasena || usuario.contrasena.length < 6) {
    errores.push('La contraseña debe tener al menos 6 caracteres');
  }

  // Validar rol (solo 1 o 2)
  const rolId = Number(usuario.rolId);
  if (!rolId || ![1, 2].includes(rolId)) {
    errores.push('El rol debe ser 1 o 2');
  }

  // Validar que el área exista
  if (usuario.areaId) {
    try {
      const areaExiste = await prisma.area.findUnique({
        where: { id_area: Number(usuario.areaId) }
      });
      if (!areaExiste) {
        errores.push(`El área ${usuario.areaId} no existe`);
      }
    } catch (error) {
      errores.push('Error al validar el área');
    }
  } else {
    errores.push('El área es requerida');
  }

  return errores;
};

export const procesarArchivoCargaUsuarios = async (req, res) => {
  try {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ mensaje: "Error al procesar el archivo", error: err.message });
      }

      if (!req.file) {
        return res.status(400).json({ mensaje: "No se proporcionó ningún archivo" });
      }

      try {
        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const rawData = XLSX.utils.sheet_to_json(worksheet);

        // Validar y formatear usuarios
        const usuariosValidos = [];
        const erroresValidacion = [];

        // Validar todos los usuarios primero
        for (const [index, row] of rawData.entries()) {
          const errores = await validarUsuario(row);
          if (errores.length > 0) {
            erroresValidacion.push({
              fila: index + 2,
              rut: row.rut,
              errores: errores
            });
          } else {
            // Asegurarnos de que activo sea un booleano
            const activoBoolean = row.activo?.toString().toLowerCase() === 'true';
            
            usuariosValidos.push({
              rut: row.rut,
              nombre: row.nombre.trim(),
              apellido_paterno: row.apellido_paterno.trim(),
              apellido_materno: row.apellido_materno.trim(),
              correo: row.correo.trim(),
              contrasena: row.contrasena,
              rolId: Number(row.rolId),
              areaId: Number(row.areaId),
              activo: activoBoolean // Asignar el booleano directamente
            });
          }
        }

        let resultadoCreacion = null;
        
        // Solo procesar usuarios si hay válidos
        if (usuariosValidos.length > 0) {
          try {
            resultadoCreacion = await crearUsuariosBulk({ 
              body: { usuarios: usuariosValidos }
            });
          } catch (error) {
            console.error("Error al crear usuarios:", error);
            erroresValidacion.push({
              fila: 'general',
              rut: 'multiple',
              errores: [`Error al crear usuarios: ${error.message}`]
            });
          }
        }

        // Una única respuesta con todos los resultados
        return res.status(200).json({
          mensaje: `Proceso completado: ${usuariosValidos.length} usuarios válidos, ${erroresValidacion.length} con errores`,
          resultadoCreacion: resultadoCreacion?.resultados || null,
          erroresValidacion: erroresValidacion
        });

      } catch (error) {
        // Error al procesar el archivo
        return res.status(500).json({
          mensaje: "Error al procesar el archivo",
          error: error.message
        });
      }
    });
  } catch (error) {
    // Error general del servidor
    return res.status(500).json({
      mensaje: "Error en el servidor",
      error: error.message
    });
  }
};
