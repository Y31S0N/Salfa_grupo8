import { Navigate, Outlet } from "react-router-dom";
import { useSigninCheck } from "reactfire";

const RootLayout = () => {
  const { status, data: singInCheckResult } = useSigninCheck();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (singInCheckResult.signedIn == true) {
    return <Navigate to="/home" />;
  }

  return (
    <div>
      <main>
        <Outlet />
      </main>
    </div>
  );
};
export default RootLayout;
