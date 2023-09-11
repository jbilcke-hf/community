

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

export type PostAPIResponse = {
  success?: boolean
  error?: string
  post: Post
}

export type PostAPIRequest = Partial<Post>
