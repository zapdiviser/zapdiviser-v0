"use server"

import authOptions from "@/lib/auth"
import prisma from "@/lib/prisma"
import { getServerSession } from "next-auth"
import { redirect } from "next/navigation"

export const exportFlow = async (formData: FormData) => {
  const session = await getServerSession(authOptions)
  const user = session!.user!

  if (!user) {
    return
  }

  const id = formData.get("id") as string
  const flow = JSON.parse(formData.get("flow") as string)
  const nodes = flow.nodes
  const edges = flow.edges

  const actions = nodes.filter((node: any) => node.type === "message")
  const events = nodes.filter((node: any) => node.type !== "message")

  const actionMap: any = {}

  actions.forEach((action: any) => {
    actionMap[action.id] = {
      id: action.id,
      type: "action",
      next: [],
      prev: [],
      data: action.data
    }
  })

  events.forEach((event: any) => {
    actionMap[event.id] = {
      id: event.id,
      type: "event",
      next: [],
      prev: [],
      data: event.data
    }
  })

  edges.forEach((edge: any) => {
    const from = edge.source
    const to = edge.target
    actionMap[from].next.push(to)
    actionMap[to].prev.push(from)
  })

  const actionList = Object.values(actionMap)

  flow["actions"] = actionList

  const json = JSON.stringify(flow)

  await prisma.funil.updateMany({
    where: { id, userId: user.id! },
    data: { flow: json }
  })

  redirect(`/funil/${id}`)
}
