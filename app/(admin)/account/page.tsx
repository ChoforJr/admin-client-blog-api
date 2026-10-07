"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import {
  Button,
  Field,
  formatDate,
  LoadingState,
  Notice,
  PageHeading,
} from "@/app/components/ui";
import { useBlog } from "@/src/lib/blog-context";

export default function AccountPage() {
  const { authenticated, checkingSession, account, updateAccount } = useBlog();
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");
  const [username, setUsername] = useState("");
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  if (checkingSession) return <LoadingState label="Loading account…" />;
  if (!authenticated || !account) {
    return (
      <div className="mx-auto max-w-2xl">
        <PageHeading title="Sign in required" description="Sign in to view and manage your account." />
        <Notice tone="error">Your account details are available after signing in.</Notice>
      </div>
    );
  }

  async function save(path: string, body: Record<string, string>, successMessage: string): Promise<boolean> {
    setError("");
    setSuccess("");
    setSaving(true);
    try {
      await updateAccount(path, body);
      setSuccess(successMessage);
      return true;
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Unable to update your account.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <PageHeading
        eyebrow="Your profile"
        title="Account settings"
        description="Manage your public profile, sign-in details, and password."
      />
      {(error || success) && (
        <div className="mb-5">
          <Notice tone={error ? "error" : "success"}>{error || success}</Notice>
        </div>
      )}
      <section className="mb-6 grid gap-3 rounded-2xl border border-forest/10 bg-white p-5 sm:grid-cols-2 sm:p-7">
        <Info label="Account ID" value={String(account.id)} />
        <Info label="Username" value={account.username} />
        <Info label="Display name" value={account.displayName} />
        <Info label="Role" value={account.role} />
        <Info label="Bio" value={account.bio || "No bio added"} />
        <Info label="Created" value={formatDate(account.createdAt)} />
      </section>

      <div className="grid gap-5 lg:grid-cols-2">
        <SettingsCard title="Public profile">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void save("/user/displayName", { newDisplayName: displayName }, "Display name updated.")
                .then((saved) => saved && setDisplayName(""));
            }}
          >
            <Field label="New display name" value={displayName} onChange={(event) => setDisplayName(event.target.value)} required />
            <Button disabled={saving || !displayName.trim()}>Update name</Button>
          </form>
          <form
            className="mt-6 grid gap-4 border-t border-forest/10 pt-5"
            onSubmit={(event) => {
              event.preventDefault();
              void save("/user/bio", { newBio: bio }, "Bio updated.").then((saved) => saved && setBio(""));
            }}
          >
            <Field label="New bio" value={bio} onChange={(event) => setBio(event.target.value)} required />
            <Button disabled={saving || !bio.trim()}>Update bio</Button>
          </form>
        </SettingsCard>

        <SettingsCard title="Sign-in details">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              void save("/user/username", { newUsername: username }, "Username updated.")
                .then((saved) => saved && setUsername(""));
            }}
          >
            <Field label="New email address" type="email" autoComplete="email" value={username} onChange={(event) => setUsername(event.target.value)} required />
            <Button disabled={saving || !username.trim()}>Update email</Button>
          </form>
        </SettingsCard>

        <SettingsCard title="Change password">
          <form
            className="grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              if (passwords.newPassword !== passwords.confirmNewPassword) {
                setError("The new password and confirmation do not match.");
                setSuccess("");
                return;
              }
              void save("/user/password", passwords, "Password updated.")
                .then((saved) => saved && setPasswords({ currentPassword: "", newPassword: "", confirmNewPassword: "" }));
            }}
          >
            <Field label="Current password" type="password" autoComplete="current-password" value={passwords.currentPassword} onChange={(event) => setPasswords({ ...passwords, currentPassword: event.target.value })} required />
            <Field label="New password" type="password" autoComplete="new-password" value={passwords.newPassword} onChange={(event) => setPasswords({ ...passwords, newPassword: event.target.value })} required />
            <Field label="Confirm new password" type="password" autoComplete="new-password" value={passwords.confirmNewPassword} onChange={(event) => setPasswords({ ...passwords, confirmNewPassword: event.target.value })} required />
            <Button disabled={saving}>Update password</Button>
          </form>
        </SettingsCard>
      </div>
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-paper px-4 py-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-ink/50">{label}</p>
      <p className="mt-1 break-words font-semibold">{value}</p>
    </div>
  );
}

function SettingsCard({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="rounded-2xl border border-forest/10 bg-white p-5 sm:p-6">
      <h2 className="mb-5 text-lg font-bold">{title}</h2>
      {children}
    </section>
  );
}
