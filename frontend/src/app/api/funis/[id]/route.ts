import prisma from "@/lib/prisma"
import { NextResponse } from "next/server"

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
  const funis = await prisma.funil.findUnique({
    where: {
      id
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
