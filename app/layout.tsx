import type { Metadata } from "next";
import type { ReactNode } from "react";
import { BlogProvider } from "@/src/components/BlogProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "Chofor's Blog — Admin",
  description: "Manage blog posts, comments, users, and account settings.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        <BlogProvider>{children}</BlogProvider>
      </body>
    </html>
  );
}
