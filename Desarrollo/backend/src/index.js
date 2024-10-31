import express from "express";
import cors from "cors";
import usuarioRoutes from './routes/usuario.routes.js';
import cursoRoutes from './routes/curso.routes.js';
import areaRoutes from './routes/area.routes.js';
import pkg from "pg";
const { Pool } = pkg;
import { dbConfig } from "./config/dbconfig.js";
import cursoRouter from "./routes/curso.routes.js";
import usuarioRouter from "./routes/usuario.routes.js";
import moduloRouter from "./routes/modulo.routes.js";
import leccionRouter from "./routes//leccionCurso.routes.js";

const app = express();

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

app.use(usuarioRoutes);
app.use(cursoRoutes);
app.use(areaRoutes);


app.use(usuarioRouter);
app.use(cursoRouter);
app.use(moduloRouter);
app.use(leccionRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores de conexión
pool.on("error", (err) => {
  console.error("Error inesperado en el pool de conexiones", err);
});
