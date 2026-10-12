import { timingSafeEqual } from "node:crypto";

import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { z } from "zod";

import { serverEnv } from "@/lib/env";

// Django calls this after a product is saved, with the tags to refresh:
// "products", "product:{slug}" and "category:{slug}".
const bodySchema = z.object({
  tags: z
    .array(z.string().regex(/^(products|categories|brands|(product|category):[a-z0-9-]+)$/))
    .min(1)
    .max(50),
});

function secretMatches(given: string | null): boolean {
  if (!given) return false;
  const a = Buffer.from(given);
  const b = Buffer.from(serverEnv.revalidateSecret);
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function POST(request: Request) {
  if (!secretMatches(request.headers.get("x-revalidate-secret"))) {
    return NextResponse.json({ error: { code: "unauthorised", message: "Bad secret" } }, { status: 401 });
  }

  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: { code: "invalid_request", message: "Invalid tags" } }, { status: 422 });
  }

  for (const tag of parsed.data.tags) revalidateTag(tag, "max");
  return NextResponse.json({ revalidated: parsed.data.tags });
}
