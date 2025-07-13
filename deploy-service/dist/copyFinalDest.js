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
exports.copyFinalDest = copyFinalDest;
const getAllFile_1 = require("./getAllFile");
const uploadAllFile_1 = require("./uploadAllFile");
const path_1 = __importDefault(require("path"));
function copyFinalDest(id) {
    return __awaiter(this, void 0, void 0, function* () {
        const folderPath = path_1.default.join(__dirname, `output/${id}/dist`);
        const files = yield (0, getAllFile_1.getAllfile)(folderPath);
        console.log(files);
        files.map((file) => __awaiter(this, void 0, void 0, function* () {
            yield (0, uploadAllFile_1.uploadFromFilePath)(file, path_1.default.join(`dist/${id}`, file.slice(file.lastIndexOf("dist") + 5)));
        }));
    });
}
