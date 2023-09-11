import tmpDir from "temp-dir"
import { validate as uuidValidate } from "uuid"

import { postDirFilePath } from "../config.mts"
import { deleteFilesWithName } from "../utils/deleteAllFilesWith.mts"


// note: we make sure appId and postId are *VALID*
// otherwise an attacker could try to delete important files!
export const deletePost = async (appId: string, postId?: string) => {
  if (!uuidValidate(appId)) {
    throw new Error(`fatal error: appId ${appId} is invalid!`)
  }

  if (postId && !uuidValidate(postId)) {
    throw new Error(`fatal error: postId ${postId} is invalid!`)
  }
  const id = postId ? `${appId}_${postId}` : appId

  // this should delete everything, including audio files
  // however we still have some temporary files with a name that is unique:
  // we should probably rename those
  await deleteFilesWithName(tmpDir, id)
  await deleteFilesWithName(postDirFilePath, id)
}
