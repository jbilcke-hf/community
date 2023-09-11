import { promises as fs } from "node:fs"
import path from "path"

import { Post } from "../types.mts"
import { postDirFilePath } from "../config.mts"

export const savePost = async (post: Post) => {
  const fileName = `${post.appId}_${post.postId}.json`
  const filePath = path.join(postDirFilePath, fileName)
  await fs.writeFile(filePath, JSON.stringify(post, null, 2), "utf8")
}