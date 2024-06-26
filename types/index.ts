// ====== USER PARAMS
export type CreateUserParams = {
    clerkId: string
    firstName: string
    lastName: string
    username: string
    email: string
    photo: string
  }
  
  export type UpdateUserParams = {
    firstName: string
    lastName: string
    username: string
    photo: string
  }
  
  // ====== POST PARAMS
  export type CreatePostParams = {
    userId: string
    post: {
      title: string
      description: string
      location: string
      imageUrl: string
      categoryId: string
    }
    path: string
  }
  
  export type UpdatePostParams = {
    userId: string
    post: {
      _id: string
      title: string
      imageUrl: string
      description: string
      location: string
      categoryId: string
    }
    path: string
  }
  
  export type DeletePostParams = {
    postId: string
    path: string
  }
  
  export type GetAllPostsParams = {
    query: string
    category: string
    limit: number
    page: number
  }
  
  export type GetPostsByUserParams = {
    userId: string
    limit?: number
    page: number
  }
  
  export type GetRelatedPostsByCategoryParams = {
    categoryId: string
    postId: string
    limit?: number
    page: number | string
  }
  
  export type Post = {
    _id: string
    title: string
    description: string
    imageUrl: string
    location: string
    author: {
      _id: string
      firstName: string
      lastName: string
    }
    category: {
      _id: string
      name: string
    }
  }
  
  // ====== CATEGORY PARAMS
  export type CreateCategoryParams = {
    categoryName: string
  }
  
  // ====== URL QUERY PARAMS
  export type UrlQueryParams = {
    params: string
    key: string
    value: string | null
  }
  
  export type RemoveUrlQueryParams = {
    params: string
    keysToRemove: string[]
  }
  
  export type SearchParamProps = {
    params: { id: string }
    searchParams: { [key: string]: string | string[] | undefined }
  }