import { useState } from "react";
import { signInWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import firebaseApp from "../../config/firebase";

const auth = getAuth(firebaseApp);
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("email", JSON.stringify(email));
      navigate("/home");
    } catch (error) {
      alert("credenciales invalidas");
    }
  };
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="px-8 py-6 mt-4 text-left bg-white shadow-lg rounded-lg">
        <h3 className="text-2xl font-bold text-center text-gray-800">
          Inicio de sesión
        </h3>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="mt-4">
            <div>
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="email"
              >
                Correo electrónico
              </label>
              <input
                type="email"
                placeholder="Ingresa tu correo"
                required
                className="w-full px-4 py-2 mt-2 border rounded-md
              focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="mt-4">
              <label
                className="block text-sm font-medium text-gray-700"
                htmlFor="password"
              >
                Contraseña
              </label>
              <input
                type="password"
                placeholder="Ingresa tu contraseña"
                required
                className="w-full px-4 py-2 mt-2 border rounded-md focus:outline-none focus:ring-1 focus:ring-blue-600"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="flex items-baseline justify-between">
              <button
                type="submit"
                className="px-6 py-2 mt-4 text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
              >
                Iniciar sesión
              </button>
              <a href="#" className="text-sm px-4 text-blue-600 hover:underline">
                Olvidó su contraseña?
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
export default Login;
