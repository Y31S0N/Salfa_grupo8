import { PrismaClient } from "@prisma/client";
import multer from "multer";
import path from "path";

const prisma = new PrismaClient();

// Configurar multer para el almacenamiento de imágenes
const storage = multer.memoryStorage();

export const upload = multer({
  storage: storage,
  limits: { fileSize: 5000000 }, // 5MB límite
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error("Solo se permiten imágenes (jpeg, jpg, png)"));
  },
}).single("imagen");

export const listarArea = async (req, res) => {
  const uid = parseInt(req.params.id);

  try {
    const areaRecord = await prisma.area.findUnique({
      where: {
        id_area: uid,
      },
    });
    res.status(200).json(areaRecord);
  } catch (error) {
    console.log("Error al Listar el Área");
    res.status(500).json({ error: error.message });
  }
};

export const listarAreas = async (req, res) => {
  try {
    const areas = await prisma.area.findMany();
    res.json(areas);
  } catch (error) {
    console.log("Error al Listar las Áreas");
    res.status(500).json({ error: error.message });
  }
};

export const crearArea = async (req, res) => {
  try {
    const { nombre_area } = req.body;

    // Convertir el archivo a Buffer si existe
    const imagen = req.file
      ? Buffer.from(req.file.buffer) // Si usas memoria
      : null;

    // Crear el área con la imagen como Buffer
    const nuevaArea = await prisma.area.create({
      data: {
        nombre_area,
        imagen,
      },
    });

    res.status(201).json({
      area: {
        ...nuevaArea,
        imagen: nuevaArea.imagen ? true : false, // No enviamos la imagen en la respuesta
      },
      message: "Área creada exitosamente",
    });
  } catch (error) {
    console.error("Error al crear el Área:", error);
    res.status(500).json({ error: error.message });
  }
};

export const modificarArea = async (req, res) => {
  const { nombre_area } = req.body;

  try {
    await prisma.area.update({
      where: { id_area: parseInt(req.params.id) },
      data: { nombre_area },
    });
    res.status(200).json({ message: "Área Modificada exitosamente" });
  } catch (error) {
    console.error("Error al Modificar el Área:", error);
    res.status(500).json({ error: error.message });
  }
};

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
};

export const obtenerImagenArea = async (req, res) => {
  try {
    const { id } = req.params;
    const area = await prisma.area.findUnique({
      where: { id_area: parseInt(id) },
      select: { imagen: true },
    });

    if (!area || !area.imagen) {
      return res.status(404).json({ message: "Imagen no encontrada" });
    }

    // Enviar la imagen con el tipo de contenido apropiado
    res.setHeader("Content-Type", "image/jpeg"); // Ajusta según el tipo de imagen
    res.send(area.imagen);
  } catch (error) {
    console.error("Error al obtener la imagen:", error);
    res.status(500).json({ error: error.message });
  }
};
