import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { setupAuth } from "./auth";
import { z } from "zod";
import passport from "passport";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  const { hashPassword } = setupAuth(app);

  // === SEED DATA ===
  // Create Admin "ArtemProcko" if not exists
  const seedAdmin = async () => {
    const adminExists = await storage.getUserByUsername("Admin");
    if (!adminExists) {
      console.log("Seeding admin user...");
      const hashedPassword = await hashPassword("ArtemProcko");
      await storage.createUser({
        username: "Admin",
        password: hashedPassword,
        isAdmin: true,
      });
      console.log("Admin user 'Admin' created.");
    }
  };
  seedAdmin().catch(console.error);

  // === AUTH ROUTES ===
  app.post(api.auth.register.path, async (req, res, next) => {
    try {
      const input = api.auth.register.input.parse(req.body);
      const existingUser = await storage.getUserByUsername(input.username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      const hashedPassword = await hashPassword(input.password);
      const user = await storage.createUser({
        ...input,
        password: hashedPassword,
        isAdmin: false, // Regular users are not admins
      });

      req.login(user, (err) => {
        if (err) return next(err);
        res.status(201).json(user);
      });
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      next(err);
    }
  });

  app.post(api.auth.login.path, (req, res, next) => {
    // Check fields using Zod first
    const result = api.auth.login.input.safeParse(req.body);
    if (!result.success) {
      return res.status(400).json({ message: "Invalid input" });
    }

    passport.authenticate("local", (err: any, user: any, info: any) => {
      if (err) return next(err);
      if (!user) return res.status(401).json({ message: "Invalid credentials" });
      req.login(user, (err) => {
        if (err) return next(err);
        res.json(user);
      });
    })(req, res, next);
  });

  app.post(api.auth.logout.path, (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get(api.auth.me.path, (req, res) => {
    if (req.isAuthenticated()) {
      res.json(req.user);
    } else {
      res.json(null);
    }
  });

  // === POSTS ROUTES ===
  app.get(api.posts.list.path, async (req, res) => {
    const posts = await storage.getPosts("approved");
    res.json(posts);
  });

  app.get("/api/admin/posts", async (req, res) => {
    if (!req.isAuthenticated() || !(req.user as any).isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const posts = await storage.getPosts("pending");
    res.json(posts);
  });

  app.get(api.posts.get.path, async (req, res) => {
    const post = await storage.getPost(Number(req.params.id));
    if (!post) return res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.post(api.posts.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });
    
    try {
      const input = api.posts.create.input.parse(req.body);
      const post = await storage.createPost({
        ...input,
        authorId: (req.user as any).id,
      });
      res.status(201).json(post);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  app.patch(api.posts.updateStatus.path, async (req, res) => {
    if (!req.isAuthenticated() || !(req.user as any).isAdmin) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const { status } = z.object({ status: z.enum(["pending", "approved", "rejected"]) }).parse(req.body);
      const post = await storage.updatePostStatus(Number(req.params.id), status);
      res.json(post);
    } catch (err) {
      res.status(400).json({ message: "Invalid status" });
    }
  });

  // === COMMENTS ROUTES ===
  app.get(api.comments.list.path, async (req, res) => {
    const comments = await storage.getComments(Number(req.params.postId));
    res.json(comments);
  });

  app.post(api.comments.create.path, async (req, res) => {
    if (!req.isAuthenticated()) return res.status(401).json({ message: "Unauthorized" });

    try {
      const input = api.comments.create.input.parse(req.body);
      const comment = await storage.createComment({
        ...input,
        postId: Number(req.params.postId),
        authorId: (req.user as any).id,
      });
      res.status(201).json(comment);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      throw err;
    }
  });

  return httpServer;
}
