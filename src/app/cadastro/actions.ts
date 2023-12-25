"use server"

import argon2 from "argon2"
import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import redis from "@/lib/redis"
import { nanoid } from "nanoid"
import { redirect } from "next/navigation"

const adapter = UpstashRedisAdapter(redis)

export async function registerUser(email: string, password: string) {
  const user = await adapter.createUser?.({
    id: nanoid(),
    name: email,
    email,
    emailVerified: new Date()
  })

  await redis.set(`user-${user?.id}:password`, await argon2.hash(password))

  redirect("/login")
}
