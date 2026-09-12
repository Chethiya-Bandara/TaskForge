import express from "express";
import authRoutes from "./routes/auth_routes";
import projectRoutes from "./routes/project_routes";
import projectMemberRoutes from "./routes/project_member_routes";
import taskRoutes from "./routes/task_routes";

const app = express();

app.use(express.json());

// The Vite app is served from a different localhost port during development.
// Keep this deliberately small rather than relying on deployment-specific CORS
// configuration, while still allowing the browser client to call this API.
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
  if (req.method === "OPTIONS") return res.sendStatus(204);
  next();
});

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);
app.use("/projects", projectMemberRoutes);
app.use("/", taskRoutes);

export default app;
