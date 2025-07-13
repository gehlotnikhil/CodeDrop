import { exec } from "child_process";
import path from "path";
export async function buildProject(id: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const child = exec(
      `cd ${path.join(__dirname,`output/${id}`)} && npm install && npm run build`,
      (error, stdout, stderr) => {
        if (error) {
          console.error(`❌ Error building project: ${error.message}`);
          reject(error);
          return;
        }

        if (stderr) {
          console.error(`⚠️ Build stderr: ${stderr}`);
        }

        console.log(`✅ Build stdout: ${stdout}`);
      }
    );

    child?.on("close", (code) => {
      console.log(`🔧 Build process exited with code ${code}`);
      resolve();
    });
  });
}
