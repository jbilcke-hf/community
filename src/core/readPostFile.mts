import { promises as fs } from "node:fs"

import { Post } from "../types.mts"

export const readPostFile = async (postFilePath: string): Promise<Post> => {
  const post = JSON.parse(
    await fs.readFile(postFilePath, 'utf8')
  ) as Post

  return post
}
