import prisma from "@/lib/prisma"
import redis from "@/lib/redis"
import { redirect, notFound } from "next/navigation"

export async function POST(req: Request, { params: { id } }: { params: { id: string } }) {
  const funil = await prisma.funil.findUnique({
    where: {
      id
    }
  })

  if (funil === null) {
    return notFound()
  }
}
