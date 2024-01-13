import Card from "@/app/_components/Card"
import React from "react"
import "reactflow/dist/style.css"
import CopyButton from "../../redirect/_components/CopyButton"
import { NextPage } from "next"
import Editor from "./_components/Editor"

const Page: NextPage<{ params: { id: string } }> = ({ params: { id } }) => {
  const url = `${process.env.NEXTAUTH_URL}/r/${id}`

  return (
    <div>
      <h1 className="text-5xl uppercase font-bold">Funil de mensagens</h1>
      <Card className="mt-5 flex flex-col gap-1">
        <span className="text-2xl font-semibold">Webhook</span>
        <input type="text" value={url} disabled className="bg-white focus:outline-none p-2 mt-1 block w-full rounded-md border border-3 border-gray-200 shadow-sm focus:ring focus:ring-green-500 focus:ring-opacity-50 font-semibold" />
        <CopyButton className="mt-1 ml-auto" text={url} />
      </Card>
      <Card style={{ height: 600 }} className="w-full mt-5 p-0">
        <Editor />
      </Card>
    </div>
  )
}

export default Page
