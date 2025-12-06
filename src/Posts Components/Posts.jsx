import { Link } from "react-router-dom";
import styles from "./posts.module.css";

const Posts = () => {
  return (
    <div className={styles.posts}>
      <Link to="/">
        <h1>
          WELCOME TO
          <br />
          Posts
        </h1>
      </Link>
    </div>
  );
};

export default Posts;
