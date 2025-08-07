import dotenv from "dotenv";
dotenv.config({ path: ".env" }); // Will override .env if present
import express from "express";
import cors from "cors";
import path from "path";
import simpleGit from "simple-git";
import { generateId } from "./utils";
import { getAllfile } from "./file";
import { uploadFromFilePath } from "./upload";
import { createClient } from "redis";

// ✅ Load env (only once — and make sure it's at the top)

const app = express();

// ✅ Use correct frontend URL from env or fallback
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

app.use(cors({
  origin: FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());

console.log("Frontend URL allowed via CORS:", FRONTEND_URL);

const subscriber = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 12961,
  },
});

const publisher = createClient({
  username: "default",
  password: process.env.REDIS_PASSWORD,
  socket: {
    host: process.env.REDIS_HOST,
    port: 12961,
  },
});

subscriber.on("error", err => console.error("Redis Subscriber Error:", err));
publisher.on("error", err => console.error("Redis Publisher Error:", err));

const RedisConnect = async () => {
  try {
    await publisher.connect();
    await subscriber.connect();

    await publisher.set("foo", "bar");
    const result = await publisher.get("foo");
    console.log("Redis test:", result); // bar
  } catch (error) {
    console.error("❌ Redis connection error:", error);
  }
};

RedisConnect();

// ✅ Remove duplicate route definition
app.get("/", (req, res) => {
  res.send("Hello");
});

app.post("/deploy", async (req, res) => {
  const repoUrl = req.body.repoUrl;
  console.log("Repo URL:", repoUrl);

  const id = generateId();
  const clonePath = path.join(__dirname, `output/${id}`);

  await simpleGit().clone(repoUrl, clonePath);

  const files = getAllfile(clonePath);
  const filteredFiles = files.filter(file =>
    !file.includes("/.git/") &&
    !file.includes("\\.git\\") &&
    !file.includes("/node_modules/") &&
    !file.includes("\\node_modules\\")
  );

  for (const file of filteredFiles) {
    const s3Path = file.substring(__dirname.length + 1);
    await uploadFromFilePath(file, s3Path);
  }

  await publisher.lPush("build-queue", id);
  await publisher.hSet("status", id, "uploaded");

  res.json({ id });
});

app.get("/status", async (req, res) => {
  const id = req.query.id as string;
  console.log("Status check for ID:", id);

  const response = await subscriber.hGet("status", id);
  res.json({ status: response });
});

app.listen(3000, () => {
  console.log("🚀 Server is running on http://localhost:3000");
});
