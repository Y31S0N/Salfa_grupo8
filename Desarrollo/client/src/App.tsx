import { getAuth } from "firebase/auth";
import { RouterProvider } from "react-router-dom";
import { AuthProvider, useFirebaseApp } from "reactfire";
import { router } from "./config/router";

const App = () => {
  const app = useFirebaseApp();
  const auth = getAuth(app);

  return (
    <AuthProvider sdk={auth}>
      <RouterProvider router={router}></RouterProvider>
    </AuthProvider>
  );
};
export default App;
