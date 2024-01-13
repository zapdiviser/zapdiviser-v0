"use server"

import argon2 from "argon2"
import { redirect } from "next/navigation"
import prisma from "@/lib/prisma"

export async function registerUser(email: string, password: string) {
  await prisma.user.create({
    data: {
      email,
      name: email,
      emailVerified: new Date(),
      password: await argon2.hash(password)
    }
  })

  redirect("/login")
}
