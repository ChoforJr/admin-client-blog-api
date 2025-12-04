import { Link } from "react-router-dom";

const DefaultProfile = () => {
  return (
    <>
      <p>Oh, nothing to see here!</p>
      <Link to="/">Click here to go back to Home</Link>
      <br />
      <Link to="../profile">Click here to go back to Profile</Link>
    </>
  );
};

export default DefaultProfile;
