"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Field, Notice, PageHeading } from "@/app/components/ui";
import { useBlog } from "@/src/lib/blog-context";

export default function SignInPage() {
  const router = useRouter();
  const { authenticated, checkingSession, loading, error, clearError, signIn } = useBlog();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="mx-auto max-w-xl">
      <PageHeading
        eyebrow="Admin access"
        title={authenticated ? "You’re signed in" : "Welcome back"}
        description={
          authenticated
            ? "Your admin account is ready."
            : "Sign in with your admin account to manage the blog."
        }
      />
      {authenticated ? (
        <div className="rounded-2xl border border-forest/10 bg-white p-6">
          <p className="text-sm text-ink/70">You already have an active session.</p>
          <Link href="/account" className="mt-4 inline-block font-semibold text-forest underline">Go to account</Link>
        </div>
      ) : (
        <form
          className="grid gap-5 rounded-2xl border border-forest/10 bg-white p-5 shadow-sm sm:p-8"
          onSubmit={(event) => {
            event.preventDefault();
            clearError();
            void signIn(username, password)
              .then(() => router.replace("/account"))
              .catch(() => undefined);
          }}
        >
          {error && <Notice tone="error">{error}</Notice>}
          {checkingSession && <p className="text-sm text-ink/55">Restoring your session…</p>}
          <Field
            label="Email address"
            type="email"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="you@example.com"
            required
          />
          <Field
            label="Password"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <Button disabled={loading || checkingSession}>
            {loading ? "Signing in…" : "Sign in"}
          </Button>
        </form>
      )}
    </div>
  );
}
