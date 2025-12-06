import { Link } from "react-router-dom";
import styles from "./account.module.css";

const Account = () => {
  return (
    <div className={styles.account}>
      <Link to="/">
        <h1>
          WELCOME TO
          <br />
          Account
        </h1>
      </Link>
    </div>
  );
};

export default Account;
