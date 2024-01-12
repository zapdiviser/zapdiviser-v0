import Redis from "ioredis"
import dotenv from "dotenv"

dotenv.config()

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: parseInt(process.env.REDIS_PORT!)
})

export default redis
