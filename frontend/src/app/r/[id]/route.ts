import redis from "@/lib/redis"
import { redirect, notFound } from "next/navigation"

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
  const result = await redis.multi()
    .get(`redirect:${id}:index`)
    .lrange(`redirect:${id}:links`, 0, -1)
    .exec()

  if (result === null) {
    return notFound()
  }

  let [[,index], [,links]] = result as unknown as [[any, number], [any, string[]]]

  index = index ?? 0

  const currentUrl = links[index]

  let nextIndex = index - 1

  if (nextIndex < 0) {
    nextIndex = links.length - 1
  }

  redis.set(`redirect:${id}:index`, nextIndex)

  redirect(currentUrl)
}
