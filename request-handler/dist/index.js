"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mime_types_1 = require("mime-types");
const superbase_1 = require("./superbase");
dotenv_1.default.config();
dotenv_1.default.config({ path: ".env.local" });
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
// app.get("/", (req, res) => {
//   res.send("Hello from wildcard handler!");
// });
app.get("/{*any}", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const host = req.hostname;
    const subdomain = host.split(".")[0];
    const filePath = req.path === "/" ? "index.html" : req.path.slice(1);
    const { data, error } = yield superbase_1.supabase
        .storage
        .from("selfhosting1")
        .download(`dist/${subdomain}/${filePath}`);
    if (error || !data) {
        const fallback = yield superbase_1.supabase
            .storage
            .from("selfhosting1")
            .download(`dist/${subdomain}/index.html`);
        if (fallback.data) {
            const buffer = Buffer.from(yield fallback.data.arrayBuffer());
            res.set("Content-Type", "text/html");
            return res.send(buffer);
        }
        return res.status(404).send("File not found");
    }
    const buffer = Buffer.from(yield data.arrayBuffer());
    const contentType = (0, mime_types_1.lookup)(filePath) || "application/octet-stream";
    res.set("Content-Type", contentType);
    return res.send(buffer);
}));
// app.listen(3001)
exports.default = app;
