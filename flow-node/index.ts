import { Worker, Queue } from "bullmq"
import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!)
})

const worker = new Worker<{ from: string, to: string }>(""FlowTriggers"", async job => {
  const { from, to } = job.data

  const situation = await redis.get(`conversation:${from}:${to}`)

  if (situation) {

  } else {

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
