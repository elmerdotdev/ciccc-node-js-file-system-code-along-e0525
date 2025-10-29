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
exports.deleteFile = exports.addFile = exports.readFile = exports.listFiles = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const directory = "docs";
const docsDirectoryPath = path_1.default.join(__dirname, '../../', directory);
// List files
const listFiles = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const files = yield fs_1.default.promises.readdir(docsDirectoryPath);
        return files;
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
});
exports.listFiles = listFiles;
// Read a file
const readFile = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(docsDirectoryPath, filename);
        const data = yield fs_1.default.promises.readFile(filePath, 'utf8');
        return data;
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
});
exports.readFile = readFile;
// Add file
const addFile = (filename, content) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(docsDirectoryPath, filename);
        yield fs_1.default.promises.writeFile(filePath, content);
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
});
exports.addFile = addFile;
// Delete file
const deleteFile = (filename) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const filePath = path_1.default.join(docsDirectoryPath, filename);
        yield fs_1.default.promises.unlink(filePath);
        return filename;
    }
    catch (err) {
        console.error(err);
        return undefined;
    }
});
exports.deleteFile = deleteFile;
