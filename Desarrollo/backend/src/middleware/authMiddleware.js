import { auth } from "../../firebase/firebaseAdminConfig.js";

export const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        mensaje: "No se proporcionó token o formato inválido",
      });
    }

    const token = authHeader.split(" ")[1];

    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = {
        uid: decodedToken.uid,
        email: decodedToken.email,
      };
      next();
    } catch (error) {
      console.error("Error al verificar token:", error);
      return res.status(401).json({
        mensaje: "Token inválido",
        error: error.message,
      });
    }
  } catch (error) {
    console.error("Error en middleware:", error);
    return res.status(500).json({
      mensaje: "Error interno del servidor",
      error: error.message,
    });
  }
};
