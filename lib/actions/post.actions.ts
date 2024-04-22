"use server";

import { revalidatePath } from "next/cache";

import { connectToDatabase } from "@/lib/database";
import Post from "@/lib/database/models/post.model";
import User from "@/lib/database/models/user.model";
import Category from "@/lib/database/models/category.model";
import { handleError } from "@/lib/utils";

import {
	CreatePostParams,
	UpdatePostParams,
	DeletePostParams,
	GetAllPostsParams,
	GetPostsByUserParams,
	GetRelatedPostsByCategoryParams,
} from "@/types";

const getCategoryByName = async (name: string) => {
	return Category.findOne({ name: { $regex: name, $options: "i" } });
};

const populatePost = (query: any) => {
	return query
		.populate({
			path: "author",
			model: User,
			select: "_id firstName lastName",
		})
		.populate({ path: "category", model: Category, select: "_id name" });
};

// CREATE
export async function createPost({ userId, post, path }: CreatePostParams) {
	try {
		await connectToDatabase();

		const author = await User.findById(userId);
		if (!author) throw new Error("Author not found");

		const newPost = await Post.create({
			...post,
			category: post.categoryId,
			author: userId,
		});
		revalidatePath(path);

		return JSON.parse(JSON.stringify(newPost));
	} catch (error) {
		handleError(error);
	}
}

// GET ONE
export async function getPostById(postId: string) {
	try {
		await connectToDatabase();

		const post = await populatePost(Post.findById(postId));

		if (!post) throw new Error("Post not found");

		return JSON.parse(JSON.stringify(post));
	} catch (error) {
		handleError(error);
	}
}

// UPDATE
export async function updatePost({ userId, post, path }: UpdatePostParams) {
	try {
		await connectToDatabase();

		const postToUpdate = await Post.findById(post._id);
		if (
			!postToUpdate ||
			postToUpdate.author.toHexString() !== userId
		) {
			throw new Error("Unauthorized or post not found");
		}

		const updatedPost = await Post.findByIdAndUpdate(
			post._id,
			{ ...post, category: post.categoryId },
			{ new: true }
		);
		revalidatePath(path);

		return JSON.parse(JSON.stringify(updatedPost));
	} catch (error) {
		handleError(error);
	}
}

// DELETE
export async function deletePost({ postId, path }: DeletePostParams) {
	try {
		await connectToDatabase();

		const deletedPost = await Post.findByIdAndDelete(postId);
		if (deletedPost) revalidatePath(path);
	} catch (error) {
		handleError(error);
	}
}
// GET ALL EVENTS
export async function getAllPosts({
	query,
	limit = 6,
	page,
	category,
}: GetAllPostsParams) {
	try {
		await connectToDatabase();

		const titleCondition = query
			? { title: { $regex: query, $options: "i" } }
			: {};
		const categoryCondition = category
			? await getCategoryByName(category)
			: null;
		const conditions = {
			$and: [
				titleCondition,
				categoryCondition ? { category: categoryCondition._id } : {},
			],
		};

		const skipAmount = (Number(page) - 1) * limit;
		const postsQuery = Post.find(conditions)
			.sort({ createdAt: "desc" })
			.skip(skipAmount)
			.limit(limit);

		const posts = await populatePost(postsQuery);
		const postsCount = await Post.countDocuments(conditions);

		return {
			data: JSON.parse(JSON.stringify(posts)),
			totalPages: Math.ceil(postsCount / limit),
		};
	} catch (error) {
		handleError(error);
	}
}

// GET EVENTS BY ORGANIZER
export async function getPostsByUser({
	userId,
	limit = 6,
	page,
}: GetPostsByUserParams) {
	try {
		await connectToDatabase();

		const conditions = { author: userId };
		const skipAmount = (page - 1) * limit;

		const postsQuery = Post.find(conditions)
			.sort({ createdAt: "desc" })
			.skip(skipAmount)
			.limit(limit);

		const posts = await populatePost(postsQuery);
		const postsCount = await Post.countDocuments(conditions);

		return {
			data: JSON.parse(JSON.stringify(posts)),
			totalPages: Math.ceil(postsCount / limit),
		};
	} catch (error) {
		handleError(error);
	}
}

// GET RELATED EVENTS: EVENTS WITH SAME CATEGORY
export async function getRelatedPostsByCategory({
	categoryId,
	postId,
	limit = 3,
	page = 1,
}: GetRelatedPostsByCategoryParams) {
	try {
		await connectToDatabase();

		const skipAmount = (Number(page) - 1) * limit;
		const conditions = {
			$and: [{ category: categoryId }, { _id: { $ne: postId } }],
		};

		const postsQuery = Post.find(conditions)
			.sort({ createdAt: "desc" })
			.skip(skipAmount)
			.limit(limit);

		const posts = await populatePost(postsQuery);
		const postsCount = await Post.countDocuments(conditions);

		return {
			data: JSON.parse(JSON.stringify(posts)),
			totalPages: Math.ceil(postsCount / limit),
		};
	} catch (error) {
		handleError(error);
	}
}
