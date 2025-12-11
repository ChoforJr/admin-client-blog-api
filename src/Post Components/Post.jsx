import styles from "./post.module.css";
import { useState } from "react";
import { ItemContext } from "../ItemContext";
import { useContext } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

const Post = () => {
  const [commenting, setCommenting] = useState("");

  const { auth, comments, id, posts, account, addComment, profiles } =
    useContext(ItemContext);

  const currentPost = posts.filter((post) => post.id == id);
  const currentComment = comments.filter((comment) => comment.postId == id);

  function changingComment(event) {
    const { value } = event.target;
    setCommenting(value);
  }

  async function subminComment(event) {
    event.preventDefault();

    if (commenting == "") {
      return alert("You can't submin an empty field");
    }

    try {
      const authToken = localStorage.getItem("authorization");

      const response = await fetch(`${apiUrl}/user/post/${id}/comment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `${authToken}`,
        },
        body: JSON.stringify({
          content: commenting,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        addComment({
          id: result.comment[0].id,
          keyID: crypto.randomUUID(),
          content: result.comment[0].content,
          userId: result.comment[0].userId,
          postId: result.comment[0].postId,
          createdAt: result.comment[0].createdAt,
        });
        setCommenting("");
      } else {
        const result = await response.json();
        console.error(result);
      }
    } catch (error) {
      console.error("Network error:", error);
    }
  }
  return (
    <div className={styles.post}>
      {auth ? (
        <>
          <article key={currentPost[0].keyID} className={styles.postArticle}>
            <h2>{currentPost[0].title}</h2>
            <div className={styles.content}>{currentPost[0].content}</div>
          </article>
          <hr />
          <div className={styles.commenting}>
            <input
              type="text"
              name="currentComment"
              id="currentComment"
              placeholder="commenting..."
              value={commenting}
              onChange={changingComment}
            />
            <button onClick={subminComment}>Submit</button>
          </div>
          <article className={styles.comments}>
            <p>Comments</p>
            {currentComment.map(
              (comment) =>
                comment.postId == id && (
                  <div key={comment.keyID} className={styles.comment}>
                    {profiles.map(
                      (profile) =>
                        profile.userId == comment.userId && (
                          <p style={{ color: "GrayText" }}>
                            {profile.displayName} said on{" "}
                            {new Date(comment.createdAt).toLocaleString()}
                          </p>
                        )
                    )}
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
