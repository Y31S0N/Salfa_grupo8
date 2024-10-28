import { Router } from "express";

import { crearUsuario } from "../controllers/usuarioCtrl.js";
import { verificarUsuario } from "../controllers/usuarioCtrl.js";
//import { listarUsuario } from "../controllers/usuarioCtrl.js";
//import { listarUsuarios } from "../controllers/usuarioCtrl.js";
//import { modificarUsuario } from "../controllers/usuarioCtrl.js";
//import { eliminarUsuario } from "../controllers/usuarioCtrl.js";
//import { buscarUsuarioPorEmail } from "../controllers/usuarioCtrl.js";
import {
  login,
  refreshToken,
  obtenerUsuarios,
} from "../controllers/usuarioCtrl.js";
import { verifyToken } from "../middleware/authMiddleware.js";
import { getUserInfo } from "../controllers/usuarioCtrl.js";

const router = Router();
// GET
router.get("/api/user-info", verifyToken, getUserInfo);
//router.get("/api/usuario/:id", listarUsuario);
router.get("/api/usuarios/", obtenerUsuarios);

// POST
router.post("/verificarusuario", verificarUsuario);
router.post("/newuser", verifyToken, crearUsuario);
router.post("/api/login", login);
router.post("/api/refresh-token", refreshToken);
//router.post("/api/crearUsuario", crearUsuario);
//router.post("/api/buscar", buscarUsuarioPorEmail);

// PUT
//router.put("/api/usuario", modificarUsuario);

// DELETE
//router.delete("/api/usuario/:id", eliminarUsuario);

export default router;
