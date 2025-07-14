import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { lookup } from "mime-types";
import { supabase } from "./superbase";

dotenv.config();
dotenv.config({ path: ".env.local" });

const app = express();
app.use(cors());

// app.get("/", (req, res) => {
//   res.send("Hello from wildcard handler!");
// });

app.get("/{*any}", async (req, res) => {
  const host = req.hostname;
  const subdomain = host.split(".")[0];
  const filePath = req.path === "/" ? "index.html" : req.path.slice(1);

  const { data, error } = await supabase
    .storage
    .from("selfhosting1")
    .download(`dist/${subdomain}/${filePath}`);

  if (error || !data) {
    const fallback = await supabase
      .storage
      .from("selfhosting1")
      .download(`dist/${subdomain}/index.html`);

    if (fallback.data) {
      const buffer = Buffer.from(await fallback.data.arrayBuffer());
      res.set("Content-Type", "text/html");
      return res.send(buffer);
    }

    return res.status(404).send("File not found");
  }

  const buffer = Buffer.from(await data.arrayBuffer());
const contentType = lookup(filePath) || "application/octet-stream";  res.set("Content-Type", contentType);
  return res.send(buffer);
});
// app.listen(3001)

export default app;
