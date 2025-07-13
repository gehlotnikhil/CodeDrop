"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllfile = void 0;
const fs = require('fs');
const path = require('path');
const getAllfile = (folderPath) => {
    let response = [];
    const allFilesAndFolder = fs.readdirSync(folderPath);
    allFilesAndFolder.forEach((fileOrFolder) => {
        const fullPath = path.join(folderPath, fileOrFolder);
        if (fs.statSync(fullPath).isDirectory()) {
            response = response.concat((0, exports.getAllfile)(fullPath));
        }
        else {
            response.push(fullPath);
        }
    });
    return response;
};
exports.getAllfile = getAllfile;
