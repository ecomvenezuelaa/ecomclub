import dotenv from "dotenv";

dotenv.config();
dotenv.config({ path: ".env.local", override: true });

import "express-async-errors";
import express from "express";
import authRouter from "./routes/auth.js";
import postsRouter from "./routes/posts.js";
import coursesRouter from "./routes/courses.js";
import tagsRouter from "./routes/tags.js";

const app = express();

app.use(express.json({ limit: "20mb" }));

app.use("/api/auth", authRouter);
app.use("/api/posts", postsRouter);
app.use("/api/courses", coursesRouter);
app.use("/api/tags", tagsRouter);

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error(err);
  res.status(500).json({ error: err.message ?? "Internal server error" });
});

export default app;