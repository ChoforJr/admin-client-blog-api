export type Identifier = number | string;

export interface Post {
  id: Identifier;
  title: string;
  content: string;
  published: boolean;
  createdAt: string;
  publishedAt: string | null;
  userId: Identifier;
}

export interface Comment {
  id: Identifier;
  content: string;
  userId: Identifier;
  postId: Identifier;
  createdAt: string;
}

export interface Profile {
  id: Identifier;
  userId: Identifier;
  displayName: string;
  bio: string | null;
}

export interface AdminAccount {
  id: Identifier;
  username: string;
  role: string;
  displayName: string;
  bio: string | null;
  createdAt: string;
}

export type ManagedUser = AdminAccount;

export interface PostInput {
  title: string;
  content: string;
  published: boolean;
}

export type RealtimeEvent =
  | { event: "post:created" | "post:updated" | "post:published"; payload: Post }
  | { event: "post:deleted"; payload: { postId: Identifier } }
  | { event: "comment:created" | "comment:updated"; payload: Comment }
  | {
      event: "comment:deleted";
      payload: { commentId: Identifier; postId: Identifier };
    };
