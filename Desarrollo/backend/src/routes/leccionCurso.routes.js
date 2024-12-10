import { Router } from "express";
import {
  crearLeccion,
  obtenerLecciones,
  obtenerLeccion,
  editLeccion,
  deleteLeccion,
} from "../controllers/leccionCursoCtrl.js";

const router = Router();

// Endpoint para crear una lección en un módulo existente
router.post("/modulos/:moduloId/lecciones", crearLeccion);

// Endpoint para obtener todas las lecciones de un módulo existente
router.get("/modulos/:moduloId/lecciones", obtenerLecciones);

//Obtener una lección en particular
router.get("/modulos/:moduloId/lecciones/:leccionId", obtenerLeccion);

// Endpoint para modificar una lección existente
router.put("/modulos/:moduloId/lecciones/:leccionId", editLeccion);

// Endpoint para eliminar una lección específica de un módulo
router.delete("/modulos/:moduloId/lecciones/:leccionId", deleteLeccion);

export default router;
