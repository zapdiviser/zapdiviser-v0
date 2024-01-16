import { Worker, Queue } from "bullmq"
import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null
})

interface FlowEvent {
  from: "flow"
  event: "trigger"
  data: {
    previus: string
  }
}

interface WebhookEvent {
  from: "webhook"
  event: "cart_abandoned"
  data: {
    funilId: string
    phone: string
    name: string
  }
}

interface WhatsappEvent {
  from: "whatsapp"
  event: "message"
  data: {
    instanceId: string
    userId: string
    from: string
    content: string
  }
}

const worker = new Worker<FlowEvent | WebhookEvent | WhatsappEvent>("FlowTriggers", async job => {
  const { event, from } = job.data

  switch (from) {
    case "whatsapp":
      switch (event) {
        case "message":
          const { data: { from, content, instanceId, userId } } = job.data as WhatsappEvent

          const situation = await redis.get(`conversation:${from}:${instanceId}`)

          if (situation) {

          } else {

          }

          break
      }

      break

    case "webhook":
      switch (event) {
        case "cart_abandoned":
          const { data: { funilId, phone, name } } = job.data as WebhookEvent

          const situation = JSON.parse(await redis.get(`conversation:${from}:${funilId}`) ?? "null")

          let flow: any
          let instance: any

          if (situation) {
            flow = situation.flow
            instance = situation.instance
          } else {
            const res = await fetch(`${process.env.API_URL}/api/funis/${funilId}`)
            const data = await res.json()
            flow = JSON.parse(data.flow)

            const insances = data.instances.map((instance: any) => instance.instanceId)
            instance = insances[Math.floor(Math.random() * insances.length)]

            await redis.set(`conversation:${from}:${funilId}`, JSON.stringify({ flow, instance }))
          }

          const actions = flow.actions

          const matches = actions.filter((action: any) => action.type === "event" && action.data.typeId === "cart_abandonment")

          if (matches.length === 0) {
            return
          }

          for (const match of matches) {
            const message = actions.find((action: any) => action.id === match.next[0]).data.message
            const queue = new Queue(`MessagesSender:${instance}`, { connection: redis })

            await queue.add("MessagesSender", {
              from: "whatsapp",
              event: "message",
              to: phone,
              content: message
            })
          }

          break
      }

      break

    case "flow":
      switch (event) {
        case "trigger":
          const { data: { previus } } = job.data as FlowEvent

          break
      }

      break
  }
}, {
  connection: redis
})

worker.on("completed", job => {
  console.log(`${job.id} has completed!`)
})

worker.on("failed", (job, err) => {
  console.log(`${job?.id} has failed with ${err.message}`)
})
