# 🚀 CodeDrop - Auto Deploy & Host System

A backend system that lets users submit a GitHub repo and instantly deploy it to a wildcard subdomain like `abc.dev.100xstack.me`.

🔁 It clones the repo  
📦 Uploads files to Supabase Storage  
🧵 Queues a build job in Redis  
🌐 And serves it via wildcard routing using Cloudflare DNS

---

## 📦 Features

- 🔗 Accept GitHub repo URLs from users
- 📁 Recursively upload files to Supabase bucket
- 🚫 Skips `.git`, `node_modules`, etc.
- 🧵 Pushes unique deploy ID to Redis queue
- 🌍 Dynamically serves content at `*.dev.100xstack.me`
- 🔒 Wildcard SSL + security via Cloudflare
- 🔁 File downloading supported for local or Vercel-based render

---

## 🛠 Tech Stack

| Tool         | Purpose                        |
|--------------|--------------------------------|
| **Node.js + Express** | Main backend server          |
| **Supabase** | File hosting (via Storage buckets) |
| **Redis**    | Task queue (build/deploy events)  |
| **simple-git** | Git repo cloning              |
| **Cloudflare** | DNS + Security Layer (optional WAF) |
| **Vercel**   | Wildcard domain handling + HTTPS |

---


## ⚙️ Environment Variables

Create a `.env` or `.env.local`:

```env
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_KEY=your-supabase-service-key

REDIS_HOST=your-redis-host
REDIS_PASSWORD=your-redis-password

