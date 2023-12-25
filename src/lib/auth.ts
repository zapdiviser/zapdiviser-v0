import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import { AuthOptions } from "next-auth"
import redis from "./redis"
import CredentialsProvider from "next-auth/providers/credentials"
import argon2 from "argon2"

const adapter = UpstashRedisAdapter(redis)

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const { email, password } = credentials!

        const user = await adapter.getUserByEmail?.(email)

        if (!user) {
          return null
        }

        const userPassword = await redis.get(`user-${user.id}:password`) as string

        if (!userPassword || !(await argon2.verify(userPassword, password))) {
          return null
        }

        return user
      }
    })
  ],
  // @ts-ignore
  adapter,
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
}

export default authOptions
