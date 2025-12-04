import { Link } from "react-router-dom";

const Popeye = () => {
  return (
    <>
      <p>Hi, I am Popeye! I love to eat Spinach!</p>
      <Link to="/">Click here to go back to Home</Link>
      <br />
      <Link to="../profile">Click here to go back to Profile</Link>
    </>
  );
};

export default Popeye;
