import path from "node:path"
import { promises as fs } from "node:fs"

import { Post } from "../types.mts"
import { readPostFile } from "./readPostFile.mts"

export const readPostFiles = async (postDirFilePath: string, appId?: string): Promise<Post[]> => {

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

  for (const  postFileName of postFiles) {
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

  return posts
}
