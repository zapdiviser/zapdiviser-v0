import prisma from "@/lib/prisma"
import queue from "@/lib/queue"
import { notFound } from "next/navigation"
import { NextResponse } from "next/server"
import _ from "lodash"

interface Handler {
  name: string
  detect: (data: any) => boolean
  phonePath: string
  namePath: string
  eventPath: string
  eventMap: Record<string, string>
}

const handlers: Handler[] = [
  {
    name: "perfectpay",
    detect: data => {
      return _.has(data, "costumer.phone_number")
    },
    phonePath: "costumer.phone_number",
    namePath: "costumer.full_name",
    eventPath: "sale_status_enum",
    eventMap: {
      12: "cart_abandoned",
    }
  },
  {
    name: "hotmart",
    detect: data => {
      return _.has(data, "data.buyer.phone")
    },
    phonePath: "data.buyer.phone",
    namePath: "data.buyer.name",
    eventPath: "event",
    eventMap: {
      "PURCHASE_OUT_OF_SHOPPING_CART": "cart_abandoned",
    }
  },
  {
    name: "kiwify_1",
    detect: data => {
      return _.has(data, "Customer.mobile")
    },
    phonePath: "Customer.full_name",
    namePath: "Customer.mobile",
    eventPath: "order_status",
    eventMap: {
      "paid": "order_paid"
    }
  },
  {
    name: "kiwify_2",
    detect: data => {
      return _.has(data, "phone")
    },
    phonePath: "phone",
    namePath: "name",
    eventPath: "status",
    eventMap: {
      "abandoned": "cart_abandoned"
    }
  },
  {
    name: "Eduzz",
    detect: data => {
      return _.has(data, "customer.phone")
    },
    phonePath: "customer.phone",
    namePath: "customer.name",
    eventPath: "event_name",
    eventMap: {
      "cart_abandonment": "cart_abandoned",
    }
  }
]

export async function POST(req: Request, { params: { id } }: { params: { id: string } }) {
  const funil = await prisma.funil.findUnique({
    where: {
      id
    }
  })

  if (funil === null) {
    return notFound()
  }

  const data = await req.json()

  const handler = handlers.find(handler => handler.detect(data))

  if (!handler) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const phone = _.get(data, handler.phonePath).replace(/\D/g, "")
  const name = _.get(data, handler.namePath).split(" ")[0]

  await queue.add("funil", {
    from: "webhook",
    event: handler.eventMap[_.get(data, handler.eventPath)],
    data: {
      funilId: id,
      phone,
      name
    }
  })

  return NextResponse.json({ ok: true })
}
