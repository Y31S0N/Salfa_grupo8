import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient();

export const listarArea = async (req, res) => {

    const uid = parseInt(req.params.id)

    try {
        const areaRecord = await prisma.area.findUnique({
            where: {
                "id_area": uid,
            },
        });
        res.status(200).json(areaRecord);
    } catch (error) {
        console.log("Error al Listar el Área");
        res.status(500).json({ error: error.message });
    }
}

export const listarAreas = async (req, res) => {
    try {
        const areas = await prisma.area.findMany();
        res.json(areas);
    } catch (error) {
        console.log("Error al Listar las Áreas");
        res.status(500).json({ error: error.message });
    }
}

export const crearArea = async (req, res) => {
    try {
        const nuevaArea = await prisma.area.create({
            data: req.body,
        });

        res.status(201).json({ area: nuevaArea });
    } catch (error) {
        console.error("Error al crear el Área:", error);
        res.status(500).json({ error: error.message });
    }
}

export const modificarArea = async (req, res) => {

    const { nombre_area } = req.body;
    
    try {
        
        await prisma.area.update({
            where: { id_area: parseInt(req.params.id) },
            data: { nombre_area }
        });
        res.status(200).json({ message: "Área Modificada exitosamente" });
    } catch (error) {
        console.error("Error al Modificar el Área:", error);
        res.status(500).json({ error: error.message });
    }
}


export const eliminarArea = async (req, res) => {

    const { id } = req.params;

    try {
        await prisma.area.delete({
            where: { id_area: Number(id) },
        });
        res.status(204).send();
    } catch (error) {
        console.error("Error al Eliminar el Área:", error);
        res.status(500).json({ error: error.message });
    }
}