import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllPosts } from "@/lib/actions/post.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

const Home = async ({ searchParams }: SearchParamProps) => {
	const page = Number(searchParams?.page) || 1;
	const searchText = (searchParams?.query as string) || "";
	const category = (searchParams?.category as string) || "";

	const posts = await getAllPosts({
		query: searchText,
		category,
		page,
		limit: 6,
	});

	return (
		<>
			<section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
				<div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
					<div className="flex flex-col justify-center gap-8">
						<h1 className="h1-bold">Share your vision</h1>
						<p className="p-regular-20 md:p-regular-24">
							Lorem ipsum dolor sit amet consectetur, adipisicing
							elit. Voluptatibus suscipit, vel at eveniet alias
							magni quidem exercitationem et blanditiis aliquam
							maxime nesciunt officiis! Corporis omnis magnam cum.
							Possimus, ad consequatur!
						</p>
						<Button
							size="lg"
							asChild
							className="button w-full sm:w-fit"
						>
							<Link href="#posts">Explore now</Link>
						</Button>
					</div>
					<Image
						src="/assets/images/vision.png"
						alt="hero"
						width={1000}
						height={1000}
						className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]"
					/>
				</div>
			</section>
			<section
				id="posts"
				className="wrapper my-8 flex flex-col gap-8 md:gap-12"
			>
				<h2 className="h2-bold"> Trusted by thousands of users</h2>
				<div className="flex w-full flex-col gap-5 md:flex-row">
					<Search />
					<CategoryFilter />
				</div>
				<Collection
					data={posts?.data}
					emptyTitle="No Posts Found"
					emptyStateSubtext="Come back later"
					collectionType="All_Posts"
					limit={6}
					page={page}
					totalPages={posts?.totalPages}
				/>
			</section>
		</>
	);
};

export default Home;
