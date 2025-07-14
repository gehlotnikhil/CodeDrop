import dotenv from "dotenv";
dotenv.config();
dotenv.config({ path: ".env.local" });

import express from "express";
import { supabase } from "./superbase";
import mime from "mime";
import cors from "cors";

const app = express();
app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello");
});

app.get("*", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0]; 
  const filePath = req.path === "/" ? "index.html" : req.path.slice(1); 

  const { data, error } = await supabase
    .storage
    .from("selfhosting1")
    .download(`dist/${id}/${filePath}`);

  if (error || !data) {
    const fallback = await supabase.storage
      .from("selfhosting1")
      .download(`dist/${id}/index.html`);

    if (fallback.data) {
      const buffer = Buffer.from(await fallback.data.arrayBuffer());
      res.set("Content-Type", "text/html");
      return res.send(buffer);
    }

    return res.status(404).send("File not found");
  }

  const buffer = Buffer.from(await data.arrayBuffer());
  const contentType = mime.getType(filePath) || "application/octet-stream";
  res.set("Content-Type", contentType);
  res.send(buffer);
});

app.listen(3001, () => {
  console.log("🚀 Supabase file server running on port 3001");
});
