"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = __importDefault(require("http")); // Import http module
const fs_1 = __importDefault(require("fs")); // Import filesystem module
const path_1 = __importDefault(require("path")); // Import path module
const dotenv_1 = __importDefault(require("dotenv")); // Import dotenv package
dotenv_1.default.config(); // Read the .env file
const FILE_PATH = path_1.default.join(__dirname, '../docs', 'sample.txt');
const server = http_1.default.createServer((req, res) => {
    fs_1.default.appendFile('./log.txt', `[${new Date()}] ${req.url} ${req.method}\r\n`, (err) => {
        if (err) {
            console.error(err);
            return;
        }
        console.log("Updated log...");
    });
    // Home
    if (req.url === "/" && req.method === "GET") {
        res.writeHead(200, { "content-type": "text/plain" });
        res.end("Welcome to my server");
        return;
    }
    // Read file
    if (req.url === "/read" && req.method === "GET") {
        fs_1.default.readFile(FILE_PATH, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { "content-type": "text/plain" });
                res.end(`Error reading file. Please contact system admin.`);
                console.error(err);
                return;
            }
            res.writeHead(200, { "content-type": "text/plain" });
            res.end(data || "File is empty");
        });
        return;
    }
    // Add or overwrite
    if (req.url === "/add" && req.method === "POST") {
        let body = ""; // final data container
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            fs_1.default.writeFile(FILE_PATH, body, (err) => {
                if (err) {
                    res.writeHead(500, { "content-type": "text/plain" });
                    res.end(`Unable to write file.`);
                    console.error(err);
                    return;
                }
                res.writeHead(201, { "content-type": "text/plain" });
                res.end("Successfully wrote file");
            });
        });
        return;
    }
    // Update (append)
    if (req.url === "/update" && req.method === "PATCH") {
        let body = "";
        req.on("data", chunk => body += chunk);
        req.on("end", () => {
            fs_1.default.appendFile(FILE_PATH, "\r\n" + body, (err) => {
                if (err) {
                    res.writeHead(500, { "content-type": "text/plain" });
                    res.end(`Unable to update file.`);
                    console.error(err);
                    return;
                }
                res.writeHead(201, { "content-type": "text/plain" });
                res.end("Successfully updated file");
            });
        });
        return;
    }
    // Delete
    if (req.url === "/delete" && req.method === "DELETE") {
        fs_1.default.unlink(FILE_PATH, (err) => {
            if (err) {
                res.writeHead(500, { "content-type": "text/plain" });
                res.end(`Unable to delete file.`);
                console.error(err);
                return;
            }
            res.writeHead(200, { "content-type": "text/plain" });
            res.end("Successfully deleted file");
        });
        return;
    }
    // Fallback
    res.writeHead(404, { "Content-type": "text/plain" });
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
