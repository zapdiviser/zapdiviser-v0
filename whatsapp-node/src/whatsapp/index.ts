import { Boom } from "@hapi/boom"
import NodeCache from "node-cache"
import makeWASocket, {
  AnyMessageContent,
  delay,
  DisconnectReason,
  fetchLatestBaileysVersion,
  getAggregateVotesInPollMessage,
  makeCacheableSignalKeyStore,
  proto,
  WAMessageContent,
  WAMessageKey
} from "@whiskeysockets/baileys"
import MAIN_LOGGER from "@whiskeysockets/baileys/lib/Utils/logger"
import { useRedisAuthState } from "./auth"
import EventEmitter from "node:events"

class Whatsapp {
  instanceId: string
  sock: ReturnType<typeof makeWASocket>
  logger = MAIN_LOGGER.child({})
  msgRetryCounterCache = new NodeCache()
  emmiter = new EventEmitter()
  hasStarted = false

  constructor(instanceId: string) {
    this.instanceId = instanceId

    this.logger.level = "trace"
  }

  async startSock() {
    const { state, saveCreds, clearData } = await useRedisAuthState(this.instanceId)
    const { version, isLatest } = await fetchLatestBaileysVersion()
    console.log(`using WA v${version.join(".")}, isLatest: ${isLatest}`)

    this.sock = makeWASocket({
      version,
      logger: this.logger,
      auth: {
        creds: state.creds,
        keys: makeCacheableSignalKeyStore(state.keys, this.logger)
      },
      msgRetryCounterCache: this.msgRetryCounterCache,
      generateHighQualityLinkPreview: true,
      browser: ["Zapdivizer", "Zapdivizer", "1.0.0"],
    })

    this.sock.ev.process(
      async (events) => {
        if (events["connection.update"]) {
          const update = events["connection.update"]
          const { connection, lastDisconnect, qr } = update

          if (qr) {
            this.emmiter.emit("qr", qr)
          }

          if (connection === "close") {
            if ([401, DisconnectReason.loggedOut].includes((lastDisconnect?.error as Boom)?.output?.statusCode)) {
              await clearData()
              this.startSock()
            } else {
              this.startSock()
            }
          } else if (connection === "connecting") {
            this.emmiter.emit("connecting")
          } else if (connection === "open") {
            this.emmiter.emit("connected")
          }
        }

        if (events["creds.update"]) {
          await saveCreds()
        }

        if (events["labels.association"]) {
          console.log(events["labels.association"])
        }

        if (events["labels.edit"]) {
          console.log(events["labels.edit"])
        }

        if (events.call) {
          console.log("recv call event", events.call)
        }

        if (events["messaging-history.set"]) {
          const { chats, contacts, messages, isLatest } = events["messaging-history.set"]
          console.log(`recv ${chats.length} chats, ${contacts.length} contacts, ${messages.length} msgs (is latest: ${isLatest})`)
        }

        if (events["messages.upsert"]) {
          const upsert = events["messages.upsert"]
          console.log("recv messages ", JSON.stringify(upsert, undefined, 2))

          if (upsert.type === "notify") {
            for (const msg of upsert.messages) {
              if (!msg.key.fromMe) {
                this.emmiter.emit("new-message", msg)
              }
            }
          }
        }

        if (events["messages.update"]) {
          console.log(
            JSON.stringify(events["messages.update"], undefined, 2)
          )

          for (const { key, update } of events["messages.update"]) {
            if (update.pollUpdates) {
              const pollCreation = await this.getMessage(key)
              if (pollCreation) {
                console.log(
                  "got poll update, aggregation: ",
                  getAggregateVotesInPollMessage({
                    message: pollCreation,
                    pollUpdates: update.pollUpdates,
                  })
                )
              }
            }
          }
        }

        if (events["message-receipt.update"]) {
          console.log(events["message-receipt.update"])
        }

        if (events["messages.reaction"]) {
          console.log(events["messages.reaction"])
        }

        if (events["presence.update"]) {
          console.log(events["presence.update"])
        }

        if (events["chats.update"]) {
          console.log(events["chats.update"])
        }

        if (events["contacts.update"]) {
          for (const contact of events["contacts.update"]) {
            if (typeof contact.imgUrl !== "undefined") {
              const newUrl = contact.imgUrl === null
                ? null
                : await this.sock!.profilePictureUrl(contact.id!).catch(() => null)
              console.log(
                `contact ${contact.id} has a new profile pic: ${newUrl}`,
              )
            }
          }
        }

        if (events["chats.delete"]) {
          console.log("chats deleted ", events["chats.delete"])
        }
      }
    )

    return this.sock
  }

  async sendMessageWTyping(msg: AnyMessageContent, phone: string) {
    const result = await this.sock.onWhatsApp(phone).catch(() => null)

    if (result === null || result.length === 0 || !result[0].jid) {
      return
    }

    const jid = result[0].jid

    await this.sock.presenceSubscribe(jid)
    await delay(500)

    await this.sock.sendPresenceUpdate("composing", jid)
    await delay(2000)

    await this.sock.sendPresenceUpdate("paused", jid)

    await this.sock.sendMessage(jid, msg)
  }

  async getMessage(key: WAMessageKey): Promise<WAMessageContent | undefined> {
    return proto.Message.fromObject({})
  }

  async onNewMessage(cb: (msg: proto.IWebMessageInfo) => void) {
    this.emmiter.on("new-message", cb)
  }

  async onQrCode(cb: (qr: string) => void) {
    this.emmiter.on("qr", cb)
  }

  async onConnecting(cb: () => void) {
    this.emmiter.on("connecting", cb)
  }

  async onConnected(cb: () => void) {
    this.emmiter.on("connected", cb)
  }
}

export default Whatsapp
