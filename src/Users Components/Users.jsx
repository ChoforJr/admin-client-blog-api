import { Link } from "react-router-dom";
import styles from "./users.module.css";

const Users = () => {
  return (
    <div className={styles.users}>
      <Link to="/">
        <h1>
          WELCOME TO
          <br />
          Users
        </h1>
      </Link>
    </div>
  );
};

export default Users;
