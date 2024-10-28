// Función para verificar si el RUT existe en la base de datos
import { auth } from "./firebaseAdminConfig.js";
import datosPrueba from "./datosprueba.js";

const verificarRutEnBD = (rut) => {
  return datosPrueba.find((usuario) => usuario.rut === rut);
};

// Función para verificar si el correo existe en la base de datos
const verificarCorreoEnBD = (correo) => {
  return datosPrueba.find((usuario) => usuario.correo === correo);
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

// Función para procesar la verificación de un nuevo usuario
const verificarUsuario = async (rut, correo) => {
  const existeRutEnBD = verificarRutEnBD(rut);
  const existeCorreoEnBD = verificarCorreoEnBD(correo);
  const existeEnFirebase = await verificarEnFirebase(correo);

  if (existeRutEnBD && existeCorreoEnBD && existeEnFirebase) {
    // Caso 1: El usuario existe en ambos lados (no crear)
    return {
      accion: "No crear",
      mensaje:
        "El usuario ya existe tanto en la base de datos como en Firebase.",
    };
  }

  if (existeRutEnBD && existeCorreoEnBD && !existeEnFirebase) {
    // Caso 2: Existe en la BD pero no en Firebase (crear en Firebase)
    return {
      accion: "Crear solo en Firebase",
      mensaje:
        "El usuario ya existe en la base de datos, pero no en Firebase. Crear en Firebase.",
    };
  }

  if (!existeRutEnBD && !existeCorreoEnBD && !existeEnFirebase) {
    // Caso 3: No existe en ninguno (crear en ambos)

    return {
      accion: "Crear en ambos",
      mensaje:
        "El usuario no existe en la base de datos ni en Firebase. Crear en ambos lados.",
    };
  }

  if (!existeRutEnBD && existeCorreoEnBD && existeEnFirebase) {
    // Caso 4: Existe en Firebase pero no en la base de datos (crear en BD)
    return {
      accion: "Crear solo en la base de datos",
      mensaje:
        "El usuario ya existe en Firebase, pero no en la base de datos. Crear en la base de datos.",
    };
  }

  // Verificar si el correo ya está asociado a otro RUT
  if (existeRutEnBD && existeRutEnBD.correo !== correo) {
    return {
      accion: "Error",
      mensaje:
        "El RUT ya está registrado con otro correo. No se puede crear el usuario.",
    };
  }

  // Verificar si el RUT ya está asociado a otro correo
  if (existeCorreoEnBD && existeCorreoEnBD.rut !== rut) {
    return {
      accion: "Error",
      mensaje:
        "El correo ya está registrado con otro RUT. No se puede crear el usuario.",
    };
  }

  return {
    accion: "Error",
    mensaje: "No se pudo determinar la acción a realizar.",
  };
};
export default verificarUsuario;
