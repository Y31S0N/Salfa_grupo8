import { auth } from "../../firebase/firebaseAdminConfig.js";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

import {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_EXPIRES_IN,
} from "../config/jwtConfig.js";

const prisma = new PrismaClient();

export const crearUsuario = async (req, res) => {
  const {
    rut,
    nombre,
    apellido_paterno,
    apellido_materno,
    correo,
    rolId,
    areaId,
  } = req.body;

  try {
    // Verificar si el usuario ya existe por RUT o correo
    const usuarioExistente = await prisma.usuario.findFirst({
      where: {
        OR: [{ rut }, { correo }],
      },
    });

    if (usuarioExistente) {
      return res.status(400).json({ mensaje: "El usuario ya existe" });
    }

    // Crear nuevo usuario
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        rut,
        nombre,
        apellido_paterno,
        apellido_materno,
        correo,
        rolId,
        areaId: areaId || undefined, // Si no se proporciona areaId, lo dejamos como undefined
      },
      include: {
        rol: true,
        Area: true,
      },
    });
    const nuevoUsuarioFirebase = await auth.createUser({
      email: correo,
      password: generarContraseñaAleatoria(),
    });
    res.status(201).json({
      mensaje: "Usuario creado exitosamente",
      usuario: nuevoUsuario,
    });
  } catch (error) {
    console.error("Error al crear usuario:", error);
    res.status(500).json({ mensaje: "Error al crear usuario" });
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

    // Obtener el estado de Firebase para cada usuario
    const usuariosConEstado = await Promise.all(
      usuarios.map(async (usuario) => {
        try {
          const userRecord = await auth.getUserByEmail(usuario.correo);
          return {
            ...usuario,
            estadoFirebase: !userRecord.disabled,
          };
        } catch (error) {
          console.error(
            `Error al obtener estado de Firebase para ${usuario.correo}:`,
            error
          );
          return {
            ...usuario,
            estadoFirebase: true, // valor por defecto si hay error
          };
        }
      })
    );

    res.json({ usuarios: usuariosConEstado });
  } catch (error) {
    console.error("Error al obtener usuarios:", error);
    res.status(500).json({
      mensaje: "Error al obtener usuarios",
      error: error.message,
    });
  }
};

export const login = async (req, res) => {
  const { idToken } = req.body;

  try {
    const decodedToken = await auth.verifyIdToken(idToken);
    const email = decodedToken.email;

    const usuario = await prisma.usuario.findUnique({
      where: { correo: email },
      include: { rol: true },
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    const token = jwt.sign(
      { uid: usuario.id, rol: usuario.rol.nombre_rol },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN, algorithm: "HS256" }
    );
    const refreshToken = jwt.sign({ uid: usuario.id }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });

    res.json({ token, refreshToken, role: usuario.rol.nombre_rol });
  } catch (error) {
    console.error("Error en login:", error);
    res.status(401).json({ mensaje: "Autenticación fallida" });
  }
};

export const refreshToken = async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ mensaje: "No se proporcionó token de refresco" });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    const usuario = await prisma.usuario.findUnique({
      where: { id: decoded.uid },
      include: { rol: true },
    });

    if (!usuario || usuario.refreshToken !== refreshToken) {
      return res.status(403).json({ mensaje: "Token de refresco inválido" });
    }

    const newToken = jwt.sign(
      { uid: usuario.id, rol: usuario.rol.nombre },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRES_IN }
    );

    res.json({ token: newToken });
  } catch (error) {
    console.error("Error al refrescar token:", error);
    res.status(403).json({ mensaje: "Token de refresco inválido" });
  }
};

export const getUserInfo = async (req, res) => {
  try {
    const userEmail = req.user.email;

    const usuario = await prisma.usuario.findUnique({
      where: { correo: userEmail },
      include: {
        rol: true,
        Area: true,
      },
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
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
    res.status(500).json({ mensaje: "Error interno del servidor" });
  }
};

export const toggleEstadoUsuario = async (req, res) => {
  const { correo, estado } = req.body;

  try {
    // Obtener usuario de Firebase
    const userRecord = await auth.getUserByEmail(correo);

    // Actualizar estado en Firebase
    // Si estado es true, queremos que el usuario esté habilitado (disabled: false)
    // Si estado es false, queremos que el usuario esté deshabilitado (disabled: true)
    await auth.updateUser(userRecord.uid, {
      disabled: estado, // Cambiamos esto, ya no necesitamos invertir el estado
    });

    const usuarioActualizado = await auth.getUserByEmail(correo);

    res.status(200).json({
      mensaje: `Usuario ${estado ? "inhabilitado" : "habilitado"} exitosamente`,
      estadoFirebase: !estado,
    });
  } catch (error) {
    console.error("Error al actualizar estado del usuario:", error);
    res.status(500).json({
      mensaje: "Error al actualizar estado del usuario",
      error: error.message,
    });
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

export const crearUsuariosBulk = async (req, res) => {
  const { usuarios } = req.body;
  const resultados = [];

  try {
    for (const usuario of usuarios) {
      try {
        // Verificar si el usuario ya existe
        const usuarioExistente = await prisma.usuario.findFirst({
          where: {
            OR: [{ rut: usuario.rut }, { correo: usuario.correo }],
          },
        });

        if (usuarioExistente) {
          resultados.push({
            success: false,
            usuario: usuario,
            mensaje: `Usuario con RUT ${usuario.rut} o correo ${usuario.correo} ya existe`,
          });
          continue;
        }

        // Crear usuario en la base de datos
        const nuevoUsuario = await prisma.usuario.create({
          data: {
            rut: usuario.rut,
            nombre: usuario.nombre,
            apellido_paterno: usuario.apellido_paterno,
            apellido_materno: usuario.apellido_materno,
            correo: usuario.correo,
            rolId: usuario.rolId,
            areaId: usuario.areaId || undefined,
          },
          include: {
            rol: true,
            Area: true,
          },
        });

        // Crear usuario en Firebase
        const nuevoUsuarioFirebase = await auth.createUser({
          email: usuario.correo,
          password: "prueba12345", //generarContraseñaAleatoria(),
        });

        resultados.push({
          success: true,
          usuario: nuevoUsuario,
          mensaje: "Usuario creado exitosamente",
        });
      } catch (error) {
        resultados.push({
          success: false,
          usuario: usuario,
          mensaje: `Error al crear usuario: ${error.message}`,
        });
      }
    }

    // Enviar resumen de resultados
    const exitosos = resultados.filter((r) => r.success).length;
    const fallidos = resultados.filter((r) => !r.success).length;

    res.status(200).json({
      mensaje: `Proceso completado. ${exitosos} usuarios creados exitosamente, ${fallidos} fallidos.`,
      resultados: resultados,
    });
  } catch (error) {
    console.error("Error en la carga masiva:", error);
    res.status(500).json({
      mensaje: "Error en el proceso de carga masiva",
      error: error.message,
    });
  }
};

// Función auxiliar para generar una contraseña aleatoria
const generarContraseñaAleatoria = () => {
  return Math.random().toString(36).slice(-8);
};
