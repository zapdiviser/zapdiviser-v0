import Button from "@/app/_components/Button"
import Card from "../../_components/Card"
import redis from "@/lib/redis"
import { nanoid } from "nanoid"
import { redirect } from "next/navigation"
import { NextPage } from "next"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import CopyButton from "./_components/CopyButton"
import { FaCopy } from "react-icons/fa"
import { FaEdit } from "react-icons/fa"
import { IoCloseSharp } from "react-icons/io5"
import Link from "next/link"
import prisma from "@/lib/prisma"

const Page: NextPage = async () => {
  const session = await getServerSession(authOptions)
  const user = session!.user!

  async function create(formData: FormData) {
    "use server"

    const session = await getServerSession(authOptions)
    const user = session!.user!

    const name = formData.get("name") as string

    if (!name) {
      return
    }

    const { id } = await prisma.redirect.create({
      data: {
        name,
        userId: user.id!
      }
    })

    await redis.json.set(`redirect:${id}`, "$", {
      index: 0,
      links: []
    })

    redirect(`/redirect/${id}`)
  }

  const campaigns = await redis.lrange<{ name: string, id: string }>(`user-${user.email}:campaigns`, 0, -1)

  return (
    <>
      <h1 className="text-5xl uppercase font-bold">Suas campanhas</h1>
      <Card className="mt-5">
        <form action={create} className="flex flex-col gap-1">
          <label className="text-2xl font-semibold" htmlFor="name">
            Nome
          </label>
          <input type="text" id="name" name="name" className="bg-white focus:outline-none p-2 mt-1 block w-full rounded-md border border-3 border-gray-200 shadow-sm focus:ring focus:ring-green-500 focus:ring-opacity-50 font-semibold" />
          <Button type="submit" className="mt-1 ml-auto">Criar campanha</Button>
        </form>
      </Card>
      <Card className="mt-5 flex flex-col gap-1">
        <span className="text-2xl font-semibold mb-1">Campanhas criadas</span>
        {campaigns?.map(campaign => (
          <div key={campaign.id} className="flex w-full p-2 bg-gray-300 rounded items-center">
            <span className="uppsercase font-semibold">{campaign.name}</span>
            <div className="justify-self-end ml-auto flex gap-2 items-center">
              <CopyButton text={`${process.env.NEXTAUTH_URL}/${campaign.id}`} className="text-green-700">
                <FaCopy size={20} />
              </CopyButton>
              <Link href={`/redirect/${campaign.id}`} className="text-green-700">
                <FaEdit size={20} />
              </Link>
              <Link href={`/redirect/${campaign.id}`} className="text-green-700 -mx-1">
                <IoCloseSharp size={25} />
              </Link>
            </div>
          </div>
        ))}
      </Card>
    </>
  )
}

export default Page
