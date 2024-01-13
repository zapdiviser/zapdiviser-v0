"use client"

import { NextPage } from "next"
import Pusher from "pusher-js"
import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"

const pusher = new Pusher("2cc10d3c15c82eab13cc", {
  cluster: "sa1"
})

const Page: NextPage<{ params: { id: string } }> = ({ params: { id } }) => {
  const [qr, setQr] = useState<string | null>(null)

  useEffect(() => {
    const channel = pusher.subscribe(`whatsapp:${id}`)

    channel.bind("qr", (qr: string) => {
      setQr(qr)
    })

    return () => {
      pusher.unsubscribe(`whatsapp:${id}`)
    }
  }, [])

  return (
    <div>
      <h1 className="text-5xl uppercase font-bold">WhatsApp</h1>
      {qr && (
        <div className="mt-5">
          <QRCodeSVG value={qr} />
        </div>
      )}
    </div>
  )
}

export default Page
