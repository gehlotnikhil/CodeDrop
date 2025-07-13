import dotenv from "dotenv";
dotenv.config(); // loads .env first
dotenv.config({ path: ".env.local" });
import express from "express";
import { supabase } from "./superbase"; // your initialized Supabase client
import mime from "mime"; // npm install mime

const app = express();
import cors from "cors";
app.use(cors())
app.get("/",(req,res)=>{res.send("Hello")})
app.get("/{*any}", async (req, res) => {
  const host = req.hostname;
  const id = host.split(".")[0]; // like jjw2g
  const filePath = req.path === "/" ? "index.html" : req.path.slice(1); // remove leading slash

  const { data, error } = await supabase
    .storage
    .from("selfhosting1") // bucket name
    .download(`dist/${id}/${filePath}`);

  if (error || !data) {
    console.error("❌ Error:", error?.message);
    return res.status(404).send("File not found");
  }

  const contentType = mime.getType(filePath) || "application/octet-stream";
  res.set("Content-Type", contentType);

  const buffer = await data.arrayBuffer();
  res.send(Buffer.from(buffer));
});




app.listen(3001, () => {
  console.log("🚀 Supabase file server running on port 3001");
});
