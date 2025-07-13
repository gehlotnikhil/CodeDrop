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
dotenv_1.default.config();
const redis_1 = require("redis");
const downloadFiles_1 = require("./downloadFiles");
const buildProject_1 = require("./buildProject");
const copyFinalDest_1 = require("./copyFinalDest");
console.log("--", process.env.PORT);
const publisher = (0, redis_1.createClient)({
    username: "default",
    password: process.env.PASSWORD, // Use the PASSWORD from .env.local
    socket: {
        host: process.env.REDIS_HOST,
        port: 12961,
    },
});
publisher.on("error", (err) => console.log("Redis Client Error", err));
const RedisConnect = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield publisher.connect();
        yield publisher.set("foo", "bar");
        const result = yield publisher.get("foo");
        console.log(result); // >>> bar
    }
    catch (error) {
        console.error("❌ Redis connection error:", error);
    }
});
RedisConnect();
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        while (1) {
            try {
                console.log("🔄 Waiting for new tasks...");
                const response = yield publisher.brPop("build-queue", 0);
                console.log(response);
                if (response === null || !response.element) {
                    console.log("❌ No response from Redis, retrying...");
                    continue;
                }
                console.log("🔄 Processing task:", response.element);
                yield (0, downloadFiles_1.downloadFolder)(`output/${response.element}`);
                console.log("✅ Downloaded files for:", response.element);
                yield (0, buildProject_1.buildProject)(response.element);
                console.log("✅ Built project for:", response.element);
                yield (0, copyFinalDest_1.copyFinalDest)(response.element);
                console.log("✅ Copied final destination for:", response.element);
                console.log("✅ Task completed:", response.element);
                publisher.hSet("status", response.element, "deployed");
            }
            catch (error) {
                console.error("❌ Error in main loop:", error);
            }
        }
    });
}
main();
