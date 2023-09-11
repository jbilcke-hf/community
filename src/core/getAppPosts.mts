import { postDirFilePath } from "../config.mts"
import { Post, PostVisibility } from "../types.mts"

import { readPostFiles } from "./readPostFiles.mts"

export const getAppPosts = async (appId: string, visibility?: PostVisibility): Promise<Post[]> => {
  const posts = await readPostFiles(postDirFilePath, appId)

  if (visibility) {
    return posts.filter(post => post.visibility === visibility)
  } else {
    return posts
  }
}