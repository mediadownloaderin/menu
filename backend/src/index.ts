import { Hono } from "hono";
import { cors } from "hono/cors";

import allRoutes from "./routes/index";

const app = new Hono();

app.get("/", (c) => c.text("Hello Hono!"));

app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowHeaders: ["Content-Type", "Authorization"],
  })
);

// mount all API groups under /api
app.route("/api", allRoutes);

export default app;
