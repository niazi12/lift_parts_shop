import { Box, Cog, Zap, type LucideProps } from "lucide-react";

const money = new Intl.NumberFormat("en-GB", {
  style: "currency",
  currency: "GBP",
});

/** The API returns price in pounds as a float. */
export function formatPrice(price: number): string {
  return money.format(price);
}

/** Until products have photos, pick an icon from the part name. */
export function PartIcon({ name, ...props }: LucideProps & { name: string }) {
  const lower = name.toLowerCase();
  if (lower.includes("motor")) return <Cog {...props} />;
  if (lower.includes("fuse")) return <Zap {...props} />;
  return <Box {...props} />;
}

const tones = ["tone-steel", "tone-amber", "tone-mist", "tone-oxide", "tone-concrete"];

/** A stable steel/concrete stage colour per product. */
export function partTone(id: number): string {
  return tones[id % tones.length];
}
