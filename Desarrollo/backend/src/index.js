import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import { dbConfig } from "./config/dbconfig.js";
import cursoRouter from "./routes/curso.routes.js";
import usuarioRouter from "./routes/usuario.routes.js";
import moduloRouter from "./routes/modulo.routes.js";
import leccionRouter from "./routes/leccionCurso.routes.js";
import areaRouter from "./routes/area.routes.js";
import cursoAreaRouter from "./routes/cursoArea.routes.js";
import cumplimientoLeccionRouter from "./routes/cumplimientoLeccion.routes.js";
import path from "path";
import { fileURLToPath } from "url";
import contenidoRouter from "./routes/contenido.routes.js";
import rolRouter from "./routes/rol.routes.js";
import iniciarCronJobs from './controllers/cronJobs.js';

// Obtener __dirname en ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Configurar middleware para servir archivos estáticos
app.use("/uploads", express.static(path.join(__dirname, "../public/uploads")));

// Configuración de la conexión a la base de datos
const pool = new Pool(dbConfig);

// Middleware para hacer la conexión disponible en todas las rutas
app.use((req, res, next) => {
  req.db = pool;
  next();
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.json());

app.use(usuarioRouter);
app.use(cursoRouter);
app.use(moduloRouter);
app.use(leccionRouter);
app.use(areaRouter);
app.use(cursoAreaRouter);
app.use(cumplimientoLeccionRouter);
app.use(contenidoRouter);
app.use(rolRouter);

// Inicializar cron jobs
iniciarCronJobs();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores de conexión
pool.on("error", (err) => {
  console.error("Error inesperado en el pool de conexiones", err);
});
