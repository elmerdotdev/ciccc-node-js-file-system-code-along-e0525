import fs from 'fs'
import path from 'path'

const directory = "docs"
const docsDirectoryPath = path.join(__dirname, '../../', directory)

// List files
export const listFiles = async(): Promise<string[] | undefined> => {
  try {
    const files = await fs.promises.readdir(docsDirectoryPath)
    return files
  } catch (err) {
    console.error(err)
    return undefined
  }
}

// Read a file
export const readFile = async(filename: string): Promise<string | undefined> => {
  try {
    const filePath = path.join(docsDirectoryPath, filename)
    const data = await fs.promises.readFile(filePath, 'utf8')
    return data
  } catch (err) {
    console.error(err)
    return undefined
  }
}

// Add file
export const addFile = async(filename: string, content: string): Promise<boolean> => {
  try {
    const filePath = path.join(docsDirectoryPath, filename)
    await fs.promises.writeFile(filePath, content)
    return true
  } catch (err) {
    console.error(err)
    return false
  }
}

// Delete file
export const deleteFile = async(filename: string): Promise<string | undefined> => {
  try {
    const filePath = path.join(docsDirectoryPath, filename)
    await fs.promises.unlink(filePath)
    return filename
  } catch (err) {
    console.error(err)
    return undefined
  }
}