import { Router } from "express";

import {
  crearcursos,
  obtenerCursos,
  obtenerCurso,
  deleteCurso,
  editCurso,
} from "../controllers/cursoCtrl.js";

const router = Router();
//GET
router.get("/cursos", obtenerCursos);
router.get("/cursos/:id", obtenerCurso);

//POST
router.post("/cursos", crearcursos);

//PUT
router.put("/cursos/:id", editCurso);

//DELETE
router.delete("/cursos/:id", deleteCurso);

export default router;
