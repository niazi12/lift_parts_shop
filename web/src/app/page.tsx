import { connection } from "next/server";
import { Suspense } from "react";

import { getHealth } from "@/lib/api";

async function ApiStatus() {
  // Live status: render per request, never prerender.
  await connection();
  const health = await getHealth().catch(() => null);
  if (!health) return <p className="text-sm text-destructive">API unreachable</p>;
  return (
    <p className="text-sm text-muted-foreground">
      API: {health.status}, database: {health.database}
    </p>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-4 px-4 py-16">
      <h1 className="text-3xl font-semibold tracking-tight">Lift Parts</h1>
      <p className="max-w-prose text-muted-foreground">
        Stocked lift parts with fast UK delivery. Can&apos;t find your part? Send us a quote request.
      </p>
      <Suspense fallback={<p className="text-sm text-muted-foreground">Checking API…</p>}>
        <ApiStatus />
      </Suspense>
    </main>
  );
}
