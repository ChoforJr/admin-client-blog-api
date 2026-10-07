"use client";

import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button, Field, LoadingState, Notice, PageHeading } from "@/app/components/ui";
import { MarkdownEditor } from "@/app/components/MarkdownEditor";
import { useBlog } from "@/src/lib/blog-context";
import type { PostInput } from "@/src/lib/types";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const id = String(params.id);
  const router = useRouter();
  const { authenticated, checkingSession, loading, posts, updatePost } = useBlog();
  const [post, setPost] = useState<PostInput | null>(null);
  const [error, setError] = useState("");
  const existingPost = posts.find((item) => String(item.id) === id);

  useEffect(() => {
    if (existingPost) {
      setPost({
        title: existingPost.title,
        content: existingPost.content,
        published: existingPost.published,
      });
    }
  }, [existingPost]);

  if (checkingSession) return <LoadingState label="Loading post…" />;
  if (!authenticated) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeading title="Sign in required" description="Sign in to edit a post." />
        <Notice tone="error">
          You need an admin session to edit posts.{" "}
          <Link href="/signIn" className="font-semibold underline">Sign in</Link>.
        </Notice>
      </div>
    );
  }
  if (!existingPost) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeading
          eyebrow="404"
          title="Post not found"
          description="This post may have been deleted or the link may be incorrect."
        />
        <Link href="/posts" className="font-semibold text-forest underline">
          Return to all posts
        </Link>
      </div>
    );
  }
  if (!post) {
    return <LoadingState label="Loading post data…" />;
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading
        eyebrow="Content"
        title="Edit post"
        description="Update the post, then save your changes."
      />
      {error && <div className="mb-5"><Notice tone="error">{error}</Notice></div>}
      <form
        className="grid gap-5 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          void updatePost(id, post)
            .then(() => router.replace("/posts"))
            .catch((cause: unknown) =>
              setError(cause instanceof Error ? cause.message : "Could not save the post."),
            );
        }}
      >
        <div>
          <Field
            label="Title"
            maxLength={120}
            minLength={4}
            value={post.title}
            onChange={(event) => setPost({ ...post, title: event.target.value })}
            required
          />
          <p className="mt-1 text-right text-xs text-ink/45">{post.title.length}/120</p>
        </div>
        <div className="grid gap-2 text-sm font-semibold text-ink">
          <span>Content</span>
          <MarkdownEditor
            value={post.content}
            onChange={(content) => setPost({ ...post, content })}
            required
          />
        </div>
        <fieldset className="flex flex-wrap gap-4">
          <legend className="mb-2 text-sm font-semibold text-ink">Publication status</legend>
          {[
            { value: true, label: "Published" },
            { value: false, label: "Draft" },
          ].map((option) => (
            <label key={String(option.value)} className="flex cursor-pointer items-center gap-2 rounded-xl border border-forest/15 px-4 py-3 text-sm">
              <input
                type="radio"
                name="published"
                checked={post.published === option.value}
                onChange={() => setPost({ ...post, published: option.value })}
              />
              {option.label}
            </label>
          ))}
        </fieldset>
        <div className="flex flex-wrap gap-3 border-t border-forest/10 pt-5">
          <Button disabled={loading}>{loading ? "Saving…" : "Save changes"}</Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
