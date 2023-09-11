import path from "node:path"

import { postDirFilePath } from "../config.mts"
import { readPostFile } from "./readPostFile.mts"
import { Post } from "../types.mts"

export const getPost = async (appId: string, postId: string): Promise<Post> => {
  const postFileName = `${appId}_${postId}.json`

  const postFilePath = path.join(postDirFilePath, postFileName)

  try {
    const post = await readPostFile(postFilePath)
    return post
  } catch (err) {
    throw new Error(`couldn't find post ${postId} for app ${appId}`)
  }
}