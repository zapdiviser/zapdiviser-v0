"use strict"; function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; } async function _asyncNullishCoalesce(lhs, rhsFn) { if (lhs != null) { return lhs; } else { return await rhsFn(); } } function _optionalChain(ops) { let lastAccessLHS = undefined; let value = ops[0]; let i = 1; while (i < ops.length) { const op = ops[i]; const fn = ops[i + 1]; i += 2; if ((op === 'optionalAccess' || op === 'optionalCall') && value == null) { return undefined; } if (op === 'access' || op === 'optionalAccess') { lastAccessLHS = value; value = fn(value); } else if (op === 'call' || op === 'optionalCall') { value = fn((...args) => value.call(lastAccessLHS, ...args)); lastAccessLHS = undefined; } } return value; }var _bullmq = require('bullmq');
var _ioredis = require('ioredis'); var _ioredis2 = _interopRequireDefault(_ioredis);
var _dotenv = require('dotenv'); var _dotenv2 = _interopRequireDefault(_dotenv);

_dotenv2.default.config()

const redis = new (0, _ioredis2.default)({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  maxRetriesPerRequest: null
})






























const worker = new _bullmq.Worker("FlowTriggers", async job => {
  const { event, from } = job.data
  console.log(job.data)

  switch (from) {
    case "whatsapp":
      switch (event) {
        case "message":
          const { data: { from, content, instanceId, userId } } = job.data 

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
          const { data: { funilId, phone, name } } = job.data 

          const situation = JSON.parse(await _asyncNullishCoalesce(await redis.get(`conversation:${from}:${funilId}`), async () => ( "null")))

          let flow
          let instance

          if (situation) {
            flow = situation.flow
            instance = situation.instance
          } else {
            const res = await fetch(`${process.env.API_URL}/api/funis/${funilId}`)
            const data = await res.json()
            flow = JSON.parse(data.flow)

            const insances = data.instances.map((instance) => instance.instanceId)
            instance = insances[Math.floor(Math.random() * insances.length)]

            await redis.set(`conversation:${from}:${funilId}`, JSON.stringify({ flow, instance }))
          }

          const actions = flow.actions

          const matches = actions.filter((action) => action.type === "event" && action.data.typeId === "cart_abandonment")

          if (matches.length === 0) {
            return
          }

          for (const match of matches) {
            const message = actions.find((action) => action.id === match.next[0]).data.message
            const queue = new (0, _bullmq.Queue)(`MessagesSender:${instance}`, { connection: redis })

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
          const { data: { previus } } = job.data 

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
  console.log(`${_optionalChain([job, 'optionalAccess', _ => _.id])} has failed with ${err.message}`)
})
