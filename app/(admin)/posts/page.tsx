"use client";

import Link from "next/link";
import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, ButtonLink, EmptyState, LoadingState, Notice, PageHeading, formatDate } from "@/app/components/ui";
import { useBlog } from "@/src/lib/blog-context";

export default function PostsPage() {
  const {
    authenticated,
    checkingSession,
    loading,
    error,
    posts,
    comments,
    changePostState,
    deletePost,
  } = useBlog();
  const [actionError, setActionError] = useState("");

  async function handleAction(action: () => Promise<void>) {
    setActionError("");
    try {
      await action();
    } catch (cause) {
      setActionError(cause instanceof Error ? cause.message : "Unable to complete that action.");
    }
  }

  return (
    <div>
      <PageHeading
        eyebrow="Content"
        title="Posts"
        description="Create, review, publish, or update stories from one place."
        action={
          authenticated ? (
            <ButtonLink href="/createPost">
              <Plus size={17} /> Create post
            </ButtonLink>
          ) : undefined
        }
      />
      {(actionError || (error && authenticated)) && (
        <div className="mb-5">
          <Notice tone="error">{actionError || error}</Notice>
        </div>
      )}
      {checkingSession ? (
        <LoadingState label="Loading posts…" />
      ) : !authenticated ? (
        <Notice>
          <Link href="/signIn" className="font-semibold text-forest underline">Sign in</Link>{" "}
          to view and manage all posts.
        </Notice>
      ) : posts.length === 0 ? (
        <EmptyState
          title="No posts yet"
          description="Create your first post to get started."
        />
      ) : (
        <div className="grid gap-4">
          {posts.map((post) => (
            <article
              key={post.id}
              className="rounded-2xl border border-forest/10 bg-white p-5 shadow-sm sm:p-6"
            >
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        post.published ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                    <span className="text-xs text-ink/50">
                      Created {formatDate(post.createdAt)}
                    </span>
                  </div>
                  <h2 className="mt-3 text-xl font-bold">
                    <Link href={`/posts/${post.id}`} className="hover:text-forest">
                      {post.title}
                    </Link>
                  </h2>
                  <p className="mt-2 line-clamp-2 whitespace-pre-wrap text-sm leading-6 text-ink/65">
                    {post.content}
                  </p>
                  <p className="mt-3 text-xs font-medium text-ink/50">
                    {comments.filter((comment) => String(comment.postId) === String(post.id)).length} comments
                    {post.publishedAt && ` · Published ${formatDate(post.publishedAt)}`}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() =>
                      void handleAction(() => changePostState(String(post.id), !post.published))
                    }
                    disabled={loading}
                  >
                    {post.published ? "Unpublish" : "Publish"}
                  </Button>
                  <ButtonLink href={`/editPost/${post.id}`} className="bg-white text-forest ring-1 ring-forest/15 hover:bg-mint">
                    Edit
                  </ButtonLink>
                  <Button
                    type="button"
                    variant="danger"
                    aria-label={`Delete ${post.title}`}
                    onClick={() => {
                      if (window.confirm(`Delete “${post.title}”? This cannot be undone.`)) {
                        void handleAction(() => deletePost(String(post.id)));
                      }
                    }}
                    disabled={loading}
                  >
                    <Trash2 size={16} /> Delete
                  </Button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
