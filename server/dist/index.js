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
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config(); // loads .env first
dotenv_1.default.config({ path: ".env.local" });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const utils_1 = require("./utils");
const simple_git_1 = __importDefault(require("simple-git"));
const path_1 = __importDefault(require("path"));
const file_1 = require("./file");
const upload_1 = require("./upload");
const redis_1 = require("redis");
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
const subscriber = (0, redis_1.createClient)({
    username: "default",
    password: process.env.REDIS_PASSWORD, // Use the PASSWORD from .env.local
    socket: {
        host: process.env.REDIS_HOST,
        port: 12961,
    },
});
const publisher = (0, redis_1.createClient)({
    username: "default",
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: 12961,
    },
});
subscriber.on('error', err => console.log('Redis Client Error', err));
publisher.on('error', err => console.log('Redis Client Error', err));
const RedisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield publisher.connect();
        yield subscriber.connect();
        yield publisher.set('foo', 'bar');
        const result = yield publisher.get('foo');
        console.log(result); // >>> bar
    }
    catch (error) {
        console.error("❌ Redis connection error:", error);
    }
});
RedisConnect();
app.use(express_1.default.json());
console.log(__dirname);
app.get("/", (req, res) => {
    res.send("Hello");
});
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const repoUrl = req.body.repoUrl;
    console.log(repoUrl);
    const id = (0, utils_1.generateId)();
    yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
    const files = (0, file_1.getAllfile)(path_1.default.join(__dirname, `output/${id}`));
    console.log(files);
    const filteredFiles = files.filter((file) => !file.includes("/.git/") &&
        !file.includes("\\.git\\") &&
        !file.includes("/node_modules/") &&
        !file.includes("\\node_modules\\"));
    // put in the  bucket 
    for (const file of filteredFiles) {
        yield (0, upload_1.uploadFromFilePath)(file, `${file.substring(__dirname.length + 1)}`);
    }
    publisher.lPush("build-queue", id);
    publisher.hSet("status", id, "uploaded");
    res.json({ "id": id });
}));
app.get("/", (req, res) => { res.send("Hello"); });
app.get("/status", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    console.log(id);
    const response = yield subscriber.hGet("status", id);
    console.log(response);
    res.json({ status: response });
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
