import Link from "next/link";
import { ButtonLink, PageHeading } from "@/app/components/ui";

export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl py-12 text-center">
      <PageHeading
        eyebrow="404"
        title="This page isn’t here"
        description="The page or post you’re looking for may have been moved or deleted."
      />
      <ButtonLink href="/">Return home</ButtonLink>
      <p className="mt-5 text-sm">
        <Link href="/posts" className="font-semibold text-forest underline">
          Browse posts
        </Link>
      </p>
    </section>
  );
}
