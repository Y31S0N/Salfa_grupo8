import { Router } from "express";

import {
  login,
  refreshToken,
  obtenerUsuarios,
  getUserInfo,
  crearUsuario,
  obtenerUsuarioYCursos,
  usuarioConCursosYLecciones
  toggleEstadoUsuario,
  actualizarUsuario,
  crearUsuariosBulk,
} from "../controllers/usuarioCtrl.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();
// GET //usamos verifyToken para proteger los endpoint
router.get("/user-info", verifyToken, getUserInfo); //en uso
router.get("/api/usuarios/", obtenerUsuarios);
router.get("/api/usuario/:id", obtenerUsuarioYCursos);
router.get("/api/usuarioLecciones/:id", usuarioConCursosYLecciones)

// POST
router.post("/newuser", verifyToken, crearUsuario);

router.post("/api/login", login); //en uso
router.post("/api/refresh-token", refreshToken); //en uso

// PUT
router.put("/api/usuarios/toggle-estado", verifyToken, toggleEstadoUsuario); //en uso
router.put("/api/usuarios/:rut", verifyToken, actualizarUsuario); //en uso

// POST
router.post("/api/usuarios/bulk", verifyToken, crearUsuariosBulk);

// DELETE

export default router;
