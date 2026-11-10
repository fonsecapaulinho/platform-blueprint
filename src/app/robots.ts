import type { MetadataRoute } from "next";

// Pairs with the X-Robots-Tag header in next.config.ts. Both go when the
// product has a production environment of its own.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", disallow: "/" },
  };
}
