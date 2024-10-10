// server.js (o donde manejes tu servidor)
import express from "express";
import cors from "cors";
import { auth } from "./firebaseAdminConfig.js"; // Asegúrate de que esté correctamente importado
import datosPrueba from "./datosprueba.js"; // Importa tus datos de prueba

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"], // Puedes ajustar los métodos según lo que necesites
    credentials: true, // Si usas cookies o autenticación basada en sesiones
  })
);

app.use(express.json()); // Para poder leer el cuerpo de las solicitudes JSON

// Endpoint para verificar usuario
app.post("/api/verificarUsuario", async (req, res) => {
  const { correo, rut } = req.body;
  // Verificar en datos de prueba
  const existeEnBD = datosPrueba.some(
    (usuario) => usuario.rut === rut || usuario.correo === correo
  );

  // Verificar en Firebase
  try {
    const userRecord = await auth.getUserByEmail(correo);
    const existeEnFirebase = !!userRecord;

    return res.json({ existeEnBD, existeEnFirebase });
  } catch (error) {
    // Si el usuario no existe en Firebase
    const existeEnFirebase = false;

    return res.json({ existeEnBD, existeEnFirebase });
  }
});
app.post("/api/crearUsuario", async (req, res) => {
  const { correo, contrasena } = req.body;

  try {
    // Usar admin.auth() del Firebase Admin SDK para crear un usuario
    const userRecord = await auth.createUser({
      email: correo,
      password: contrasena,
    });

    res.status(201).json({ uid: userRecord.uid });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({ error: error.message });
  }
});

// Inicia tu servidor en el puerto deseado
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});