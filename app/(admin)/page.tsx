"use client";

import Link from "next/link";
import { ArrowRight, FileText, MessageCircle, Users } from "lucide-react";
import { LoadingState, Notice, PageHeading, formatDate } from "@/app/components/ui";
import { useBlog } from "@/src/lib/blog-context";

export default function HomePage() {
  const {
    authenticated,
    checkingSession,
    error,
    posts,
    comments,
    users,
    account,
  } = useBlog();

  return (
    <div>
      <PageHeading
        eyebrow="Admin dashboard"
        title={`Welcome${account?.displayName ? `, ${account.displayName}` : ""}`}
        description="A clear view of your blog, with the tools to keep everything running."
      />
      {error && <Notice tone="error">{error}</Notice>}
      {checkingSession ? (
        <LoadingState label="Checking your session…" />
      ) : authenticated ? (
        <>
          <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Total posts", count: posts.length, Icon: FileText, href: "/posts" },
              { label: "Comments", count: comments.length, Icon: MessageCircle, href: "/posts" },
              { label: "Users", count: users.length, Icon: Users, href: "/users" },
            ].map(({ label, count, Icon, href }) => (
              <Link
                key={label}
                href={href}
                className="group rounded-2xl border border-forest/10 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
              >
                <div className="flex items-center justify-between text-forest">
                  <span className="text-sm font-semibold text-ink/60">{label}</span>
                  <Icon size={19} aria-hidden="true" />
                </div>
                <p className="mt-5 text-4xl font-bold tracking-tight">{count}</p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-forest">
                  Manage <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                </span>
              </Link>
            ))}
          </section>
          <section className="mt-8 rounded-2xl border border-forest/10 bg-white p-5 sm:p-7">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-forest/60">
                  Recent activity
                </p>
                <h2 className="mt-2 text-xl font-bold">Latest posts</h2>
              </div>
              <Link href="/posts" className="text-sm font-semibold text-forest hover:underline">
                View all posts
              </Link>
            </div>
            {posts.length ? (
              <ul className="mt-5 divide-y divide-forest/10">
                {posts.slice(0, 5).map((post) => (
                  <li key={post.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                    <div className="min-w-0">
                      <Link
                        href={`/posts/${post.id}`}
                        className="font-semibold text-ink hover:text-forest"
                      >
                        {post.title}
                      </Link>
                      <p className="mt-1 text-sm text-ink/55">{formatDate(post.createdAt)}</p>
                    </div>
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${
                        post.published ? "bg-emerald-50 text-emerald-800" : "bg-amber-50 text-amber-800"
                      }`}
                    >
                      {post.published ? "Published" : "Draft"}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-5 rounded-xl bg-paper px-4 py-8 text-center text-sm text-ink/60">
                No posts to show yet.
              </p>
            )}
          </section>
        </>
      ) : (
        <div className="rounded-3xl bg-forest px-6 py-10 text-white sm:px-10 sm:py-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-lime">Your workspace</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-bold leading-tight sm:text-5xl">
            The home for your blog’s stories and community.
          </h2>
          <p className="mt-4 max-w-xl leading-7 text-white/75">
            Sign in to manage posts, review comments, update your profile, and take care of your users.
          </p>
          <Link
            href="/signIn"
            className="mt-7 inline-flex min-h-11 items-center rounded-xl bg-lime px-5 py-2.5 text-sm font-bold text-ink hover:bg-lime/90"
          >
            Sign in to continue <ArrowRight size={16} className="ml-2" />
          </Link>
        </div>
      )}
    </div>
  );
}
