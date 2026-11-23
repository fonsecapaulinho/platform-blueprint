import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// Defaults are deliberate: no R2 incremental cache and no self-reference
// service binding yet. The app has no ISR or on-demand revalidation, so
// neither earns the extra Cloudflare resources to provision. Revisit when
// real data and caching arrive in stage 2.
export default defineCloudflareConfig();
