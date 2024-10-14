import { Router } from 'express';

import { crearUsuario } from '../controllers/usuarioCtrl.js'
import { verificarUsuario } from '../controllers/usuarioCtrl.js'
import { listarUsuario } from '../controllers/usuarioCtrl.js'
import { listarUsuarios } from '../controllers/usuarioCtrl.js'
import { modificarUsuario } from '../controllers/usuarioCtrl.js'
import { eliminarUsuario } from '../controllers/usuarioCtrl.js'
const router = Router();

// GET
router.get('/api/usuario/:id', listarUsuario)
router.get('/api/usuario/', listarUsuarios)

// POST
router.post('/api/verificarUsuario', verificarUsuario)
router.post('/api/crearUsuario', crearUsuario)

// PUT
router.put('/api/usuario', modificarUsuario)

// DELETE
router.delete('/api/usuario/:id', eliminarUsuario)

export default router;