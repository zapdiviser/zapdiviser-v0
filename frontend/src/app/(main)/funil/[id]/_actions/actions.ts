"use server"

import authOptions from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"

export const saveConectedInsances = async (formData: FormData) => {
  const session = await getServerSession(authOptions)
  const user = session!.user!

  if (!user) {
    return
  }

  const id = formData.get("id") as string
  const connectedInstances = JSON.parse(formData.get("instances") as string)
  console.log(connectedInstances)

  await prisma.$transaction([
    prisma.funil_Instance.deleteMany({
      where: { funilId: id, NOT: { instanceId: { in: connectedInstances } } }
    }),
    prisma.funil_Instance.createMany({
      data: connectedInstances.map((instance: any) => ({
        funilId: id,
        instanceId: instance
      }))
    })
  ])
}
