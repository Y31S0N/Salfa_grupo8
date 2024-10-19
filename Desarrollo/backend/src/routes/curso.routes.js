import { Router } from 'express';

import {
    eliminarCurso,
    listarCurso,
    modificarCurso,
    listarCursos,
    crearCurso
} from '../controllers/cursoCtrl.js';

const router = Router();

// GET
router.get('/api/curso/:id', listarCurso)
router.get('/api/curso/', listarCursos)

// POST
router.post('/api/curso/', crearCurso)

// PUT
router.put('/api/curso/:id', modificarCurso)

// DELETE
router.delete('/api/curso/:id', eliminarCurso)

export default router;