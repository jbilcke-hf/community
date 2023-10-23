import path from "node:path"
import { promises as fs } from "node:fs"

import { Post } from "../types.mts"
import { readPostFile } from "./readPostFile.mts"

const cache = {} as { [directory: string]: { timestamp: number, files: Post[] } };

export const readPostFiles = async (postDirFilePath: string, appId?: string, limit?: number): Promise<Post[]> => {

  const now = Date.now()
  
  if (cache[postDirFilePath] && (now - cache[postDirFilePath].timestamp) < (10 * 60 * 1000)) { 
    // return cached data if it's less than 10 minutes old
    return cache[postDirFilePath].files
  }

  let postFiles: string[] = []
  try {
    const filesInDir = await fs.readdir(postDirFilePath)
    // console.log("filesInDir:", filesInDir)

    // we only keep valid files (in UUID.json format)
    postFiles = filesInDir.filter(fileName =>
      fileName.match(/[a-z0-9\-_]\.json/i) && (appId ? fileName.includes(appId): true)
    )
  } catch (err) {
    console.log(`failed to read posts: ${err}`)
  }

  const posts: Post[] = []
  
  // TODO implement filtering at this level, using the date

  // until then let's implement a hard limit
  const postFilesToRead = postFiles.slice(0, 300)


  for (const postFileName of postFilesToRead) {

    // console.log("postFileName:", postFileName)
    const postFilePath = path.join(postDirFilePath, postFileName)
    try {
      const post = await readPostFile(postFilePath)
      posts.push(post)
    } catch (parsingErr) {
      console.log(`failed to read ${postFileName}: ${parsingErr}`)
      console.log(`deleting corrupted file ${postFileName}`)
      try {
        await fs.unlink(postFilePath)
      } catch (unlinkErr) {
        console.log(`failed to unlink ${postFileName}: ${unlinkErr}`)
      }
    }
  }

  // store results in cache with current timestamp
  cache[postDirFilePath] = { timestamp: now, files: posts }

  return posts
}
