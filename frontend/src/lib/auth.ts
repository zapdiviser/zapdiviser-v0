import { PrismaAdapter } from "@auth/prisma-adapter"
import { AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import argon2 from "argon2"
import prisma from "./prisma"

const adapter = PrismaAdapter(prisma)

const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" }
      },
      authorize: async (credentials) => {
        const { email, password } = credentials!

        const user = await prisma.user.findUnique({
          where: {
            email
          }
        })

        if (!user) {
          return null
        }

        if (!(await argon2.verify(user.password, password))) {
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
  },
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.sub
      }

      return session
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id
      }

      return token
    }
  }
}

export default authOptions
