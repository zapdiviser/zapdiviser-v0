import { Worker, Queue } from "bullmq"
import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!)
})

interface WebhookEvent {
  from: "webhook"
  event: "cart_updated"
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

const worker = new Worker<WebhookEvent | WhatsappEvent>("Flows", async job => {
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
        case "cart_updated":
          const { data: { funilId, phone, name } } = job.data as WebhookEvent

          /*
          const situation = await redis.get(`conversation:${from}:${funilId}`)

          if (situation) {

          } else {

          }*/

          const queue = new Queue(`MessagesSender:${funilId}`, { connection: redis })

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
