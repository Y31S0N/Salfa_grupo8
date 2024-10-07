import { GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { Button } from "./ui/button";
import { useAuth, useSigninCheck } from "reactfire";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const { status, data: singInCheckResult } = useSigninCheck();

  const handleClickSignIn = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
    navigate("/dashboard");
  };

  const handleClickSignOut = async () => {
    await signOut(auth);
  };
  return (
    <div className="bg-gray-700 py-4">
      <div className="container flex items-center">
        <p className="text-white">ReactFire</p>
        <nav className="ml-auto">
          {status == "loading" ? (
            <Button disabled>Loading...</Button>
          ) : singInCheckResult.signedIn ? (
            <Button onClick={handleClickSignOut}>SigOut</Button>
          ) : (
            <Button onClick={handleClickSignIn}>Sigin</Button>
          )}
        </nav>
      </div>
    </div>
  );
};
export default Header;
