import dotenv from "dotenv";
dotenv.config(); // loads .env first
dotenv.config({ path: ".env.local" });
import { createClient } from "redis"; 
import { downloadFolder } from "./downloadFiles";
import { buildProject } from "./buildProject";
import { copyFinalDest } from "./copyFinalDest";

const publisher = createClient({ 
  username: "default", 
  password: process.env.REDIS_PASSWORD, // Use the PASSWORD from .env.local
  socket: {
    host: process.env.REDIS_HOST , 
    port: 12961,
  },
});

publisher.on("error", (err: any) => console.log("Redis Client Error", err));

const RedisConnect = async () => {
  try {
    await publisher.connect();

    await publisher.set("foo", "bar");
    const result = await publisher.get("foo");
    console.log(result); // >>> bar
  } catch (error) {
    console.error("❌ Redis connection error:", error);
  }
};

RedisConnect();

async function main() {
  while (1) {
    try {
      console.log("🔄 Waiting for new tasks...");
      const response = await publisher.brPop("build-queue", 0);

      console.log(response);
        if(response === null || !response.element) {
          console.log("❌ No response from Redis, retrying...");
            continue;   
        }
      
      console.log("🔄 Processing task:", response.element);
      await downloadFolder(`output/${response.element}`);
      console.log("✅ Downloaded files for:", response.element);
    await buildProject(response.element);
      console.log("✅ Built project for:", response.element);
    await copyFinalDest(response.element)
      console.log("✅ Copied final destination for:", response.element);
      console.log("✅ Task completed:", response.element);
      
publisher.hSet("status",response.element,"deployed")
    } catch (error) {
      console.error("❌ Error in main loop:", error);
    }
  }
}

main();
