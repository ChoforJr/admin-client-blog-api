"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { Button, EmptyState, LoadingState, Notice, PageHeading, formatDate } from "@/app/components/ui";
import { useBlog } from "@/src/lib/blog-context";

export default function UsersPage() {
  const { authenticated, checkingSession, users, deleteUser } = useBlog();
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState<string | null>(null);

  if (checkingSession) return <LoadingState label="Loading users…" />;
  if (!authenticated) {
    return (
      <div>
        <PageHeading eyebrow="Community" title="Users" description="Manage registered blog accounts." />
        <Notice tone="error">Sign in as an admin to manage users.</Notice>
      </div>
    );
  }

  async function removeUser(id: string, username: string) {
    if (!window.confirm(`Delete ${username}? This cannot be undone.`)) return;
    setError("");
    setDeleting(id);
    try {
      await deleteUser(id);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to delete that user.");
    } finally {
      setDeleting(null);
    }
  }

  return (
    <div>
      <PageHeading
        eyebrow="Community"
        title="Users"
        description={`${users.length} ${users.length === 1 ? "account" : "accounts"} registered with the blog.`}
      />
      {error && <div className="mb-5"><Notice tone="error">{error}</Notice></div>}
      {users.length === 0 ? (
        <EmptyState title="No users to show" description="New user accounts will appear here." />
      ) : (
        <>
          <div className="hidden overflow-x-auto rounded-2xl border border-forest/10 bg-white md:block">
            <div className="min-w-[900px]">
              <div className="grid grid-cols-[1.2fr_1.2fr_0.7fr_1.3fr_1fr_auto] gap-4 bg-mint/60 px-5 py-3 text-xs font-bold uppercase tracking-wide text-forest">
                <span>Display name</span><span>Email</span><span>Role</span><span>Bio</span><span>Joined</span><span>Actions</span>
              </div>
              {users.map((user) => (
                <div key={user.id} className="grid grid-cols-[1.2fr_1.2fr_0.7fr_1.3fr_1fr_auto] items-center gap-4 border-t border-forest/10 px-5 py-4 text-sm">
                  <span className="break-words font-semibold">{user.displayName}</span>
                  <span className="break-all text-ink/70">{user.username}</span>
                  <span className="text-ink/70">{user.role}</span>
                  <span className="line-clamp-2 text-ink/60">{user.bio || "—"}</span>
                  <span className="text-xs text-ink/60">{formatDate(user.createdAt)}</span>
                  <Button variant="danger" aria-label={`Delete ${user.username}`} disabled={deleting === String(user.id)} onClick={() => void removeUser(String(user.id), user.username)}>
                    <Trash2 size={15} /> Delete
                  </Button>
                </div>
              ))}
            </div>
          </div>
          <div className="grid gap-3 md:hidden">
            {users.map((user) => (
              <article key={user.id} className="rounded-2xl border border-forest/10 bg-white p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="break-words font-bold">{user.displayName}</h2>
                    <p className="mt-1 break-all text-sm text-ink/65">{user.username}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-mint px-3 py-1 text-xs font-semibold text-forest">{user.role}</span>
                </div>
                <p className="mt-3 text-sm leading-6 text-ink/65">{user.bio || "No bio"}</p>
                <div className="mt-4 flex items-center justify-between gap-2 border-t border-forest/10 pt-3">
                  <span className="text-xs text-ink/55">Joined {formatDate(user.createdAt)}</span>
                  <Button variant="danger" aria-label={`Delete ${user.username}`} disabled={deleting === String(user.id)} onClick={() => void removeUser(String(user.id), user.username)}>
                    <Trash2 size={15} /> Delete
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
