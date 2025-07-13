import dotenv from "dotenv";
dotenv.config(); // loads .env first
dotenv.config({ path: ".env.local" });
import express from "express"
const app = express()
import { generateId } from "./utils"
import simpleGit from "simple-git"
import path from "path";
import { getAllfile } from "./file";
import { uploadFromFilePath } from "./upload";

import { createClient } from "redis";
import cors from "cors";
app.use(cors())
const subscriber = createClient({ 
  username: "default", 
  password: process.env.REDIS_PASSWORD, // Use the PASSWORD from .env.local
  socket: {
    host: process.env.REDIS_HOST , 
    port: 12961,
  },
});

const publisher = createClient({ 
  username: "default", 
  password: process.env.REDIS_PASSWORD, 
  socket: {
    host: process.env.REDIS_HOST , 
    port: 12961,
  },
});

subscriber.on('error', err => console.log('Redis Client Error', err));
publisher.on('error', err => console.log('Redis Client Error', err));


 const RedisConnect = async () => {
  try {

await publisher.connect();
await subscriber.connect();

await publisher.set('foo', 'bar');
const result = await publisher.get('foo');
console.log(result)  // >>> bar

  } catch (error) {
    console.error("❌ Redis connection error:", error);
  }
};


RedisConnect();
app.use(express.json())
console.log(__dirname)
app.get("/",(req,res)=>{ 
    res.send("Hello")
})
app.post("/deploy",async (req,res)=>{
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl)
    const id = generateId()
     await simpleGit().clone(repoUrl,path.join(__dirname,`output/${id}`))
     const files = getAllfile(path.join(__dirname,`output/${id}`))
    console.log(files)
      const filteredFiles = files.filter(
    (file) =>
      !file.includes("/.git/") &&
      !file.includes("\\.git\\") &&
      !file.includes("/node_modules/") &&
      !file.includes("\\node_modules\\")
  );
    // put in the  bucket 
    for(const file of filteredFiles){
        await uploadFromFilePath(file,`${file.substring(__dirname.length+1)}`)
    }
    publisher.lPush("build-queue",id);
    publisher.hSet("status",id,"uploaded")


    res.json({"id":id})
})

app.get("/",(req,res)=>{res.send("Hello")})


app.get("/status",async(req,res)=>{
    const id = req.query.id;
    console.log(id)
    const response = await subscriber.hGet("status",id as string)
    console.log(response)
    res.json({status:response})
})


app.listen(3000,()=>{
    console.log("Server is running on port 3000")
})
