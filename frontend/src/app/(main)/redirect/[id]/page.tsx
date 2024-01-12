import Button from "@/app/_components/Button"
import Card from "../../../_components/Card"
import redis from "@/lib/redis"
import { redirect } from "next/navigation"
import { NextPage } from "next"
import { notFound } from "next/navigation"
import CopyButton from "./_components/CopyButton"
import { IoCloseSharp } from "react-icons/io5"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"

const Page: NextPage<{ params: { id: string } }> = async ({ params: { id } }) => {
  const session = await getServerSession(authOptions)
  const user = session!.user!

  async function addLink(formData: FormData) {
    "use server"

    const link = formData.get("link") as string

    if (!link) {
      return
    }

    const url = new URL(link)

    await prisma.redirectUrl.create({
      data: {
        url: url.toString(),
        redirectId: id
      }
    })

    await redis.json.arrappend(`redirect:${id}`, "$.links", url.toString())

    return redirect(`/redirect/${id}`)
  }

  async function removeLink(formData: FormData) {
    "use server"

    const link = formData.get("link") as string

    if (!link) {
      return
    }

    await prisma.redirectUrl.deleteMany({
      where: {
        redirectId: id,
        url: link
      }
    })

    const index = (await redis.json.arrindex(`redirect:${id}`, "$.links", link))[0]!
    await redis.json.arrpop(`redirect:${id}`, "$.links", index)
    await redis.json.set(`redirect:${id}`, "$.index", 0)

    return redirect(`/redirect/${id}`)
  }

  const redirectDataa = await prisma.redirect.findUnique({
    where: {
      id,
      userId: user.id!
    },
    include: {
      urls: true
    }
  })

  if (!redirectDataa) {
    notFound()
  }

  const { name, urls } = redirectDataa
  urls.reverse()

  const links = urls.map(url => url.url)

  const url = `${process.env.NEXTAUTH_URL}/r/${id}`

  return (

    <>
      <h1 className="text-5xl uppercase font-bold">Campanha "{name}"</h1>
      <Card className="mt-5 flex flex-col gap-1">
        <span className="text-2xl font-semibold">Link principal</span>
        <input type="text" value={url} disabled className="bg-white focus:outline-none p-2 mt-1 block w-full rounded-md border border-3 border-gray-200 shadow-sm focus:ring focus:ring-green-500 focus:ring-opacity-50 font-semibold" />
        <CopyButton className="mt-1 ml-auto" text={url} />
      </Card>
      <Card className="mt-5">
        <form action={addLink} className="flex flex-col gap-2">
          <label className="text-2xl font-semibold" htmlFor="name">
            Adicione seus links
          </label>
          <input type="text" id="link" name="link" defaultValue="" className="bg-white focus:outline-none p-2 mt-2 block w-full rounded-md border border-3 border-gray-200 shadow-sm focus:ring focus:ring-green-500 focus:ring-opacity-50 font-semibold" />
          <Button type="submit" className="mt-1 ml-auto">Adicionar</Button>
        </form>
        <span className="mt-2 text-2xl font-semibold">Links adicionados</span>
        <ul className="mt-1 ml-auto flex flex-col gap-1">
          {links?.map(link => (
            <li key={link} className="flex items-center gap-1 bg-gray-300 p-2 rounded justify-between">
              <span className="font-semibold">{link}</span>
              <form action={removeLink} className="h-full flex items-center gap-1">
                <input type="hidden" name="link" value={link} />
                <button type="submit" className="text-green-700">
                  <IoCloseSharp size={20} />
                </button>
              </form>
            </li>
          ))}
        </ul>
      </Card>
    </>
  )
}

export default Page
