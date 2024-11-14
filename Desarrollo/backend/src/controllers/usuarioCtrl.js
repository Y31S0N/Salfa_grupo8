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

export const verificarUsuario = async (req, res) => {
  const {
    rut,
    correo,
    nombre,
    apellido_paterno,
    apellido_materno,
    rolId,
    areaId,
  } = req.body;

  try {
    const existeRutEnBD = await verificarRutEnBD(rut);
    const existeCorreoEnBD = await verificarCorreoEnBD(correo);
    const existeEnFirebase = await verificarEnFirebase(correo);

    // Verificar si el correo ya está asociado a otro RUT
    if (existeRutEnBD && !existeCorreoEnBD) {
      return res.status(400).json({
        accion: "Error",
        mensaje:
          "El RUT ya está registrado con otro correo. No se puede crear el usuario.",
      });
    }

    // Verificar si el RUT ya está asociado a otro correo
    if (!existeRutEnBD && existeCorreoEnBD) {
      return res.status(400).json({
        accion: "Error",
        mensaje:
          "El correo ya está registrado con otro RUT. No se puede crear el usuario.",
      });
    }

    if (existeRutEnBD && existeCorreoEnBD && existeEnFirebase) {
      // Caso 1: El usuario existe en ambos lados (no crear)
      return res.status(200).json({
        accion: "No crear",
        mensaje:
          "El usuario ya existe tanto en la base de datos como en Firebase.",
      });
    }

    if (existeRutEnBD && existeCorreoEnBD && !existeEnFirebase) {
      // Caso 2: Existe en la BD pero no en Firebase (crear en Firebase)
      const userRecord = await auth.createUser({
        email: correo,
        password: generarContraseñaAleatoria(),
      });
      return res.status(200).json({
        accion: "Creado en Firebase",
        mensaje:
          "El usuario ya existía en la base de datos y se ha creado en Firebase.",
        firebaseUid: userRecord.uid,
      });
    }

    if (!existeRutEnBD && !existeCorreoEnBD && !existeEnFirebase) {
      // Caso 3: No existe en ninguno (crear en ambos)
      const userRecord = await auth.createUser({
        email: correo,
        password: generarContraseñaAleatoria(),
      });
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          rut,
          nombre,
          apellido_paterno,
          apellido_materno,
          correo,
          rolId,
          areaId,
        },
      });
      return res.status(201).json({
        accion: "Creado en ambos",
        mensaje:
          "El usuario se ha creado tanto en la base de datos como en Firebase.",
        usuario: nuevoUsuario,
        firebaseUid: userRecord.uid,
      });
    }

    if (!existeRutEnBD && existeCorreoEnBD && existeEnFirebase) {
      // Caso 4: Existe en Firebase pero no en la base de datos (crear en BD)
      const nuevoUsuario = await prisma.usuario.create({
        data: {
          rut,
          nombre,
          apellido_paterno,
          apellido_materno,
          correo,
          rolId,
          areaId,
        },
      });
      return res.status(201).json({
        accion: "Creado en la base de datos",
        mensaje:
          "El usuario ya existía en Firebase y se ha creado en la base de datos.",
        usuario: nuevoUsuario,
      });
    }
  } catch (error) {
    console.error("Error al verificar usuario:", error);
    return res.status(500).json({
      accion: "Error",
      mensaje: "No se pudo determinar la acción a realizar.",
      error: error.message,
    });
  }
};

// Función para verificar si el rut existe en la base de datos
const verificarRutEnBD = async (rut) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { rut: rut },
    });
    return !!usuario; // Convierte el resultado a booleano
  } catch (error) {
    console.error("Error al verificar RUT en la base de datos:", error);
    return false; // En caso de error, asumimos que el usuario no existe
  }
};

// Función para verificar si el correo existe en la base de datos
const verificarCorreoEnBD = async (correo) => {
  try {
    const usuario = await prisma.usuario.findUnique({
      where: { correo: correo },
    });
    return !!usuario; // Convierte el resultado a booleano
  } catch (error) {
    console.error("Error al verificar correo en la base de datos:", error);
    return false; // En caso de error, asumimos que el usuario no existe
  }
};

// Función para verificar si el correo existe en Firebase
const verificarEnFirebase = async (correo) => {
  try {
    const userRecord = await auth.getUserByEmail(correo);
    const existeEnFirebase = !!userRecord;
    return existeEnFirebase;
  } catch (error) {
    // Si el usuario no existe en Firebase
    const existeEnFirebase = false;
    return existeEnFirebase;
  }
};

// Función auxiliar para generar una contraseña aleatoria
const generarContraseñaAleatoria = () => {
  return Math.random().toString(36).slice(-8);
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
      include: { rol: true },
    });

    if (!usuario) {
      return res.status(404).json({ mensaje: "Usuario no encontrado" });
    }

    res.json({
      role: usuario.rol.nombre_rol,
      status: usuario.status,
      nombre_usuario: usuario.nombre,
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
