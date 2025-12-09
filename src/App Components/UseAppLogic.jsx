import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
const apiUrl = import.meta.env.VITE_BLOG_API_URL;

export function useAppLogic() {
  const { name } = useParams();
  const [auth, setAuth] = useState(false);
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [account, setAccount] = useState([]);
  const [currentComments, setCurrentComments] = useState([]);

  useEffect(() => {
    const authToken = localStorage.getItem("authorization");
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
              username: item.username,
              createdAt: item.createdAt,
              role: item.role,
              displayName: item.profile.displayName,
              bio: item.profile.bio,
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
  console.log(posts);
  return {
    name,
    auth,
    setAuth,
    posts,
    currentComments,
    setCurrentComments,
    users,
    account,
  };
}
