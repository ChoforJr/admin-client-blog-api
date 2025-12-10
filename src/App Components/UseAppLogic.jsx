import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

export function useAppLogic() {
  const { id } = useParams();
  const [auth, setAuth] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [account, setAccount] = useState([]);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    const authToken = localStorage.getItem("authorization");

    async function getComments() {
      try {
        const response = await fetch(`${apiUrl}/comments`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`Response status: ${response.status}`);
        }

        const result = await response.json();
        const neededItems = result.comments.map((item) => {
          return {
            id: item.id,
            keyID: crypto.randomUUID(),
            content: item.content,
            userId: item.userId,
            postId: item.postId,
            parentId: item.parentId,
            createdAt: item.createdAt,
          };
        });
        setComments(neededItems);
      } catch (error) {
        console.error("Network error:", error);
      }
    }
    getComments();

    if (authToken) {
      async function getUsers() {
        try {
          const response = await fetch(`${apiUrl}/admin/users`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `${authToken}`,
            },
          });
          if (!response.ok) {
            if (response.status == 401) {
              setUsers([]);
              setAuth(false);
              localStorage.removeItem("authorization");
            }
            throw new Error(`Response status: ${response.status}`);
          }

          const result = await response.json();
          const neededItems = result.users.map((item) => {
            return {
              id: item.id,
              keyID: crypto.randomUUID(),
              username: item.username,
              createdAt: item.createdAt,
              role: item.role,
              displayName: item.profile.displayName,
              bio: item.profile.bio ? item.profile.bio : "None",
            };
          });

          setUsers(neededItems);
          setAuth(true);
        } catch (error) {
          console.error("Network error:", error);
        }
      }
      getUsers();

      async function getPosts() {
        try {
          const response = await fetch(`${apiUrl}/admin/post/all`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `${authToken}`,
            },
          });
          if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
          }

          const result = await response.json();
          const neededItems = result.posts.map((item) => {
            return {
              id: item.id,
              keyID: crypto.randomUUID(),
              title: item.title,
              content: item.content,
              published: item.published,
              createdAt: item.createdAt,
              userId: item.userId,
              publishedAt: item.publishedAt,
            };
          });
          setPosts(neededItems);
        } catch (error) {
          console.error("Network error:", error);
        }
      }
      getPosts();
    }
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authorization");
    if (authToken && auth) {
      async function getAccountInfo() {
        try {
          const response = await fetch(`${apiUrl}/admin/profile`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              authorization: `${authToken}`,
            },
          });
          if (!response.ok) {
            if (response.status == 401) {
              setAccount([]);
              setAuth(false);
              localStorage.removeItem("authorization");
            }
            throw new Error(`Response status: ${response.status}`);
          }

          const result = await response.json();
          const neededItems = {
            id: result.adminInfo.id,
            keyID: crypto.randomUUID(),
            username: result.adminInfo.username,
            createdAt: result.adminInfo.createdAt,
            role: result.adminInfo.role,
            displayName: result.adminInfo.profile.displayName,
            bio: result.adminInfo.profile.bio,
          };

          setAccount(neededItems);
        } catch (error) {
          console.error("Network error:", error);
        }
      }
      getAccountInfo();
    }
  }, [auth]);
  function addPost(newPost) {
    setPosts((prevPosts) => {
      return [...prevPosts, newPost];
    });
  }
  function addComment(newComment) {
    setComments((prevComments) => {
      return [...prevComments, newComment];
    });
  }
  return {
    id,
    auth,
    setAuth,
    posts,
    addPost,
    comments,
    addComment,
    users,
    account,
  };
}
