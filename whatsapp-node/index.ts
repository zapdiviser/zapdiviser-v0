import Whatsapp from "./whatsapp"
import { Worker, Queue } from "bullmq"

interface Message {
  from: string
  to: string
  content: string
}

async function main () {
  const queue = new Queue("Messages")

  const whatsapp = new Whatsapp(process.env.INSTANCE_ID!)

  await whatsapp.startSock()

  const worker = new Worker<Message>(`MessagesSender:${process.env.INSTANCE_ID}`, async job => {
    const { to, content } = job.data

    await whatsapp.sendMessageWTyping({ text: content }, to)
  })

  worker.on("completed", job => {
    console.log(`${job.id} has completed!`)
  })

  worker.on("failed", (job, err) => {
    console.log(`${job?.id} has failed with ${err.message}`)
  })

  whatsapp.onNewMessage(async msg => {
    await queue.add("Messages", { from: msg.key.remoteJid, content: msg.message?.conversation! })
  })
}

main()
