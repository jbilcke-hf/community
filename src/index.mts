import { validate as uuidValidate } from "uuid"
import express from "express"
import { v4 as uuidv4 } from "uuid"

import { hasValidAuthorization } from "./utils/hasValidAuthorization.mts"
import { initFolders } from "./initFolders.mts"
import { getValidNumber } from "./utils/getValidNumber.mts"
import { Post } from "./types.mts"
import { savePost } from "./core/savePost.mts"
import { getAppPosts } from "./core/getAppPosts.mts"
import { deletePost } from "./core/deletePost.mts"

initFolders()

const app = express()
const port = 7860

// fix this error: "PayloadTooLargeError: request entity too large"
// there are multiple version because.. yeah well, it's Express!
// app.use(bodyParser.json({limit: '50mb'}));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
app.use(express.json({limit: '50mb'}));
app.use(express.urlencoded({limit: '50mb', extended: true}));

app.post("/post", async (req, res) => {

  if (!hasValidAuthorization(req.headers)) {
    console.log("Invalid authorization")
    res.status(401)
    res.write(JSON.stringify({ error: "invalid token" }))
    res.end()
    return
  }

  const postId = `${req.body.postId || ""}`
  const appId = `${req.body.appId || uuidv4()}`
  const prompt = `${req.body.prompt || ""}`
  const assetUrl = `${req.body.assetUrl || ""}`
  const previewUrl = `${req.body.previewUrl || assetUrl}`
  const createdAt = `${req.body.createdAt || new Date().toISOString()}`
  const upvotes = getValidNumber(req.body.upvotes, 0, 1e15, 0)
  const downvotes = getValidNumber(req.body.upvotes, 0, 1e15, 0)

  if (!uuidValidate(postId)) {
    console.error(`invalid postId ${postId}`)
    res.status(400)
    res.write(JSON.stringify({ error: `invalid postId ${postId}` }))
    res.end()
    return
  }

  if (!uuidValidate(appId)) {
    console.error(`invalid appId ${appId}`)
    res.status(400)
    res.write(JSON.stringify({ error: `invalid appId ${appId}` }))
    res.end()
    return
  }

  if (!prompt.length) {
    console.error(`invalid prompt length: cannot be zero`)
    res.status(400)
    res.write(JSON.stringify({ error: `invalid prompt length: cannot be zero` }))
    res.end()
    return
  }

  if (!previewUrl.length) {
    console.error(`invalid preview URL length: cannot be zero`)
    res.status(400)
    res.write(JSON.stringify({ error: `invalid preview URL length: cannot be zero` }))
    res.end()
    return
  }

  if (!assetUrl.length) {
    console.error(`invalid asset URL length: cannot be zero`)
    res.status(400)
    res.write(JSON.stringify({ error: `invalid asset URL length: cannot be zero` }))
    res.end()
    return
  }

  const post: Post = {
    postId,
    appId,
    prompt,
    previewUrl,
    assetUrl,
    createdAt,
    upvotes,
    downvotes,
  }
  
  try {
    await savePost(post)
  } catch (err) {
    console.error(`failed to save the post: ${err}`)
    res.status(400)
    res.write(JSON.stringify({ error: `failed to save the post: ${err}` }))
    res.end()
    return
  }

  res.status(201)
  res.write(JSON.stringify({ success: true, error: "", post }))
  res.end()
})

app.get("/posts/:appId", async (req, res) => {

  const appId = `${req.params.appId}`

  if (!uuidValidate(appId)) {
    console.error("invalid appId")
    res.status(400)
    res.write(JSON.stringify({ error: `invalid appId` }))
    res.end()
    return
  }

  try {
    const posts = await getAppPosts(appId)
    res.status(200)
    res.write(JSON.stringify({ posts }))
    res.end()
    return
  } catch (err) {
    const error = `failed to load the posts: ${err}`
    console.error(error)
    res.status(500)
    res.write(JSON.stringify({ posts: [], error }))
    res.end()
    return
  }
})

// get metadata (json)
app.delete("/posts/:appId/:postId", async (req, res) => {
    
  if (!hasValidAuthorization(req.headers)) {
    console.log("Invalid authorization")
    res.status(401)
    res.write(JSON.stringify({ error: "invalid token" }))
    res.end()
    return
  }

  const appId = req.params.appId

  if (!uuidValidate(appId)) {
    console.error("invalid appId")
    res.status(400)
    res.write(JSON.stringify({ error: `invalid appId` }))
    res.end()
    return
  }

  const postId = req.params.postId

  if (!uuidValidate(postId)) {
    console.error("invalid postId")
    res.status(400)
    res.write(JSON.stringify({ error: `invalid postId` }))
    res.end()
    return
  }

  try {
    const post = await deletePost(appId, postId)
    res.status(200)
    res.write(JSON.stringify(post))
    res.end()
  } catch (err) {
    console.error(err)
    res.status(404)
    res.write(JSON.stringify({ error: "couldn't delete this post" }))
    res.end()
  }
})

app.get("/", async (req, res) => {
  // this is what users will see in the space - but no need to show something scary
  res.status(200)
  res.write(`<html><head></head><body>
Community is a micro-service used to manage community posts for my various spaces.
It is used by <a href="https://jbilcke-hf-panoremix.hf.space" target="_blank">Panoremix</a>, a generative panorama app.
    </body></html>`)
  res.end()
})

app.listen(port, () => { console.log(`Open http://localhost:${port}`) })