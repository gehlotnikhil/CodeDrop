
import { createClient } from "redis";
const client = createClient({
    username: 'default',
    password: 'ysn0cCdVJ9q3NTlIqO4YlqAqnDMZkhXu',
    socket: {
        host: 'redis-12961.c232.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 12961,
    }
});

client.on('error', err => console.log('Redis Client Error', err));


 const RedisConnect = async () => {
  try {

await client.connect();

await client.set('foo', 'bar');
const result = await client.get('foo');
console.log(result)  // >>> bar

  } catch (error) {
    console.error("❌ Redis connection error:", error);
  }
};


RedisConnect();

    client.lPush("build-queue","123");


