import { postDirFilePath } from "../config.mts"
import { Post, PostVisibility } from "../types.mts"
import { getValidNumber } from "../utils/getValidNumber.mts"
import { shuffleArray } from "../utils/shuffleArray.mts"

import { readPostFiles } from "./readPostFiles.mts"

export const getAppPosts = async ({
  appId,
  limit,
  visibility,
  shuffle
}: {
  appId: string
  limit?: number
  visibility?: PostVisibility
  shuffle?: boolean
}): Promise<Post[]> => {
  const posts = await readPostFiles(postDirFilePath, appId)

  const visiblePosts = visibility
    ? posts.filter(post => post.visibility === visibility)
    : posts

  const sortedPosts = shuffle
    ? shuffleArray(visiblePosts)
    : visiblePosts.sort((a, b) => Date.parse(b.createdAt) - Date.parse(a.createdAt))
  
  return sortedPosts.slice(0, getValidNumber(limit, 1, 80, 20))
}