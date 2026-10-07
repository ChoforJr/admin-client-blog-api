"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { Button, Field, Notice, PageHeading } from "@/app/components/ui";
import { MarkdownEditor } from "@/app/components/MarkdownEditor";
import { useBlog } from "@/src/lib/blog-context";
import type { PostInput } from "@/src/lib/types";

const emptyPost: PostInput = { title: "", content: "", published: true };

export default function CreatePostPage() {
  const router = useRouter();
  const { authenticated, checkingSession, loading, createPost } = useBlog();
  const [post, setPost] = useState<PostInput>(emptyPost);
  const [error, setError] = useState("");

  if (checkingSession) {
    return <p className="text-sm text-ink/60">Checking your session…</p>;
  }
  if (!authenticated) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeading title="Sign in required" description="Sign in to create a post." />
        <Notice tone="error">
          You need an admin session to create posts.{" "}
          <Link href="/signIn" className="font-semibold underline">Sign in</Link>.
        </Notice>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeading
        eyebrow="Content"
        title="Create a post"
        description="Add a story to the blog, and choose whether to publish it now or save it as a draft."
      />
      {error && <div className="mb-5"><Notice tone="error">{error}</Notice></div>}
      <form
        className="grid gap-5 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm sm:p-8"
        onSubmit={(event) => {
          event.preventDefault();
          setError("");
          void createPost(post)
            .then(() => router.replace("/posts"))
            .catch((cause: unknown) =>
              setError(cause instanceof Error ? cause.message : "Could not create the post."),
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
            placeholder="Give your post a title"
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
            { value: true, label: "Publish now" },
            { value: false, label: "Save as draft" },
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
          <Button disabled={loading}>{loading ? "Saving…" : "Create post"}</Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
