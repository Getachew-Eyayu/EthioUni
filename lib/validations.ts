import { z } from "zod";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const ratingSchema = z.object({
  universityId: z.string().min(1),
  education: z.number().int().min(1).max(5),
  instructors: z.number().int().min(1).max(5),
  food: z.number().int().min(1).max(5),
  beauty: z.number().int().min(1).max(5),
  behavior: z.number().int().min(1).max(5),
  admin: z.number().int().min(1).max(5),
  library: z.number().int().min(1).max(5),
  dormitory: z.number().int().min(1).max(5),
  security: z.number().int().min(1).max(5),
});

export const reviewSchema = z.object({
  content: z.string().min(10, "Review must be at least 10 characters").max(5000),
  universityId: z.string().min(1),
});

export const reviewReplySchema = z.object({
  content: z.string().min(1).max(2000),
  reviewId: z.string().min(1),
});

export const complaintSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
  category: z.enum([
    "ACADEMIC",
    "ADMINISTRATIVE",
    "FACILITIES",
    "SECURITY",
    "HARASSMENT",
    "OTHER",
  ]),
  universityId: z.string().min(1),
});

export const universitySchema = z.object({
  name: z.string().min(2),
  website: z.string().url().optional().or(z.literal("")),
  description: z.string().optional(),
  location: z.string().min(2),
  region: z.string().min(2),
  type: z.enum(["PUBLIC", "PRIVATE"]),
  programs: z.array(z.string()).default([]),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  logo: z.string().optional(),
});

export const profileSchema = z.object({
  name: z.string().min(2),
  image: z.string().url().optional().or(z.literal("")),
});

export const resetPasswordSchema = z.object({
  email: z.string().email(),
});

export const newPasswordSchema = z.object({
  token: z.string().min(1),
  password: z.string().min(8),
});
