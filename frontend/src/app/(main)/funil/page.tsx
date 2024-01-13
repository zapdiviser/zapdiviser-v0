import Button from "@/app/_components/Button"
import Card from "../../_components/Card"
import { redirect } from "next/navigation"
import { NextPage } from "next"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
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

    const { id } = await prisma.funil.create({
      data: {
        name,
        userId: user.id!
      }
    })

    redirect(`/redirect/${id}`)
  }

  const funis = await prisma.funil.findMany({
    where: {
      userId: user.id!
    }
  })

  return (
    <>
      <h1 className="text-5xl uppercase font-bold">Seus funis</h1>
      <Card className="mt-5">
        <form action={create} className="flex flex-col gap-1">
          <label className="text-2xl font-semibold" htmlFor="name">
            Nome
          </label>
          <input type="text" id="name" name="name" className="bg-white focus:outline-none p-2 mt-1 block w-full rounded-md border border-3 border-gray-200 shadow-sm focus:ring focus:ring-green-500 focus:ring-opacity-50 font-semibold" />
          <Button type="submit" className="mt-1 ml-auto">Criar funil</Button>
        </form>
      </Card>
      <Card className="mt-5 flex flex-col gap-1">
        <span className="text-2xl font-semibold mb-1">Funis criados</span>
        {funis.map(funil => (
          <Link href={`/funil/${funil.id}`} key={funil.id} className="flex w-full p-2 bg-gray-300 rounded items-center">
            <span className="uppsercase font-semibold">{funil.name}</span>
          </Link>
        ))}
      </Card>
    </>
  )
}

export default Page
