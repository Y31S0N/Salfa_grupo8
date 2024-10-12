const { Router } = require('express');
const {
    listarUsuario,
    listarUsuarios,
    verificarUsuario,
    crearUsuario,
    modificarUsuario,
    eliminarUsuario
} = require('../controllers/usuarioCtrl')

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