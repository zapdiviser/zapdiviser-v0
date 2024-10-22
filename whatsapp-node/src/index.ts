import redis from "./redis"
import Whatsapp from "./whatsapp"
import { Worker, Queue } from "bullmq"
import Pusher from "pusher"

const instanceId = process.env.INSTANCE_ID!

const pusher = new Pusher({
  appId: "1740345",
  key: "2cc10d3c15c82eab13cc",
  secret: "04b9a85ecef7c383e0c6",
  cluster: "sa1",
  useTLS: true
})

interface Message {
  from: string
  to: string
  content: string
}

async function main () {
  const queue = new Queue("FlowTriggers", { connection: redis })

  const whatsapp = new Whatsapp(instanceId)

  await whatsapp.startSock()

  await pusher.trigger("goodly-grove-306", `whatsapp:${instanceId}:ready`, {})
  await redis.set(`whatsapp:${instanceId}:ready`, "true")

  const worker = new Worker<Message>(`MessagesSender:${instanceId}`, async job => {
    const { to, content } = job.data

    await whatsapp.sendMessageWTyping({ text: content }, to)
  }, { connection: redis })

  worker.on("completed", job => {
    console.log(`${job.id} has completed!`)
  })

  worker.on("failed", (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`)
  })

  whatsapp.onNewMessage(async msg => {
    await queue.add("Flows", { event: "message", instanceId, from: msg.key.remoteJid, content: msg.message?.conversation! })
  })

  whatsapp.onQrCode(async qr => {
    await pusher.trigger("goodly-grove-306", `whatsapp:${instanceId}:qr`, qr)
  })

  whatsapp.onConnecting(async () => {
    await pusher.trigger("goodly-grove-306", `whatsapp:${instanceId}:connecting`, {})
  })

  whatsapp.onConnected(async () => {
    await pusher.trigger("goodly-grove-306", `whatsapp:${instanceId}:connected`, {})
  })
}

main()
