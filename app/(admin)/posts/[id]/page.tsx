"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Button, EmptyState, Field, LoadingState, Notice, PageHeading, formatDate } from "@/app/components/ui";
import { MarkdownContent } from "@/app/components/MarkdownContent";
import { useBlog } from "@/src/lib/blog-context";
import { usePostWebSocket } from "@/src/hooks/usePostWebSocket";
import type { Comment, RealtimeEvent } from "@/src/lib/types";

export default function PostDetailPage() {
  const params = useParams<{ id: string }>();
  const postId = String(params.id);
  const {
    authenticated,
    checkingSession,
    posts,
    comments,
    profiles,
    account,
    addComment,
    applyRealtimeEvent,
    editComment,
    deleteComment,
    loadPostDetail,
  } = useBlog();
  const [newComment, setNewComment] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState("");
  const [working, setWorking] = useState(false);
  const [error, setError] = useState("");
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState("");
  const post = posts.find((item) => String(item.id) === postId);
  const postComments = comments.filter((item) => String(item.postId) === postId);

  useEffect(() => {
    if (checkingSession || !authenticated) return;
    let active = true;
    setDetailLoading(true);
    setDetailError("");
    void loadPostDetail(postId)
      .then((result) => {
        if (active && !result) {
          setDetailError("This post may have been deleted or the link may be incorrect.");
        }
      })
      .catch((cause: unknown) => {
        if (active) {
          setDetailError(
            cause instanceof Error ? cause.message : "Unable to load this post.",
          );
        }
      })
      .finally(() => {
        if (active) setDetailLoading(false);
      });
    return () => {
      active = false;
    };
  }, [authenticated, checkingSession, loadPostDetail, postId]);

  const handleRealtimeEvent = useCallback(
    (event: RealtimeEvent) => {
      applyRealtimeEvent(event);
    },
    [applyRealtimeEvent],
  );
  const liveConnected = usePostWebSocket(
    postId,
    authenticated && !checkingSession,
    handleRealtimeEvent,
  );

  if (checkingSession) return <LoadingState label="Loading post…" />;
  async function submit(action: () => Promise<void>) {
    setError("");
    setWorking(true);
    try {
      await action();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to complete that action.");
    } finally {
      setWorking(false);
    }
  }

  if (!authenticated) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeading title="Sign in required" description="Sign in to see post details and moderate comments." />
        <Notice><Link href="/signIn" className="font-semibold text-forest underline">Sign in</Link> to continue.</Notice>
      </div>
    );
  }
  if (detailLoading && !post) return <LoadingState label="Loading post details…" />;
  if (!post) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeading
          eyebrow="404"
          title={detailError ? "Unable to load post" : "Post not found"}
          description={detailError || "This post may have been deleted or the link may be incorrect."}
        />
        {detailError && !detailError.includes("deleted") && (
          <div className="mb-4"><Notice tone="error">{detailError}</Notice></div>
        )}
        <Link href="/posts" className="font-semibold text-forest underline">
          Return to all posts
        </Link>
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-4xl">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <Link href="/posts" className="text-sm font-semibold text-forest hover:underline">← All posts</Link>
        <Link href={`/editPost/${post.id}`} className="text-sm font-semibold text-forest hover:underline">Edit post</Link>
      </div>
      {error && <div className="mb-5"><Notice tone="error">{error}</Notice></div>}
      {detailError && <div className="mb-5"><Notice tone="error">{detailError}</Notice></div>}
      <header className="rounded-3xl bg-forest px-6 py-8 text-white sm:px-10 sm:py-11">
        <span className={`rounded-full px-3 py-1 text-xs font-semibold ${post.published ? "bg-lime text-forest" : "bg-white/15 text-white"}`}>
          {post.published ? "Published" : "Draft"}
        </span>
        <h1 className="mt-5 break-words text-3xl font-bold leading-tight sm:text-5xl">{post.title}</h1>
        <p className="mt-4 text-sm text-white/70">Created {formatDate(post.createdAt)}</p>
      </header>
      <MarkdownContent
        className="mt-6 break-words rounded-2xl border border-forest/10 bg-white p-5 text-base leading-8 text-ink/80 sm:p-8"
        content={post.content}
      />

      <section className="mt-10">
        <div className="mb-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest/60">Community</p>
            <span className={`inline-flex items-center gap-2 text-xs ${liveConnected ? "text-emerald-700" : "text-ink/45"}`}>
              <span className={`size-2 rounded-full ${liveConnected ? "bg-emerald-500" : "bg-ink/25"}`} />
              {liveConnected ? "Live updates connected" : "Reconnecting to live updates"}
            </span>
          </div>
          <h2 className="mt-1 text-2xl font-bold">Comments <span className="text-ink/45">({postComments.length})</span></h2>
        </div>
        <form
          className="mb-6 flex flex-col gap-3 rounded-2xl border border-forest/10 bg-white p-4 sm:flex-row sm:items-end"
          onSubmit={(event) => {
            event.preventDefault();
            if (!newComment.trim()) return;
            void submit(async () => {
              await addComment(postId, newComment.trim());
              setNewComment("");
            });
          }}
        >
          <Field
            label="Add a comment"
            value={newComment}
            onChange={(event) => setNewComment(event.target.value)}
            placeholder="Write a comment…"
            className="flex-1"
            required
          />
          <Button disabled={working || !newComment.trim()}>Add comment</Button>
        </form>
        {postComments.length === 0 ? (
          <EmptyState title="No comments yet" description="Comments on this post will appear here." />
        ) : (
          <div className="grid gap-3">
            {postComments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                profileName={profiles.find((profile) => String(profile.userId) === String(comment.userId))?.displayName || "Blog reader"}
                canEdit={String(comment.userId) === String(account?.id)}
                editing={editingId === String(comment.id)}
                editingContent={editingContent}
                setEditingContent={setEditingContent}
                working={working}
                onEdit={() => {
                  setEditingId(String(comment.id));
                  setEditingContent(comment.content);
                }}
                onCancel={() => {
                  setEditingId(null);
                  setEditingContent("");
                }}
                onSave={() =>
                  void submit(async () => {
                    await editComment(String(comment.id), editingContent.trim());
                    setEditingId(null);
                  })
                }
                onDelete={() => {
                  if (window.confirm("Delete this comment?")) {
                    void submit(() => deleteComment(String(comment.id)));
                  }
                }}
              />
            ))}
          </div>
        )}
      </section>
    </article>
  );
}

function CommentCard({
  comment,
  profileName,
  canEdit,
  editing,
  editingContent,
  setEditingContent,
  working,
  onEdit,
  onCancel,
  onSave,
  onDelete,
}: {
  comment: Comment;
  profileName: string;
  canEdit: boolean;
  editing: boolean;
  editingContent: string;
  setEditingContent: (value: string) => void;
  working: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onSave: () => void;
  onDelete: () => void;
}) {
  return (
    <article className="rounded-2xl border border-forest/10 bg-white p-4 sm:p-5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-sm font-semibold text-forest">{profileName}</p>
        <time className="text-xs text-ink/50">{formatDate(comment.createdAt)}</time>
      </div>
      {editing ? (
        <div className="mt-4 grid gap-3">
          <Field
            label="Edit comment"
            value={editingContent}
            onChange={(event) => setEditingContent(event.target.value)}
            required
          />
          <div className="flex flex-wrap gap-2">
            <Button onClick={onSave} disabled={working || !editingContent.trim()}>Save</Button>
            <Button variant="secondary" onClick={onCancel}>Cancel</Button>
          </div>
        </div>
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-sm leading-6 text-ink/75">{comment.content}</p>
      )}
      <div className="mt-4 flex gap-2">
        {canEdit && !editing && <Button variant="secondary" onClick={onEdit}>Edit</Button>}
        {!editing && <Button variant="danger" onClick={onDelete} disabled={working}>Delete</Button>}
      </div>
    </article>
  );
}
