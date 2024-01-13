import { Queue } from "bullmq"
import redis from "./redis"

const queue = new Queue("Flows", { connection: redis })

export default queue
