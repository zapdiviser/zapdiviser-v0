import { NextPage } from "next"
import Editor from "./_components/Editor"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import prisma from "@/lib/prisma"
import { notFound } from "next/navigation"

const Page: NextPage<{ params: { id: string } }> = async ({ params: { id } }) => {
  const session = await getServerSession(authOptions)
  const user = session!.user!

  const funil = await prisma.funil.findUnique({
    where: {
      id,
      userId: user.id!
    }
  })

  if (!funil) {
    return notFound()
  }

  let flow: any

  if (typeof funil.flow === "string") {
    flow = JSON.parse(funil.flow)
  } else {
    flow = funil.flow
  }

  return (
    <Editor id={id} flow={flow} />
  )
}

export default Page
