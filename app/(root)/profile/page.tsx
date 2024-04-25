import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getPostsByUser } from '@/lib/actions/post.actions'
// import { getOrdersByUser } from '@/lib/actions/order.actions'
// import { IOrder } from '@/lib/database/models/order.model'
import { SearchParamProps } from '@/types'
import { auth } from '@clerk/nextjs'
import Link from 'next/link'
import React from 'react'

const ProfilePage = async ({ searchParams }: SearchParamProps) => {
  const { sessionClaims } = auth();
  const userId = sessionClaims?.userId as string;

  // const ordersPage = Number(searchParams?.ordersPage) || 1;
  const postsPage = Number(searchParams?.postsPage) || 1;

  // const orders = await getOrdersByUser({ userId, page: ordersPage})

  // const orderedPosts = orders?.data.map((order: IOrder) => order.post) || [];
  const organizedPosts = await getPostsByUser({ userId, page: postsPage })

  return (
    <>
      {/* My Tickets */}
      {/* <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>My Tickets</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#posts">
              Explore More Posts
            </Link>
          </Button>
        </div>
      </section> */}

      {/* <section className="wrapper my-8">
        <Collection 
          data={orderedPosts?.data}
          emptyTitle="No post tickets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting posts to explore!"
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section> */}

      {/* Posts Organized */}
      <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
        <div className="wrapper flex items-center justify-center sm:justify-between">
          <h3 className='h3-bold text-center sm:text-left'>Your Posts</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/posts/create">
              Create New Post
            </Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        
        <Collection 
          data={organizedPosts?.data}
          emptyTitle="No posts have been created yet"
          emptyStateSubtext="Go create some now"
          collectionType="Posts_Organized"
          limit={3}
          page={postsPage}
          urlParamName="postsPage"
          totalPages={organizedPosts?.totalPages}
        />
      </section>
    </>
  )
}

export default ProfilePage