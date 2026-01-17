import { db } from "./db";
import { users, posts, comments, type User, type InsertUser, type Post, type InsertPost, type Comment, type InsertComment } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser & { isAdmin?: boolean }): Promise<User>;

  // Posts
  createPost(post: InsertPost & { authorId: number }): Promise<Post>;
  getPosts(status?: string): Promise<(Post & { author: string })[]>;
  getPost(id: number): Promise<(Post & { author: string }) | undefined>;
  updatePostStatus(id: number, status: "pending" | "approved" | "rejected"): Promise<Post>;

  // Comments
  createComment(comment: InsertComment & { authorId: number, postId: number }): Promise<Comment>;
  getComments(postId: number): Promise<(Comment & { author: string })[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser & { isAdmin?: boolean }): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async createPost(post: InsertPost & { authorId: number }): Promise<Post> {
    const [newPost] = await db.insert(posts).values(post).returning();
    return newPost;
  }

  async getPosts(status?: string): Promise<(Post & { author: string })[]> {
    const query = db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      imageUrl: posts.imageUrl,
      status: posts.status,
      authorId: posts.authorId,
      createdAt: posts.createdAt,
      author: users.username
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id));

    if (status) {
      query.where(eq(posts.status, status as any)); // Type assertion for enum
    }

    return await query.orderBy(desc(posts.createdAt));
  }

  async getPost(id: number): Promise<(Post & { author: string }) | undefined> {
    const [post] = await db.select({
      id: posts.id,
      title: posts.title,
      content: posts.content,
      imageUrl: posts.imageUrl,
      status: posts.status,
      authorId: posts.authorId,
      createdAt: posts.createdAt,
      author: users.username
    })
    .from(posts)
    .innerJoin(users, eq(posts.authorId, users.id))
    .where(eq(posts.id, id));
    return post;
  }

  async updatePostStatus(id: number, status: "pending" | "approved" | "rejected"): Promise<Post> {
    const [updatedPost] = await db.update(posts)
      .set({ status })
      .where(eq(posts.id, id))
      .returning();
    return updatedPost;
  }

  async createComment(comment: InsertComment & { authorId: number, postId: number }): Promise<Comment> {
    const [newComment] = await db.insert(comments).values(comment).returning();
    return newComment;
  }

  async getComments(postId: number): Promise<(Comment & { author: string })[]> {
    return await db.select({
      id: comments.id,
      content: comments.content,
      postId: comments.postId,
      authorId: comments.authorId,
      createdAt: comments.createdAt,
      author: users.username
    })
    .from(comments)
    .innerJoin(users, eq(comments.authorId, users.id))
    .where(eq(comments.postId, postId))
    .orderBy(desc(comments.createdAt));
  }
}

export const storage = new DatabaseStorage();
