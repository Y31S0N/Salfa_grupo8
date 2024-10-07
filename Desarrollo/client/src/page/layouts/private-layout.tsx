import { Navigate, Outlet } from "react-router-dom";
import { useSigninCheck } from "reactfire";

const PrivateLayout = () => {
  const { status, data: singInCheckResult } = useSigninCheck();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (singInCheckResult.signedIn) {
    return <Outlet />;
  }

  return <Navigate to="/" />;
};
export default PrivateLayout;
