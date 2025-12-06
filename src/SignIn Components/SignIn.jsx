import { Link } from "react-router-dom";
import styles from "./signIn.module.css";

const SignIn = () => {
  return (
    <div className={styles.signIn}>
      <Link to="/">
        <h1>
          WELCOME TO
          <br />
          SignIn
        </h1>
      </Link>
    </div>
  );
};

export default SignIn;
