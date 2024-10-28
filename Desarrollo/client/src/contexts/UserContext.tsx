// UserContext.tsx
import {
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
} from "firebase/auth";
import { auth } from "../config/firebase"; // Asegúrate de que esta ruta sea correcta
import api from "../services/api";
import { useNavigate } from "react-router-dom";

// Definimos el tipo de UserContext
interface ExtendedUser extends FirebaseUser {
  role?: string;
  // Agrega aquí otros campos que puedas necesitar en el futuro
}

interface UserContextType {
  user: ExtendedUser | null;
  login: (email: string, password: string) => Promise<ExtendedUser>;
  logout: () => Promise<void>;
  loading: boolean;
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

          const response = await api.get<{ role: string }>("/api/user-info", {
            headers: { Authorization: `Bearer ${idToken}` },
          });

          const extendedUser: ExtendedUser = {
            ...firebaseUser,
            role: response.data.role,
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

      const response = await api.post<LoginResponse>("/api/login", { idToken });
      const { token, refreshToken, role } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("refreshToken", refreshToken);

      const extendedUser: ExtendedUser = {
        ...userCredential.user,
        role: role,
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

  return (
    <UserContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </UserContext.Provider>
  );
};

interface LoginResponse {
  token: string;
  refreshToken: string;
  role: string;
}
