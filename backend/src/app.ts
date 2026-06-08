import express from "express";
import authRoutes from "./routes/auth_routes";
import projectRoutes from "./routes/project_routes";

const app = express();

app.use(express.json());

app.use("/auth", authRoutes);
app.use("/projects", projectRoutes);

export default app;