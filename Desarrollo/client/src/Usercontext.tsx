// UserContext.tsx
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  getAuth,
  onAuthStateChanged,
  User as FirebaseUser,
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import firebaseApp from "./config/firebase";

// Definimos el tipo del usuario
interface User {
  uid: string;
  email: string | null;
  rol: string;
}

// Definimos el tipo de UserContext
interface UserContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
}

// Creamos el contexto
const UserContext = createContext<UserContextProps | undefined>(undefined);

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
  const [user, setUser] = useState<User | null>(null);
  const auth = getAuth(firebaseApp);
  const firestore = getFirestore(firebaseApp);

  // Función para obtener el rol de un usuario a partir de su UID
  async function getRol(uid: string): Promise<string | undefined> {
    const docuRef = doc(firestore, `usuarios/${uid}`);
    const docuCifrada = await getDoc(docuRef);
    const infoFinal = docuCifrada.data()?.rol;
    return infoFinal;
  }

  // Escucha los cambios en el estado de autenticación
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (usuarioFirebase) => {
      if (usuarioFirebase) {
        getRol(usuarioFirebase.uid).then((rol) => {
          const userData = {
            uid: usuarioFirebase.uid,
            email: usuarioFirebase.email,
            rol: rol || "undefined",
          };
          setUser(userData); // Actualizamos el contexto con el usuario
        });
      } else {
        setUser(null); // Si no hay usuario autenticado
      }
    });

    // Cleanup: Cancelamos la suscripción al cerrar el componente
    return () => unsubscribe();
  }, [auth]);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
