import redis from "@/lib/redis"
import { redirect, notFound } from "next/navigation"

export async function GET(req: Request, { params: { id } }: { params: { id: string } }) {
  const campaign = await redis.json.get(`redirect-${id}`) as { index: number, links: string } | null

  if (campaign === null) {
    return notFound()
  }

  const currentUrl = campaign.links[campaign.index]

  let nextIndex = campaign.index - 1

  if (nextIndex < 0) {
    nextIndex = campaign.links.length - 1
  }

  redis.json.set(`redirect-${id}`, "index", nextIndex)

  redirect(currentUrl)
}
