// comprobarExistencia.js
import { auth } from "./firebaseAdminConfig"; // Importa la configuración del Admin SDK
import datosPrueba from "./datosprueba"; // Aquí están los datos de prueba

// Función para verificar en Firebase (Admin SDK)
export const verificarEnFirebase = async (correo) => {
  try {
    const userRecord = await auth.getUserByEmail(correo);
    return !!userRecord; // Si existe, retorna true
  } catch (error) {
    return false; // El usuario no existe en Firebase
  }
};

// Función para crear un usuario en Firebase
export const crearUsuarioEnFirebase = async (
  correo,
  contrasena = "prueba12345"
) => {
  try {
    const userCredential = await auth.createUser({
      email: correo,
      password: contrasena,
    });
    return userCredential;
  } catch (error) {
    throw new Error("Error al crear el usuario en Firebase");
  }
};

// Función para verificar si el usuario existe en la base de datos local (datosPrueba)
export const verificarEnBD = (rut, correo) => {
  return datosPrueba.some(
    (usuario) => usuario.rut === rut || usuario.correo === correo
  );
};
