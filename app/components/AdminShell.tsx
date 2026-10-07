"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, LayoutDashboard, LogOut, Menu, Users } from "lucide-react";
import { useState } from "react";
import type { ReactNode } from "react";
import { Notice } from "@/app/components/ui";
import { useBlog } from "@/src/lib/blog-context";

const navItems = [
  { href: "/", label: "Home", icon: LayoutDashboard },
  { href: "/posts", label: "Posts", icon: BookOpen },
  { href: "/users", label: "Users", icon: Users },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { authenticated, error, clearError, signOut } = useBlog();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-20 border-b border-forest/10 bg-paper/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex shrink-0 items-center gap-2 font-bold text-forest">
            <span className="grid size-9 place-items-center rounded-xl bg-forest text-lime">
              <BookOpen size={19} aria-hidden="true" />
            </span>
            <span className="text-lg">Chofor&apos;s Blog</span>
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-forest hover:bg-mint md:hidden"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <Menu size={22} />
          </button>
          <nav
            aria-label="Main navigation"
            className={`${menuOpen ? "flex" : "hidden"} absolute left-0 right-0 top-full flex-col gap-1 border-b border-forest/10 bg-paper p-4 md:static md:flex md:flex-row md:items-center md:gap-2 md:border-0 md:bg-transparent md:p-0`}
          >
            {navItems.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                aria-current={pathname === href ? "page" : undefined}
                className={`flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  pathname === href
                    ? "bg-mint text-forest"
                    : "text-ink/70 hover:bg-mint/70 hover:text-forest"
                }`}
              >
                <Icon size={17} aria-hidden="true" />
                {label}
              </Link>
            ))}
            {authenticated && (
              <Link
                href="/account"
                onClick={() => setMenuOpen(false)}
                aria-current={pathname === "/account" ? "page" : undefined}
                className={`rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  pathname === "/account"
                    ? "bg-mint text-forest"
                    : "text-ink/70 hover:bg-mint/70 hover:text-forest"
                }`}
              >
                Account
              </Link>
            )}
            {authenticated ? (
              <button
                type="button"
                onClick={() => {
                  signOut();
                  setMenuOpen(false);
                }}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-left text-sm font-semibold text-ink/70 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut size={17} aria-hidden="true" />
                Sign out
              </button>
            ) : (
              <Link
                href="/signIn"
                onClick={() => setMenuOpen(false)}
                className="rounded-lg bg-forest px-4 py-2 text-center text-sm font-semibold text-white hover:bg-forest/90"
              >
                Sign in
              </Link>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 sm:py-10 lg:px-8">
        {error && pathname !== "/signIn" && (
          <div className="mb-5">
            <Notice tone="error">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <span>{error}</span>
                <button
                  type="button"
                  className="shrink-0 font-semibold underline"
                  onClick={clearError}
                >
                  Dismiss
                </button>
              </div>
            </Notice>
          </div>
        )}
        {children}
      </main>

      <footer className="border-t border-forest/10 px-4 py-5 text-center text-sm text-ink/60">
        Made by{" "}
        <a
          href="https://github.com/ChoforJr/admin-client-blog-api"
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-forest underline decoration-forest/30 underline-offset-4 hover:decoration-forest"
        >
          Chofor Forsakang
        </a>
      </footer>
    </div>
  );
}
