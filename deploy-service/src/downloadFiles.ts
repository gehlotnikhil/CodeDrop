import { supabase } from "./superbase";
import * as fs from "fs";
import * as path from "path";

const BUCKET_NAME = "selfhosting1";

const LOCAL_BASE_PATH = __dirname;
const shouldIgnore = (remotePath: string): boolean => {
  return (
    remotePath.includes("/.git/") ||
    remotePath.includes("\\.git\\") ||
    remotePath.includes("/node_modules/") ||
    remotePath.includes("\\node_modules\\")
  );
};

export async function downloadFolder(prefix: string) {
  
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(prefix, {
        sortBy: { column: "name", order: "asc" },
      });

    if (error) {
      console.error("❌ Error listing folder:", prefix, error);
      return;
    }

    if (!data || data.length === 0) {
      console.log("✅ No more items in folder:", prefix);
      return;
    }
    console.log("-------------",data)

    for (const item of data) {
      const remotePath = `${prefix}/${item.name}`;
      const localPath = path.join(LOCAL_BASE_PATH, remotePath);
      if (shouldIgnore(remotePath)) {
        console.log("⏭️ Skipping ignored path:", remotePath);
        continue;
      }
      if (item.id === null) {
        // It's a directory
        if (!fs.existsSync(localPath)) {
          console.log("📁 Creating folder:", localPath);
          fs.mkdirSync(localPath, { recursive: true });
        }

        // Recurse into subdirectory
        await downloadFolder(remotePath);
      } else {
        // It's a file
        console.log("⬇️ Downloading file:", remotePath);
        await downloadAndSaveFile(remotePath, localPath);
      }
    }
    console.log("✅ Finished downloading folder:", prefix);
    
    return;
  
}

async function downloadAndSaveFile(remotePath: string, localPath: string) {
  try {
    const { data: fileBlob, error: downloadError } = await supabase.storage
      .from(BUCKET_NAME)
      .download(remotePath);

    if (downloadError) {
      console.error("❌ Failed to download:", remotePath, downloadError);
      return;
    }

    const buffer = Buffer.from(await fileBlob!.arrayBuffer());

    // Ensure directory exists
    const localDir = path.dirname(localPath);
    if (!fs.existsSync(localDir)) {
      fs.mkdirSync(localDir, { recursive: true });
    }

    fs.writeFileSync(localPath, buffer);
    console.log("✅ Saved:", localPath);
  } catch (err) {
    console.error("❌ Unexpected error saving:", remotePath, err);
  }
}
