import path from "node:path"

import { postDirFilePath } from "../config.mts"
import { readPostFile } from "./readPostFile.mts"
import { Post } from "../types.mts"

const cache: { [key: string]: { timestamp: number, post: Post }} = {};

export const getPost = async (appId: string, postId: string): Promise<Post> => {

  /*
  const cacheKey = `${appId}_${postId}`;
  const now = Date.now();
  
  // this is a tight cache (5 seconds)
  if (cache[cacheKey] && (now - cache[cacheKey].timestamp) < (5 * 1000)) {
    // return the cached data if it is less than 5 minutes old
    return cache[cacheKey].post;
  }
  */

  const postFileName = `${appId}_${postId}.json`

  const postFilePath = path.join(postDirFilePath, postFileName)

  try {
    const post = await readPostFile(postFilePath)
    
    // if successful, cache the post and its fetch time
    // cache[cacheKey] = { timestamp: now, post };

    return post
  } catch (err) {
    throw new Error(`couldn't find post ${postId} for app ${appId}`)
  }
}