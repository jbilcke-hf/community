

export type Post = {
  postId: string
  appId: string
  prompt: string
  previewUrl: string
  assetUrl: string
  createdAt: string
  upvotes: number
  downvotes: number
}

export type CreatePostResponse = {
  success?: boolean
  error?: string
  post: Post
}

export type GetAppPostsResponse = {
  success?: boolean
  error?: string
  posts: Post[]
}