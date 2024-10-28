import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import usuarioRoutes from "./routes/usuario.routes.js";

const app = express();

// Configuración de la conexión a la base de datos
const pool = new Pool({
  user: "nes",
  host: "localhost", // o tu host de base de datos
  database: "salfa_capacitaciones",
  password: "negrata7531",
  port: 5432, // el puerto por defecto de PostgreSQL
});

// Middleware para hacer la conexión disponible en todas las rutas
app.use((req, res, next) => {
  req.db = pool;
  next();
});

// ... resto del código existente ...

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use(usuarioRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores de conexión
pool.on("error", (err) => {
  console.error("Error inesperado en el pool de conexiones", err);
});
