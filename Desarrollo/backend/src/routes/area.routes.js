import { Router } from "express";

import {
  crearArea,
  listarArea,
  listarAreas,
  modificarArea,
  eliminarArea,
} from "../controllers/areaCtrl.js";

const router = Router();

// GET
router.get("/api/area/:id", listarArea);
router.get("/api/area/", listarAreas);

// POST
router.post("/api/area/", crearArea);

// PUT
router.put("/api/area/:id", modificarArea);

// DELETE
router.delete("/api/area/:id", eliminarArea);

export default router;
