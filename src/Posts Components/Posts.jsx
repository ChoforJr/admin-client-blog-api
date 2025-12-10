import { Link } from "react-router-dom";
import styles from "./posts.module.css";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";

const Posts = () => {
  const { auth, posts, comments } = useContext(ItemContext);

  return (
    <div className={styles.posts}>
      <Link to="/createPost">
        <button style={{ backgroundColor: "#32CD32", width: "180px" }}>
          Create Post
        </button>
      </Link>

      {auth ? (
        posts.map((item) => (
          <Link
            key={item.keyID}
            to={{
              pathname: `/posts/${item.id}`,
            }}
          >
            <article className={styles.postArticle}>
              <h2>
                {item.title}{" "}
                <div>
                  <button className={styles.postDelBtn}>Delete</button>{" "}
                  <button className={styles.postEdtBtn}>edit</button>
                </div>
              </h2>
              <p className={styles.content}>{item.content}</p>
              <p>Created On: {new Date(item.createdAt).toLocaleString()}</p>
              <p>
                Comments:{" "}
                {
                  comments.filter((comment) => comment.postId === item.id)
                    .length
                }
              </p>
              {item.published ? (
                <div>
                  <p style={{ color: "#ADFF2F" }}>
                    {" "}
                    Published On: {new Date(item.publishedAt).toLocaleString()}
                  </p>
                  <button style={{ backgroundColor: "#DC143C" }}>
                    unpublish
                  </button>
                </div>
              ) : (
                <div>
                  <p style={{ color: "#DC143C" }}>Drafted</p>
                  <button style={{ backgroundColor: "#ADFF2F" }}>
                    Publish
                  </button>
                </div>
              )}
            </article>
          </Link>
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
