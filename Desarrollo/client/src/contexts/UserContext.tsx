// UserContext.tsx
import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "../config/firebase"; // Asegúrate de que esta ruta sea correcta
import api from "../services/api";
import { useNavigate } from "react-router-dom";

// Definimos el tipo de UserContext
interface ExtendedUser extends FirebaseUser {
  role: string;
  rut: string;
  nombre: string;
  apellido_paterno: string;
  apellido_materno: string;
  area: string;
  correo: string;
}

interface UserContextType {
  user: ExtendedUser | null;
  login: (email: string, password: string) => Promise<ExtendedUser>;
  logout: () => Promise<void>;
  loading: boolean;
  resetPassword: (email: string) => Promise<boolean>;
}

// Creamos el contexto
const UserContext = createContext<UserContextType | null>(null);

// Hook para usar el UserContext
export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser debe estar dentro de un UserProvider");
  }
  return context;
};

// Proveedor de UserContext
export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<ExtendedUser | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const idToken = await firebaseUser.getIdToken();

          const response = await api.get<{
            role: string;
            rut: string;
            nombre: string;
            apellido_paterno: string;
            apellido_materno: string;
            area: string;
            correo: string;
          }>("/user-info", {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          const extendedUser: ExtendedUser = {
            ...firebaseUser,
            role: response.data.role,
            rut: response.data.rut,
            nombre: response.data.nombre,
            apellido_paterno: response.data.apellido_paterno,
            apellido_materno: response.data.apellido_materno,
            area: response.data.area,
            correo: response.data.correo,
          };
          setUser(extendedUser);
        } catch (error) {
          console.error("Error completo:", error);
          if (
            error instanceof Error &&
            "response" in error &&
            error.response &&
            typeof error.response === "object" &&
            "data" in error.response
          ) {
            // El servidor respondió con un estado fuera del rango de 2xx
            console.error(
              "Error de respuesta del servidor:",
              error.response.data
            );
          } else if (error instanceof Error) {
            // Algo sucedió en la configuración de la solicitud que provocó un error
            console.error("Error al configurar la solicitud:", error.message);
          } else {
            console.error("Error desconocido:", error);
          }
          setUser(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (
    email: string,
    password: string
  ): Promise<ExtendedUser> => {
    try {
      setLoading(true);
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const idToken = await userCredential.user.getIdToken();

      // Enviar el idToken al backend
      const loginResponse = await api.post<LoginResponse>("/api/login", {
        idToken: idToken, // Asegúrate de que este sea el token de Firebase
      });

      // Guardar los tokens JWT del backend
      localStorage.setItem("token", loginResponse.data.token);
      localStorage.setItem("refreshToken", loginResponse.data.refreshToken);

      // Configurar el token para futuras peticiones
      api.defaults.headers.common["Authorization"] = `Bearer ${idToken}`;

      // Obtener información del usuario
      const userInfoResponse = await api.get("/user-info", {
        headers: { Authorization: `Bearer ${idToken}` },
      });

      const extendedUser: ExtendedUser = {
        ...userCredential.user,
        ...userInfoResponse.data,
      };

      setUser(extendedUser);
      return extendedUser;
    } catch (error) {
      console.error("Error en inicio de sesión:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      await signOut(auth);
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    } finally {
      setLoading(false);
      navigate("/login");
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      return true;
    } catch (error) {
      throw error;
    }
  };

  const value = {
    user,
    login,
    logout,
    loading,
    resetPassword,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

interface LoginResponse {
  token: string;
  refreshToken: string;
  role: string;
}
