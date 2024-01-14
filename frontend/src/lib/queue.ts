import { Queue } from "bullmq"
import redis from "./redis"

const queue = new Queue("FlowTriggers", { connection: redis })

export default queue
