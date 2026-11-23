import { newsletterHandler } from "../_shared/newsletterHandler.ts";
Deno.serve(req => newsletterHandler(req));
