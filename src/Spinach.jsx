import { Link } from "react-router-dom";

const Spinach = () => {
  return (
    <>
      <p>Hi, I am Spinach! Popeye loves to eat me!</p>
      <Link to="/">Click here to go back to Home</Link>
      <br />
      <Link to="../profile">Click here to go back to Profile</Link>
    </>
  );
};

export default Spinach;
