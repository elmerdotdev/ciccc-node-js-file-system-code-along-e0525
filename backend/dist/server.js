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
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const functions_1 = require("./lib/functions");
const server = http_1.default.createServer((req, res) => {
    // Set Headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'Content-type');
    // Pre-flight Check
    if (req.method === "OPTIONS") {
        res.writeHead(200);
        res.end();
        return;
    }
    const myUrl = new URL(req.url || '', `http://${req.headers.host}`);
    const parsedPath = myUrl.pathname;
    const fileName = myUrl.searchParams.get('filename');
    // Home
    if (parsedPath === "/" && req.method === "GET") {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("Welcome to my server");
        return;
    }
    // List files
    if (parsedPath === "/list" && req.method === "GET") {
        (0, functions_1.listFiles)().then(files => {
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(files));
        }).catch(err => {
            console.error(err);
            res.writeHead(404, { "content-type": "text/plain" });
            res.end("Files not found");
        });
        return;
    }
    // Read a file (http://localhost:3500/read?filename=txt1.txt)
    if (parsedPath === "/read" && fileName && req.method === "GET") {
        (0, functions_1.readFile)(fileName).then(data => {
            if (!data) {
                res.writeHead(404, { "content-type": "text/plain" });
                res.end("Invalid file");
                return;
            }
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify(data));
        }).catch(err => {
            console.error(err);
            res.writeHead(500, { "content-type": "text/plain" });
            res.end("Cannot read file.");
        });
        return;
    }
    // Add a file
    if (parsedPath === "/add" && req.method === "POST") {
        let body = '';
        req.on("data", chunk => body += chunk);
        req.on("end", () => __awaiter(void 0, void 0, void 0, function* () {
            const { filename, fileContent } = JSON.parse(body);
            const success = yield (0, functions_1.addFile)(filename, fileContent);
            if (!success) {
                res.writeHead(500, { "content-type": "application/json" });
                res.end(JSON.stringify({ message: "Unable to add file." }));
                return;
            }
            res.writeHead(201, { "content-type": "application/json" });
            res.end(JSON.stringify({ message: "File added successfully" }));
        }));
        return;
    }
    // Delete a file
    if (parsedPath === "/delete" && fileName && req.method === "DELETE") {
        (0, functions_1.deleteFile)(fileName).then(file => {
            res.writeHead(200, { "content-type": "application/json" });
            res.end(JSON.stringify({ file }));
        }).catch(err => {
            console.error(err);
            res.writeHead(500, { "content-type": "text/plain" });
            res.end("Unable to delete file");
        });
        return;
    }
    // Fallback
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("Invalid route");
    return;
});
const PORT = process.env.PORT;
if (!PORT) {
    throw new Error("Missing port!");
}
server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
