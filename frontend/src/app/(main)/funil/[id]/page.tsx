import Card from "@/app/_components/Card"
import React from "react"
import "reactflow/dist/style.css"
import CopyButton from "../../redirect/[id]/_components/CopyButton"
import { NextPage } from "next"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import Instances from "./_components/Instances"
import Link from "next/link"
import { notFound } from "next/navigation"

const Page: NextPage<{ params: { id: string } }> = async ({ params: { id } }) => {
  const session = await getServerSession(authOptions)
  const user = session!.user!

  const url = `${process.env.NEXTAUTH_URL}/f/${id}`

  const funil = await prisma.funil.findUnique({
    where: {
      id,
      userId: user.id!
    },
    include: {
      instances: {
        include: {
          instance: true
        }
      }
    }
  })

  if (!funil) {
    return notFound()
  }

  const instances = await prisma.instance.findMany({
    where: {
      userId: user.id!
    }
  })

  const options = instances.map(instance => ({
    value: instance.id,
    label: instance.name
  }))

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-5xl uppercase font-bold">Funil de mensagens</h1>
      <Card className="flex flex-col gap-1">
        <span className="text-2xl font-semibold">Webhook</span>
        <input type="text" value={url} disabled className="bg-white focus:outline-none p-2 mt-1 block w-full rounded-md border border-3 border-gray-200 shadow-sm focus:ring focus:ring-green-500 focus:ring-opacity-50 font-semibold" />
        <CopyButton className="mt-1 ml-auto" text={url} />
      </Card>
      <Instances options={options} id={id} initialSelected={funil.instances.map(instance => ({
        value: instance.instance.id,
        label: instance.instance.name
      }))} />
      <div>
        <Link className="bg-gradient-to-r from-green-600 to-green-500 hover:bg-green-700 text-white text-xl py-1 px-2 rounded uppercase" href={`/funil/${id}/flow`}>Editar funil</Link>
      </div>
    </div>
  )
}

export default Page
