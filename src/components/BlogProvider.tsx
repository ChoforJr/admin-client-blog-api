"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { apiRequest, ApiRequestError } from "@/src/lib/api";
import { BlogContext } from "@/src/lib/blog-context";
import type {
  AdminAccount,
  Comment,
  ManagedUser,
  Post,
  PostInput,
  Profile,
  RealtimeEvent,
} from "@/src/lib/types";

interface AdminProfileResponse {
  adminInfo: {
    id: number;
    username: string;
    role: string;
    createdAt: string;
    profile?: { displayName: string; bio: string | null } | null;
  };
}

interface UsersResponse {
  users: Array<{
    id: number;
    username: string;
    role: string;
    createdAt: string;
    profile?: { displayName?: string; bio?: string | null } | null;
  }>;
}

interface PostsResponse {
  posts: Post[];
}

interface CommentsResponse {
  comments: Comment[];
}

interface ProfilesResponse {
  profiles: Profile[];
}

interface PostResponse {
  post?: Post[] | Post | null;
  publishedPost?: Post[] | Post | null;
}

interface CommentResponse {
  comment: Comment[] | Comment;
}

function mapAccount(data: AdminProfileResponse["adminInfo"]): AdminAccount {
  return {
    id: data.id,
    username: data.username,
    role: data.role,
    createdAt: data.createdAt,
    displayName: data.profile?.displayName || data.username,
    bio: data.profile?.bio ?? null,
  };
}

function first<T>(value: T[] | T): T {
  return Array.isArray(value) ? value[0] : value;
}

function normalizePost(value: Post): Post {
  return {
    ...value,
    id: value.id,
    userId: value.userId,
    published: Boolean(value.published),
    publishedAt: value.publishedAt ?? null,
  };
}

function postFromResponse(result: PostResponse): Post | null {
  const post = result.post ?? result.publishedPost ?? null;
  if (!post) return null;
  const normalized = first(post);
  return normalized ? normalizePost(normalized) : null;
}

export function BlogProvider({ children }: { children: ReactNode }) {
  const [authenticated, setAuthenticated] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [users, setUsers] = useState<ManagedUser[]>([]);
  const [account, setAccount] = useState<AdminAccount | null>(null);

  const loadAdminData = useCallback(async (signal?: AbortSignal) => {
    const accountData = await apiRequest<AdminProfileResponse>(
      "/admin/profile",
      { signal },
    );
    setAccount(mapAccount(accountData.adminInfo));
    setAuthenticated(true);

    const [postData, userData] = await Promise.all([
      apiRequest<PostsResponse>("/admin/post/all", { signal }),
      apiRequest<UsersResponse>("/admin/users", { signal }),
    ]);
    setPosts(postData.posts.map(normalizePost));
    setUsers(
      userData.users.map((user) => ({
        id: user.id,
        username: user.username,
        role: user.role,
        createdAt: user.createdAt,
        displayName: user.profile?.displayName || "—",
        bio: user.profile?.bio || null,
      })),
    );
  }, []);

  const loadPublicData = useCallback(async (signal?: AbortSignal) => {
    const [commentData, profileData] = await Promise.all([
      apiRequest<CommentsResponse>("/comments", { signal }),
      apiRequest<ProfilesResponse>("/profiles", { signal }),
    ]);
    setComments(commentData.comments);
    setProfiles(profileData.profiles);
  }, []);

  useEffect(() => {
    let active = true;
    const controller = new AbortController();
    void (async () => {
      const publicRequest = loadPublicData(controller.signal).catch((cause: unknown) => {
        if (active) {
          setError(
            cause instanceof Error ? cause.message : "Unable to load public blog data.",
          );
        }
      });

      try {
        await loadAdminData(controller.signal);
      } catch (cause) {
        const isUnauthorized =
          cause instanceof ApiRequestError &&
          cause.status === 401 &&
          cause.path === "/admin/profile";
        if (active && !isUnauthorized) {
          setError(
            cause instanceof Error ? cause.message : "Unable to restore your session.",
          );
        }
      } finally {
        await publicRequest;
        if (active) setCheckingSession(false);
      }
    })();

    return () => {
      active = false;
      controller.abort();
    };
  }, [loadAdminData, loadPublicData]);

  const runWithError = useCallback(async (action: () => Promise<void>) => {
    setError("");
    try {
      await action();
    } catch (cause) {
      const message =
        cause instanceof Error ? cause.message : "Something went wrong.";
      setError(message);
      throw cause instanceof Error ? cause : new Error(message);
    }
  }, []);

  const signIn = useCallback(
    async (username: string, password: string) => {
      await runWithError(async () => {
        setLoading(true);
        try {
          await apiRequest<unknown>("/login", {
            method: "POST",
            body: JSON.stringify({ username, password }),
          });
          await loadAdminData();
          await loadPublicData().catch((cause: unknown) => {
            setError(
              cause instanceof Error
                ? cause.message
                : "Unable to load public blog data.",
            );
          });
        } finally {
          setLoading(false);
        }
      });
    },
    [loadAdminData, loadPublicData, runWithError],
  );

  const signOut = useCallback(() => {
    setAuthenticated(false);
    setPosts([]);
    setUsers([]);
    setAccount(null);
    setError("");
    void apiRequest<unknown>("/logout", { method: "POST" }).catch((cause: unknown) => {
      setError(
        cause instanceof Error ? cause.message : "Unable to end your session.",
      );
    });
  }, []);

  const createPost = useCallback(
    (input: PostInput) =>
      runWithError(async () => {
        setLoading(true);
        try {
          const result = await apiRequest<PostResponse>(
            "/admin/post",
            { method: "POST", body: JSON.stringify(input) },
          );
          const created = postFromResponse(result);
          if (created) setPosts((current) => [...current, created]);
        } finally {
          setLoading(false);
        }
      }),
    [runWithError],
  );

  const loadPostDetail = useCallback(
    async (id: string): Promise<Post | null> => {
      try {
        const result = await apiRequest<PostResponse>(
          `/post/${encodeURIComponent(id)}`,
        );
        const post = postFromResponse(result);
        if (!post) return null;

        setPosts((current) => {
          const exists = current.some(
            (item) => String(item.id) === String(post.id),
          );
          return exists
            ? current.map((item) =>
                String(item.id) === String(post.id) ? post : item,
              )
            : [...current, post];
        });

        try {
          const commentsResult = await apiRequest<CommentsResponse>(
            `/post/${encodeURIComponent(id)}/comments`,
          );
          setComments((current) => [
            ...current.filter((comment) => String(comment.postId) !== id),
            ...commentsResult.comments,
          ]);
        } catch {
          // The all-comments endpoint may already have supplied the comments.
        }
        return post;
      } catch (cause) {
        if (cause instanceof ApiRequestError && cause.status === 404) {
          if (authenticated) {
            const result = await apiRequest<PostsResponse>("/admin/post/all");
            const adminPost = result.posts
              .map(normalizePost)
              .find((item) => String(item.id) === id);
            setPosts((current) => {
              const others = current.filter((item) => String(item.id) !== id);
              return adminPost ? [...others, adminPost] : others;
            });
            return adminPost ?? null;
          }
          return null;
        }
        throw cause;
      }
    },
    [authenticated],
  );

  const applyRealtimeEvent = useCallback(
    (event: RealtimeEvent) => {
      switch (event.event) {
        case "post:created":
        case "post:updated":
        case "post:published": {
          const post = normalizePost(event.payload);
          setPosts((current) => {
            const exists = current.some(
              (item) => String(item.id) === String(post.id),
            );
            return exists
              ? current.map((item) =>
                  String(item.id) === String(post.id) ? post : item,
                )
              : [...current, post];
          });
          break;
        }
        case "post:deleted":
          void loadPostDetail(String(event.payload.postId)).catch(() => {
            // Keep the last known post if the API is temporarily unreachable.
          });
          break;
        case "comment:created":
          setComments((current) =>
            current.some(
              (comment) => String(comment.id) === String(event.payload.id),
            )
              ? current
              : [...current, event.payload],
          );
          break;
        case "comment:updated":
          setComments((current) =>
            current.map((comment) =>
              String(comment.id) === String(event.payload.id)
                ? event.payload
                : comment,
            ),
          );
          break;
        case "comment:deleted":
          setComments((current) =>
            current.filter(
              (comment) =>
                String(comment.id) !== String(event.payload.commentId),
            ),
          );
          break;
      }
    },
    [loadPostDetail],
  );

  const updatePost = useCallback(
    (id: string, input: PostInput) =>
      runWithError(async () => {
        setLoading(true);
        try {
          await apiRequest(
            `/admin/post/${encodeURIComponent(id)}`,
            { method: "PUT", body: JSON.stringify(input) },
          );
          setPosts((current) =>
            current.map((post) =>
              String(post.id) === id
                ? {
                    ...post,
                    ...input,
                    publishedAt: input.published
                      ? post.publishedAt || new Date().toISOString()
                      : null,
                  }
                : post,
            ),
          );
        } finally {
          setLoading(false);
        }
      }),
    [runWithError],
  );

  const deletePost = useCallback(
    (id: string) =>
      runWithError(async () => {
        await apiRequest(
          `/admin/post/${encodeURIComponent(id)}`,
          { method: "DELETE" },
        );
        setPosts((current) => current.filter((post) => String(post.id) !== id));
      }),
    [runWithError],
  );

  const changePostState = useCallback(
    (id: string, published: boolean) =>
      runWithError(async () => {
        await apiRequest(
          `/admin/post/state/${encodeURIComponent(id)}`,
          { method: "PUT", body: JSON.stringify({ published }) },
        );
        setPosts((current) =>
          current.map((post) =>
            String(post.id) === id
              ? {
                  ...post,
                  published,
                  publishedAt: published
                    ? new Date().toISOString()
                    : null,
                }
              : post,
          ),
        );
      }),
    [runWithError],
  );

  const addComment = useCallback(
    (postId: string, content: string) =>
      runWithError(async () => {
        const result = await apiRequest<CommentResponse>(
          `/user/post/${encodeURIComponent(postId)}/comment`,
          { method: "POST", body: JSON.stringify({ content }) },
        );
        const comment = first(result.comment);
        if (comment) setComments((current) => [...current, comment]);
      }),
    [runWithError],
  );

  const editComment = useCallback(
    (id: string, content: string) =>
      runWithError(async () => {
        await apiRequest(
          `/user/post/comment/${encodeURIComponent(id)}`,
          { method: "PUT", body: JSON.stringify({ content }) },
        );
        setComments((current) =>
          current.map((comment) =>
            String(comment.id) === id ? { ...comment, content } : comment,
          ),
        );
      }),
    [runWithError],
  );

  const deleteComment = useCallback(
    (id: string) =>
      runWithError(async () => {
        await apiRequest(
          `/admin/post/comment/${encodeURIComponent(id)}`,
          { method: "DELETE" },
        );
        setComments((current) =>
          current.filter((comment) => String(comment.id) !== id),
        );
      }),
    [runWithError],
  );

  const deleteUser = useCallback(
    (id: string) =>
      runWithError(async () => {
        await apiRequest(
          `/admin/user/${encodeURIComponent(id)}`,
          { method: "DELETE" },
        );
        setUsers((current) => current.filter((user) => String(user.id) !== id));
      }),
    [runWithError],
  );

  const updateAccount = useCallback(
    (path: string, body: Record<string, string>) =>
      runWithError(async () => {
        await apiRequest(
          path,
          { method: "PUT", body: JSON.stringify(body) },
        );
        setAccount((current) => {
          if (!current) return current;
          if (path === "/user/displayName") {
            return { ...current, displayName: body.newDisplayName };
          }
          if (path === "/user/bio") {
            return { ...current, bio: body.newBio };
          }
          if (path === "/user/username") {
            return { ...current, username: body.newUsername };
          }
          return current;
        });
      }),
    [runWithError],
  );

  const value = useMemo(
    () => ({
      authenticated,
      checkingSession,
      loading,
      error,
      posts,
      comments,
      profiles,
      users,
      account,
      clearError: () => setError(""),
      signIn,
      signOut,
      createPost,
      updatePost,
      loadPostDetail,
      applyRealtimeEvent,
      deletePost,
      changePostState,
      addComment,
      editComment,
      deleteComment,
      deleteUser,
      updateAccount,
    }),
    [
      account,
      addComment,
      authenticated,
      changePostState,
      checkingSession,
      comments,
      createPost,
      deleteComment,
      deletePost,
      deleteUser,
      editComment,
      error,
      loading,
      loadPostDetail,
      applyRealtimeEvent,
      posts,
      profiles,
      signIn,
      signOut,
      updateAccount,
      updatePost,
      users,
    ],
  );

  return <BlogContext.Provider value={value}>{children}</BlogContext.Provider>;
}
