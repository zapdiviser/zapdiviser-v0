import { UpstashRedisAdapter } from "@auth/upstash-redis-adapter"
import redis from "@/lib/redis"
import argon2 from "argon2"
import { Resend } from "resend"
import { nanoid } from "nanoid"
import CreatedEmail from "@/emails/created"
import RegularizeEmail from "@/emails/resularize"

const resend = new Resend(process.env.RESEND_API_KEY)
const adapter = UpstashRedisAdapter(redis)

export async function POST(req: Request) {
  const data = await req.json()

  if (data.token !== process.env.WEBHOOK_TOKEN) {
    return new Response("Unauthorized", { status: 401 })
  }

  const email = data.customer.email as string

  let user = await adapter.getUserByEmail?.(email)

  if (!user) {
    user = await adapter.createUser?.({
      name: email,
      email,
      emailVerified: new Date(),
      id: email
    })

    const password = nanoid(10)

    await redis.set(`user-${user?.id}:password`, await argon2.hash(password))

    await resend.emails.send({
      to: [email],
      from: "Acme <onboarding@resend.dev>",
      subject: "Obrigado por adquirir o ZapDiviser!",
      react: <CreatedEmail password={password} />
    })
  }

  let active: boolean

  switch (data.sale_status_enum_key) {
    case "approved":
      active = true
      break
    case "completed":
      active = true
      break
    default:
      active = false
  }

  await redis.set(`user-${user?.id}:active`, active)

  if (active) {
    await resend.emails.send({
      to: email,
      from: "vem-questoes.vadolasi.dev",
      subject: "Regularize sua conta",
      react: <RegularizeEmail />
    })
  }

  return new Response("OK")
}
