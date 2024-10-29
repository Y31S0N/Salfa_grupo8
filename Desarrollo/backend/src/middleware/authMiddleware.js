import { auth } from "../../firebase/firebaseAdminConfig.js";

export const verifyToken = async (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ mensaje: "No se proporcionó token" });
  }

  try {
    const decodedToken = await auth.verifyIdToken(token);
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    next();
  } catch (error) {
    console.error("Error al verificar token:", error);
    res.status(401).json({ mensaje: "Token inválido" });
  }
};
