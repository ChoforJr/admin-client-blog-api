import { useParams } from "react-router-dom";
import DefaultProfile from "./DefaultProfile";
import Spinach from "./Spinach";
import Popeye from "./Popeye";
import { Link } from "react-router-dom";

const Profile = () => {
  const { name } = useParams();

  return (
    <div>
      <h1>Hello from profile page!</h1>
      <p>So, how are you?</p>
      <hr />
      <h2>The profile visited is here:</h2>
      {name === "popeye" ? (
        <Popeye />
      ) : name === "spinach" ? (
        <Spinach />
      ) : (
        <DefaultProfile />
      )}
      <hr />
      <Link to="../profile/popeye">Popeye Link</Link>
      <br />
      <Link to="../profile/spinach">Spinach Link</Link>
    </div>
  );
};

export default Profile;
