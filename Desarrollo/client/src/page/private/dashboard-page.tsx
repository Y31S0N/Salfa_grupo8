import { useUser } from "reactfire";

const Home = () => {
  const { data: user } = useUser();

  return (
    <h1>
      Welcome {user?.displayName} ({user?.email})
    </h1>
  );
};
export default Home;
