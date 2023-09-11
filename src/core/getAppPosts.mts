import { postDirFilePath } from "../config.mts"
import { Post } from "../types.mts"

import { readPostFiles } from "./readPostFiles.mts"

export const getAppPosts = async (appId: string): Promise<Post[]> => {
  const posts = await readPostFiles(postDirFilePath, appId)

  return posts
}