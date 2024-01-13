import argon2 from "argon2"
import { Resend } from "resend"
import { nanoid } from "nanoid"
import CreatedEmail from "@/emails/created"
import RegularizeEmail from "@/emails/resularize"
import prisma from "@/lib/prisma"
import { PrismaAdapter } from "@auth/prisma-adapter"

const adapter = PrismaAdapter(prisma)

export async function POST(req: Request) {
  const resend = new Resend(process.env.RESEND_API_KEY)

  const data = await req.json()

  if (data.token !== process.env.WEBHOOK_TOKEN) {
    return new Response("Unauthorized", { status: 401 })
  }

  const email = data.customer.email as string
  const name = data.customer.name as string

  let user = await adapter.getUserByEmail?.(email)

  if (!user) {
    const password = nanoid(10)

    await prisma.user.create({
      data: {
        email,
        name,
        emailVerified: new Date(),
        password: await argon2.hash(password)
      }
    })

    const { error } = await resend.emails.send({
      to: [email],
      from: "ZapDiviser <zapdiviser@vem-questoes.vadolasi.dev>",
      subject: "Obrigado por adquirir o ZapDiviser!",
      react: CreatedEmail({ password })
    })

    if (error) {
      console.error(error)
    }
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

  await prisma.user.update({
    where: {
      id: user?.id
    },
    data: {
      isActivated: active
    }
  })

  if (!active) {
    await resend.emails.send({
      to: email,
      from: "ZapDiviser <zapdiviser@vem-questoes.vadolasi.dev>",
      subject: "Regularize sua conta",
      react: RegularizeEmail({})
    })
  }

  return new Response("OK")
}
