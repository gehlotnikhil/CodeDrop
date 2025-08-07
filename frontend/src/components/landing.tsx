import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, UploadCloud, CheckCircle } from "lucide-react";
import { useState } from "react";
import axios from "../util/axios";
import { motion } from "framer-motion";

const BACKEND_UPLOAD_URL =  import.meta.env.VITE_BACKEND_UPLOAD_URL || "http://localhost:3000";
const REQUEST_HANDLER_BACKEND_DOMAIN =  import.meta.env.VITE_REQUEST_HANDLER_BACKEND_DOMAIN || "http://localhost:3001";


export function Landing() {
  const [repoUrl, setRepoUrl] = useState("");
  const [uploadId, setUploadId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [deployed, setDeployed] = useState(false);

  const handleUpload = async () => {
    if (!repoUrl) return;

    setUploading(true);
    const res = await axios.post(`/deploy`, {
      repoUrl,
    });
    setUploadId(res.data.id);
    setUploading(false);

    const interval = setInterval(async () => {
      const response = await axios.get(
        `/status?id=${res.data.id}`
      );
      if (response.data.status === "deployed") {
        clearInterval(interval);
        setDeployed(true);
      }
    }, 3000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-sky-50 to-white dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 p-6">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.1, duration: 0.5 }}
        className="w-full max-w-md"
      >
        <Card className="shadow-xl border border-gray-200 dark:border-gray-800">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center flex items-center gap-2">
              <UploadCloud className="w-5 h-5" />
              Deploy Your GitHub Repository
            </CardTitle>
            <CardDescription className="text-center text-gray-600 dark:text-gray-400">
              Paste your GitHub repo URL to deploy it to{" "}
              <code className="bg-muted px-1 py-0.5 rounded text-xs">
                *.{REQUEST_HANDLER_BACKEND_DOMAIN}
              </code>
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="github-url">GitHub Repository URL</Label>
              <Input
                id="github-url"
                placeholder="https://github.com/username/repo"
                onChange={(e) => setRepoUrl(e.target.value)}
              />
            </div>

            <Button
              disabled={uploading || !!uploadId}
              onClick={handleUpload}
              className="w-full"
            >
              {uploadId
                ? `Deploying (${uploadId})`
                : uploading
                ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Uploading...
                    </>
                  )
                : "Deploy"}
            </Button>
          </CardContent>
        </Card>

        {deployed && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-6"
          >
            <Card className="shadow-lg border border-green-300 dark:border-green-800 bg-green-50 dark:bg-green-950">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-700 dark:text-green-400">
                  <CheckCircle className="w-5 h-5" />
                  Deployed Successfully
                </CardTitle>
                <CardDescription>
                  Your project is now live.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="deployed-url">Deployed URL</Label>
                  <Input
                    id="deployed-url"
                    type="url"
                    readOnly
                    value={`https://${uploadId}.${REQUEST_HANDLER_BACKEND_DOMAIN}`}
                  />
                </div>
                <Button variant="outline" className="w-full">
                  <a
                    href={`https://${uploadId}.${REQUEST_HANDLER_BACKEND_DOMAIN}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visit Website
                  </a>
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </motion.div>
    </main>
  );
}
