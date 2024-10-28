import { handle } from "hono/vercel";

import app from "../dist/index.js";

export const runtime = "edge";

export const GET = handle(app);
export const POST = handle(app);
