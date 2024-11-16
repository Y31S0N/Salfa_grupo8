import React from "react";
import { Outlet } from "react-router-dom";
import { useUser } from "../../contexts/UserContext";
import { Navigate } from "react-router-dom";
import { SyncLoader } from "react-spinners";

export default function RootLayout() {
  const { loading, user } = useUser();

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <SyncLoader />
      </div>
    );
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center">
      <Outlet />
    </div>
  );
}
