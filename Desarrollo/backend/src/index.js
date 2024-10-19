import express from 'express';
import cors from "cors";
import usuarioRoutes from './routes/usuario.routes.js';
import cursoRoutes from './routes/curso.routes.js';

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true, // Si usamos cookies o autenticación basada en sesiones
  })
);
app.use(express.json());

app.use(usuarioRoutes);
app.use(cursoRoutes);



const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});