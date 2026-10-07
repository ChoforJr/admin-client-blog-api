import { LoadingState } from "@/app/components/ui";

export default function Loading() {
  return (
    <div className="mx-auto max-w-2xl py-12">
      <LoadingState label="Loading the admin dashboard…" />
    </div>
  );
}
