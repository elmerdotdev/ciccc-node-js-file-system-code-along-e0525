import http from 'http'
import dotenv from 'dotenv'
dotenv.config()

import { addFile, deleteFile, listFiles, readFile } from './lib/functions'

const server = http.createServer((
  req: http.IncomingMessage,
  res: http.ServerResponse
) => {
  // Set Headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-type')

  // Pre-flight Check
  if (req.method === "OPTIONS") {
    res.writeHead(200)
    res.end()
    return
  }

  const myUrl = new URL(req.url || '', `http://${req.headers.host}`)
  const parsedPath = myUrl.pathname
  const fileName = myUrl.searchParams.get('filename')

  // Home
  if (parsedPath === "/" && req.method === "GET") {
    res.writeHead(200, { "content-type": "text/plain" })
    res.end("Welcome to my server")
    return
  }

  // List files
  if (parsedPath === "/list" && req.method === "GET") {
    listFiles().then(files => {
      res.writeHead(200, { "content-type": "application/json" })
      res.end(JSON.stringify(files))
    }).catch(err => {
      console.error(err)
      res.writeHead(404, { "content-type": "text/plain" })
      res.end("Files not found")
    })
    return
  }

  // Read a file (http://localhost:3500/read?filename=txt1.txt)
  if (parsedPath === "/read" && fileName && req.method === "GET") {
    readFile(fileName).then(data => {
      if (!data) {
        res.writeHead(404, { "content-type": "text/plain" })
        res.end("Invalid file")
        return
      }
      res.writeHead(200, { "content-type": "application/json" })
      res.end(JSON.stringify(data))
    }).catch(err => {
      console.error(err)
      res.writeHead(500, { "content-type": "text/plain" })
      res.end("Cannot read file.")
    })
    return
  }

  // Add a file
  if (parsedPath === "/add" && req.method === "POST") {
    let body = ''
    req.on("data", chunk => body += chunk)
    req.on("end", async() => {
      const { filename, fileContent } = JSON.parse(body)
      const success = await addFile(filename, fileContent)
      if (!success) {
        res.writeHead(500, { "content-type": "application/json" })
        res.end(JSON.stringify({ message: "Unable to add file." }))
        return
      }
      res.writeHead(201, { "content-type": "application/json" })
      res.end(JSON.stringify({ message: "File added successfully" }))
    })
    return
  }

  // Delete a file
  if (parsedPath === "/delete" && fileName && req.method === "DELETE") {
    deleteFile(fileName).then(file => {
      res.writeHead(200, { "content-type": "application/json" })
      res.end(JSON.stringify({file}))
    }).catch(err => {
      console.error(err)
      res.writeHead(500, { "content-type": "text/plain" })
      res.end("Unable to delete file")
    })
    return
  }

  // Fallback
  res.writeHead(404, { "content-type": "text/plain" })
  res.end("Invalid route")
  return
})

const PORT = process.env.PORT
if (!PORT) {
  throw new Error("Missing port!")
}

server.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`)
})