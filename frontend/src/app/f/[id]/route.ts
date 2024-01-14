import prisma from "@/lib/prisma"
import queue from "@/lib/queue"
import { notFound } from "next/navigation"
import { NextResponse } from "next/server"

export async function POST(req: Request, { params: { id } }: { params: { id: string } }) {
  const funil = await prisma.funil.findUnique({
    where: {
      id
    }
  })

  if (funil === null) {
    return notFound()
  }

  const data = await req.json()

  await queue.add("funil", {
    from: "webhook",
    event: "cart_abandoned",
    data: {
      funilId: id,
      phone: data.phone,
      name: data.name
    }
  })

  return NextResponse.json({ ok: true })
}
