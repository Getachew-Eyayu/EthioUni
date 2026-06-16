import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function calculateOverallRating(categories: {
  education: number;
  instructors: number;
  food: number;
  beauty: number;
  behavior: number;
  admin: number;
  library: number;
  dormitory: number;
  security: number;
}): number {
  const values = Object.values(categories);
  const sum = values.reduce((acc, val) => acc + val, 0);
  return Math.round((sum / values.length) * 10) / 10;
}

export const RATING_CATEGORIES = [
  { key: "education", label: "Education Quality" },
  { key: "instructors", label: "Instructors" },
  { key: "food", label: "Food" },
  { key: "beauty", label: "Campus Beauty" },
  { key: "behavior", label: "Student Behavior" },
  { key: "admin", label: "Administration" },
  { key: "library", label: "Library" },
  { key: "dormitory", label: "Dormitory" },
  { key: "security", label: "Security" },
] as const;

export const ETHIOPIAN_REGIONS = [
  "Addis Ababa",
  "Afar",
  "Amhara",
  "Benishangul-Gumuz",
  "Central Ethiopia",
  "Dire Dawa",
  "Gambela",
  "Harari",
  "Oromia",
  "Sidama",
  "Somali",
  "South Ethiopia",
  "South West Ethiopia",
  "Tigray",
] as const;
