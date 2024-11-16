import { Router } from "express";

import {
  login,
  refreshToken,
  obtenerUsuarios,
  getUserInfo,
  verificarUsuario,
  crearUsuario,
  obtenerUsuarioYCursos,
  usuarioConCursosYLecciones
} from "../controllers/usuarioCtrl.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();
// GET //usamos verifyToken para proteger los endpoint
router.get("/user-info", verifyToken, getUserInfo);
router.get("/api/usuarios/", obtenerUsuarios);
router.get("/api/usuario/:id", obtenerUsuarioYCursos);
router.get("/api/usuarioLecciones/:id", usuarioConCursosYLecciones)

// POST
router.post("/verificarusuario", verifyToken, verificarUsuario);
router.post("/newuser", verifyToken, crearUsuario);
router.post("/api/login", login);
router.post("/api/refresh-token", refreshToken);

// PUT

// DELETE

export default router;
