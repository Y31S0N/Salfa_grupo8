// App.tsx
import { RouterProvider } from "react-router-dom";
import { router } from "./config/router";
import firebaseApp from "./config/firebase";
import { getAuth } from "firebase/auth";
import { AuthProvider } from "reactfire";
import { UserProvider } from "./usercontext"; // Solo importamos UserProvider aquí

const auth = getAuth(firebaseApp);

const App = () => {
  return (
    <AuthProvider sdk={auth}>
      <UserProvider>
        {" "}
        {/* Proveedor de usuario */}
        <RouterProvider router={router}></RouterProvider>
      </UserProvider>
    </AuthProvider>
  );
};

export default App;
