import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

// Key helpers
export const userKey = (email: string) =>
  `user:${email.toLowerCase().trim()}`;
export const dataKey = (userId: string) => `data:${userId}`;
