import { Router } from "express";

import {
  crearArea,
  upload,
  obtenerImagenArea,
  listarArea,
  listarAreas,
  modificarArea,
  eliminarArea,
  obtenerUsuariosPorArea,
} from "../controllers/areaCtrl.js";

const router = Router();

// GET
router.get("/api/area/:id", listarArea);
router.get("/api/area/", listarAreas);
router.get("/api/area/imagen/:id", obtenerImagenArea);
router.get("/api/area/:id_area/usuarios", obtenerUsuariosPorArea);

// POST
router.post("/api/area/", upload, crearArea);

// PUT
router.put("/api/area/:id", upload, modificarArea);

// DELETE
router.delete("/api/area/:id", eliminarArea);

export default router;
