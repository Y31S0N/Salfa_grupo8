import express from "express";
import cors from "cors";
import pkg from "pg";
const { Pool } = pkg;
import { dbConfig } from "./config/dbconfig.js";
import cursoRouter from "./routes/curso.routes.js";
import usuarioRouter from "./routes/usuario.routes.js";
import moduloRouter from "./routes/modulo.routes.js";
import leccionRouter from "./routes//leccionCurso.routes.js";
import areaRouter from "./routes/area.routes.js";

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

app.use(usuarioRouter);
app.use(cursoRouter);
app.use(moduloRouter);
app.use(leccionRouter);
app.use(areaRouter);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

// Manejo de errores de conexión
pool.on("error", (err) => {
  console.error("Error inesperado en el pool de conexiones", err);
});
