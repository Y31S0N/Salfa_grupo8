import { Navigate, Outlet } from "react-router-dom";
import { useSigninCheck } from "reactfire";

const PrivateLayout_clean = () => {
  const { status, data: singInCheckResult } = useSigninCheck();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (singInCheckResult.signedIn) {
    return (
      <div>
        <main>
          <Outlet />
        </main>
      </div>
    );
  }

  return <Navigate to="/" />;
};
export default PrivateLayout_clean;
