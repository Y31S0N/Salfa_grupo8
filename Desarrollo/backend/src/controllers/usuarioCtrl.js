import auth from "../../firebaseAdminConfig.js";
import datosPrueba  from "../../datosprueba.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export const listarUsuario = async (req, res) => {
    const { uid } = req.params;

    try {
        const userRecord = await auth.getUser(uid);
        res.status(200).json(userRecord);
    } catch (error) {
        console.error("Error al listar el usuario:", error);
        res.status(500).json({ error: error.message });
    }
};

export const listarUsuarios = async (req, res) => {
    try {
        const usuarios = [];
        let nextPageToken;

        // try {
        //     const usuarios = await prisma.usuario.findMany();
        //     res.json(usuarios);
        // } catch(err) {
        //     console.log(err);
        // };

        res.status(200).json(usuarios);
    } catch (error) {
        console.error("Error al listar todos los usuarios:", error);
        res.status(500).json({ error: error.message });
    }
};


export const verificarUsuario = async (req, res) => {
    const { correo, rut } = req.body;
    // verificar en datos de prueba
    const existeEnBD = datosPrueba.some(
        (usuario) => usuario.rut === rut || usuario.correo === correo
    );

    // verificar en firebase
    try {
        const userRecord = await auth.getUserByEmail(correo);
        const existeEnFirebase = !!userRecord;

        return res.json({ existeEnBD, existeEnFirebase });
    } catch (error) {
        // si el usuario no existe en firebase
        const existeEnFirebase = false;

        return res.json({ existeEnBD, existeEnFirebase });
    }
};
export const crearUsuario = async (req, res) => {
    const { correo, contrasena } = req.body;

    try {
        // se usa el admin.auth() del firebase Admin SDK para crear un usuario
        const userRecord = await auth.createUser({
            email: correo,
            password: contrasena,
        });

        res.status(201).json({ uid: userRecord.uid });
    } catch (error) {
        console.error("Error al crear el usuario:", error);
        res.status(500).json({ error: error.message });
    }
}

export const modificarUsuario = async (req, res) => {
    const { uid, nuevoCorreo, nuevaContrasena } = req.body;

    try {
        const updates = {};
        if (nuevoCorreo) updates.email = nuevoCorreo;
        if (nuevaContrasena) updates.password = nuevaContrasena;

        await auth.updateUser(uid, updates);
        res.status(200).json({ message: "Usuario modificado exitosamente." });
    } catch (error) {
        console.error("Error al modificar el usuario:", error);
        res.status(500).json({ error: error.message });
    }

}
export const eliminarUsuario = async (req, res) => {
    const { uid } = req.body;

    try {
        await auth.deleteUser(uid);
        res.status(200).json({ message: "Usuario eliminado exitosamente." });
    } catch (error) {
        console.error("Error al eliminar el usuario:", error);
        res.status(500).json({ error: error.message });
    }
};

// export default {
//     listarUsuario,
//     listarUsuarios,
//     verificarUsuario,
//     crearUsuario,
//     modificarUsuario,
//     eliminarUsuario
// };