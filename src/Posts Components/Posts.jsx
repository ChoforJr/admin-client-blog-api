import { Link } from "react-router-dom";
import styles from "./posts.module.css";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";

const Posts = () => {
  const { auth, posts, comments } = useContext(ItemContext);

  return (
    <div className={styles.posts}>
      {auth ? (
        posts.map((item) => (
          <article key={item.keyID} className={styles.postArticle}>
            <h2>
              {item.title}{" "}
              <div>
                <button className={styles.postDelBtn}>Delete</button>{" "}
                <button className={styles.postEdtBtn}>edit</button>
              </div>
            </h2>
            <p className={styles.content}>{item.content}</p>
            <p>Created On: {item.createdAt}</p>
            <p>
              Comments:{" "}
              {comments.filter((comment) => comment.postId === item.id).length}
            </p>
            {item.published ? (
              <p style={{ color: "#ADFF2F" }}>
                {" "}
                Published On: {item.publishedAt}
              </p>
            ) : (
              <p style={{ color: "#DC143C" }}>Drafted</p>
            )}
          </article>
        ))
      ) : (
        <h1>
          LogIn To
          <br />
          See All Posts Info
        </h1>
      )}
    </div>
  );
};

export default Posts;
