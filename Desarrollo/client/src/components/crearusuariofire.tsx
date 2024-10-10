import axios from "axios";

const CrearUsuarioEnFirebase = async (correo: string) => {
  try {
    // Aquí haces una llamada a tu backend para crear el usuario en Firebase
    await axios.post("http://localhost:5000/api/crearUsuario", {
      correo,
      contrasena: "prueba12345",
    });
  } catch (err) {
    console.error("entro pero no creo");
  }
};
export default CrearUsuarioEnFirebase;
