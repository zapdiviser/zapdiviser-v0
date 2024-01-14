import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params: { userId } }: { params: { userId: string } }) {
  const funis = await prisma.funil.findMany({
    where: {
      userId
    },
    include: {
      instances: {
        include: {
          funil: true
        }
      }
    }
  })

  return NextResponse.json(funis)
}
