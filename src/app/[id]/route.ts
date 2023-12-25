import redis from "@/lib/redis"
import { redirect, notFound } from "next/navigation"

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
  const currentIndex = await redis.get<number>(`redirect-${id}:index`)

  if (currentIndex === null) {
    return notFound()
  }

  const currentUrl = await redis.lindex(`redirect-${id}:links`, currentIndex)

  if (currentUrl === null) {
    return notFound()
  }

  let nextIndex = currentIndex - 1

  if (nextIndex < 0) {
    nextIndex = await redis.llen(`redirect-${id}:links`) - 1
  }

  await redis.set(`redirect-${id}:index`, nextIndex)

  return redirect(currentUrl)
}
