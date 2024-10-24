import PostForm from "@/components/shared/PostForm"
import { getPostById } from "@/lib/actions/post.actions"
import { auth } from "@clerk/nextjs";

type UpdatePostProps = {
  params: {
    id: string
  }
}

const UpdatePost = async ({ params: { id } }: UpdatePostProps) => {
  const { sessionClaims } = auth();

  const userId = sessionClaims?.userId as string;
  const post = await getPostById(id)

  return (
    <>
      <section className="bg-primary-50 shadow-md bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <h3 className="wrapper h3-bold text-center sm:text-left">Update Post</h3>
      </section>

      <div className="wrapper my-8">
        <PostForm 
          type="Update" 
          post={post} 
          postId={post._id} 
          userId={userId} 
        />
      </div>
    </>
  )
}

export default UpdatePost