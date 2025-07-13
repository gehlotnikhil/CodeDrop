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
exports.buildProject = buildProject;
const child_process_1 = require("child_process");
const path_1 = __importDefault(require("path"));
function buildProject(id) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            const child = (0, child_process_1.exec)(`cd ${path_1.default.join(__dirname, `output/${id}`)} && npm install && npm run build`, (error, stdout, stderr) => {
                if (error) {
                    console.error(`❌ Error building project: ${error.message}`);
                    reject(error);
                    return;
                }
                if (stderr) {
                    console.error(`⚠️ Build stderr: ${stderr}`);
                }
                console.log(`✅ Build stdout: ${stdout}`);
            });
            child === null || child === void 0 ? void 0 : child.on("close", (code) => {
                console.log(`🔧 Build process exited with code ${code}`);
                resolve();
            });
        });
    });
}
