import styles from "./post.module.css";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";

const Post = () => {
  const { auth, comments, id, posts, users, account } = useContext(ItemContext);
  const currentPost = posts.filter((post) => post.id == id);
  const currentComment = comments.filter((comment) => comment.postId == id);
  return (
    <div className={styles.post}>
      {auth ? (
        <>
          <article key={currentPost[0].keyID} className={styles.postArticle}>
            <h2>{currentPost[0].title}</h2>
            <div className={styles.content}>{currentPost[0].content}</div>
          </article>
          <hr />
          <p>Login to Comment</p>
          <article className={styles.comments}>
            <p>Comments</p>
            {currentComment.map(
              (comment) =>
                comment.postId == id && (
                  <div key={comment.keyID} className={styles.comment}>
                    <div className={styles.commentInfo}>
                      <p>Comment ID: {comment.id}</p>
                      <p>
                        Created On:{" "}
                        {new Date(comment.createdAt).toLocaleString()}
                      </p>
                      {comment.parentId && (
                        <p style={{ color: "#ADFF2F" }}>
                          Replied to Comment: {comment.parentId}
                        </p>
                      )}
                      {users.map(
                        (user) =>
                          user.id == comment.userId && (
                            <p>By: {user.displayName}</p>
                          )
                      )}
                    </div>
                    <p>{comment.content}</p>
                    <div>
                      <button className={styles.commentDelBtn}>Delete</button>{" "}
                      {account.id == comment.userId && (
                        <button className={styles.commentEdtBtn}>edit</button>
                      )}
                    </div>
                  </div>
                )
            )}
          </article>
          <hr />
        </>
      ) : (
        <h1>
          LogIn To
          <br />
          See Post Info
        </h1>
      )}
    </div>
  );
};

export default Post;
