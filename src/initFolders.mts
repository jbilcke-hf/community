import {
  postDirFilePath
} from "./config.mts"
import { createDirIfNeeded } from "./utils/createDirIfNeeded.mts"

export const initFolders = () => {
  console.log(`initializing folders..`)
  createDirIfNeeded(postDirFilePath)
}