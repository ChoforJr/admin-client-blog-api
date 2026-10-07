"use client";

import { Button } from "@/app/components/ui";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <section className="mx-auto max-w-2xl py-12">
      <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
        <h1 className="text-2xl font-bold text-red-900">Something went wrong</h1>
        <p className="mt-2 text-sm text-red-800">
          The page could not be displayed. Please try again.
        </p>
        <Button className="mt-5" onClick={() => reset()}>
          Try again
        </Button>
      </div>
    </section>
  );
}
