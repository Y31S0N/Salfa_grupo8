import Header from "@/components/header";
import { Outlet } from "react-router-dom";

const RootLayout = () => {
  return (
    <div>
      <Header />
      <main className="container my-5">
        <Outlet />
      </main>
    </div>
  );
};
export default RootLayout;
