"use client";

import { createContext, useContext } from "react";
import type {
  AdminAccount,
  Comment,
  ManagedUser,
  Post,
  PostInput,
  Profile,
  RealtimeEvent,
} from "@/src/lib/types";

export interface BlogContextValue {
  authenticated: boolean;
  checkingSession: boolean;
  loading: boolean;
  error: string;
  posts: Post[];
  comments: Comment[];
  profiles: Profile[];
  users: ManagedUser[];
  account: AdminAccount | null;
  clearError: () => void;
  signIn: (username: string, password: string) => Promise<void>;
  signOut: () => void;
  createPost: (post: PostInput) => Promise<void>;
  updatePost: (id: string, post: PostInput) => Promise<void>;
  loadPostDetail: (id: string) => Promise<Post | null>;
  applyRealtimeEvent: (event: RealtimeEvent) => void;
  deletePost: (id: string) => Promise<void>;
  changePostState: (id: string, published: boolean) => Promise<void>;
  addComment: (postId: string, content: string) => Promise<void>;
  editComment: (id: string, content: string) => Promise<void>;
  deleteComment: (id: string) => Promise<void>;
  deleteUser: (id: string) => Promise<void>;
  updateAccount: (path: string, body: Record<string, string>) => Promise<void>;
}

export const BlogContext = createContext<BlogContextValue | null>(null);

export function useBlog(): BlogContextValue {
  const value = useContext(BlogContext);
  if (!value) {
    throw new Error("useBlog must be used inside BlogProvider.");
  }
  return value;
}
