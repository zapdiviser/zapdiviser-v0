import Button from "@/app/_components/Button"
import Card from "../../_components/Card"
import { redirect } from "next/navigation"
import { NextPage } from "next"
import { getServerSession } from "next-auth"
import authOptions from "@/lib/auth"
import Link from "next/link"
import prisma from "@/lib/prisma"
import { spawn } from "child_process"
import { readFile } from "fs/promises"

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

    const { id } = await prisma.instance.create({
      data: {
        name,
        userId: user.id!
      }
    })

    let res = await fetch(`${process.env.CAPROVER_URL}/api/v2/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Namespace": "captain"
      },
      body: JSON.stringify({
        otpToken: "",
        password: process.env.CAPROVER_PASSWORD
      })
    })

    const { data: { token } } = await res.json()

    await fetch(`${process.env.CAPROVER_URL}/api/v2/user/apps/appDefinitions/register?detached=1`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Captain-Auth": token,
        "X-Namespace": "captain"
      },
      body: JSON.stringify({
        appName: `zapdivizer-instance-${id}`,
        hasPersistentData: false
      })
    })

    while (true) {
      await new Promise(resolve => setTimeout(resolve, 500))

      res = await fetch(`${process.env.CAPROVER_URL}/api/v2/user/apps/appData/zapdivizer-instance-${id}?detached=1`, {
        headers: {
          "X-Captain-Auth": token,
          "X-Namespace": "captain"
        }
      })

      const { data: { isAppBuilding } } = await res.json()

      if (!isAppBuilding) {
        break
      }
    }

    await new Promise(resolve => {
      spawn("git", ["clone", process.env.GIT_REPO_URL!, `/tmp/${id}`]).on("exit", () => {
        spawn("git", ["archive", "--format=tar", "HEAD:whatsapp-node", "-o", `/tmp/${id}/node.tar`], { cwd: `/tmp/${id}` }).on("exit", resolve)
      })
    })

    const deployData = new FormData()
    const buffer = await readFile(`/tmp/${id}/node.tar`)
    const file = new Blob([buffer], { type: "application/x-tar" })
    deployData.append("sourceFile", file)

    await fetch(`${process.env.CAPROVER_URL}/api/v2/user/apps/appData/zapdivizer-instance-${id}?detached=1`, {
      method: "POST",
      headers: {
        "X-Captain-Auth": token,
        "X-Namespace": "captain"
      },
      body: deployData
    })

    while (true) {
      await new Promise(resolve => setTimeout(resolve, 500))

      res = await fetch(`${process.env.CAPROVER_URL}/api/v2/user/apps/appData/zapdivizer-instance-${id}?detached=1`, {
        headers: {
          "X-Captain-Auth": token,
          "X-Namespace": "captain"
        }
      })

      const { data: { isAppBuilding } } = await res.json()

      if (!isAppBuilding) {
        break
      }
    }

    await fetch(`${process.env.CAPROVER_URL}/api/v2/user/apps/appDefinitions/update`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Captain-Auth": token,
        "X-Namespace": "captain"
      },
      body: JSON.stringify({
        appName: `zapdivizer-instance-${id}`,
        instanceCount: 1,
        captainDefinitionRelativeFilePath: "./captain-definition",
        notExposeAsWebApp: true,
        forceSsl: false,
        websocketSupport: false,
        volumes: [],
        ports: [],
        preDeployFunction: "",
        serviceUpdateOverride: "",
        containerHttpPort: 80,
        description: "",
        envVars: [
          { key: "INSTANCE_ID", value: id },
          { key: "REDIS_HOST", value: process.env.REDIS_HOST },
          { key: "REDIS_PORT", value: process.env.REDIS_PORT },
          { key: "REDIS_PASSWORD", value: process.env.REDIS_PASSWORD }
        ],
        appDeployTokenConfig: { enabled: false },
        tags: [],
        redirectDomain: ""
      })
    })

    redirect(`/whatsapp/${id}`)
  }

  const whatsapps = await prisma.instance.findMany({
    where: {
      userId: user.id!
    }
  })

  return (
    <>
      <h1 className="text-5xl uppercase font-bold">Seus whatsapp</h1>
      <Card className="mt-5">
        <form action={create} className="flex flex-col gap-1">
          <label className="text-2xl font-semibold" htmlFor="name">
            Nome
          </label>
          <input type="text" id="name" name="name" className="bg-white focus:outline-none p-2 mt-1 block w-full rounded-md border border-3 border-gray-200 shadow-sm focus:ring focus:ring-green-500 focus:ring-opacity-50 font-semibold" />
          <Button type="submit" className="mt-1 ml-auto">Adicionar whatsapp</Button>
        </form>
      </Card>
      <Card className="mt-5 flex flex-col gap-1">
        <span className="text-2xl font-semibold mb-1">Whatsapp adicionados</span>
        {whatsapps.map(whatsapp => (
          <Link href={`/funil/${whatsapp.id}`} key={whatsapp.id} className="flex w-full p-2 bg-gray-300 rounded items-center">
            <span className="uppsercase font-semibold">{whatsapp.name}</span>
          </Link>
        ))}
      </Card>
    </>
  )
}

export default Page
