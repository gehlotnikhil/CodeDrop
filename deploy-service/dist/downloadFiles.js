"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadFolder = downloadFolder;
const superbase_1 = require("./superbase");
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const BUCKET_NAME = "selfhosting1";
const LOCAL_BASE_PATH = __dirname;
const shouldIgnore = (remotePath) => {
    return (remotePath.includes("/.git/") ||
        remotePath.includes("\\.git\\") ||
        remotePath.includes("/node_modules/") ||
        remotePath.includes("\\node_modules\\"));
};
function downloadFolder(prefix) {
    return __awaiter(this, void 0, void 0, function* () {
        const { data, error } = yield superbase_1.supabase.storage
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
        console.log("-------------", data);
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
                yield downloadFolder(remotePath);
            }
            else {
                // It's a file
                console.log("⬇️ Downloading file:", remotePath);
                yield downloadAndSaveFile(remotePath, localPath);
            }
        }
        console.log("✅ Finished downloading folder:", prefix);
        return;
    });
}
function downloadAndSaveFile(remotePath, localPath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { data: fileBlob, error: downloadError } = yield superbase_1.supabase.storage
                .from(BUCKET_NAME)
                .download(remotePath);
            if (downloadError) {
                console.error("❌ Failed to download:", remotePath, downloadError);
                return;
            }
            const buffer = Buffer.from(yield fileBlob.arrayBuffer());
            // Ensure directory exists
            const localDir = path.dirname(localPath);
            if (!fs.existsSync(localDir)) {
                fs.mkdirSync(localDir, { recursive: true });
            }
            fs.writeFileSync(localPath, buffer);
            console.log("✅ Saved:", localPath);
        }
        catch (err) {
            console.error("❌ Unexpected error saving:", remotePath, err);
        }
    });
}
