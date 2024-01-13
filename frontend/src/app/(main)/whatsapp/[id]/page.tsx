"use client"

import { NextPage } from "next"
import Pusher from "pusher-js"
import { useEffect, useState } from "react"
import { QRCodeSVG } from "qrcode.react"

const pusher = new Pusher("2cc10d3c15c82eab13cc", {
  cluster: "sa1"
})

const Page: NextPage<{ params: { id: string } }> = ({ params: { id } }) => {
  const [loading, setLoading] = useState(true)
  const [connecting, setConnecting] = useState(false)
  const [connected, setConnected] = useState(false)
  const [qr, setQr] = useState<string | null>(null)

  useEffect(() => {
    const channel = pusher.subscribe("goodly-grove-306")

    channel.bind(`whatsapp:${id}:qr`, (qr: string) => {
      setQr(qr)
    })

    channel.bind(`whatsapp:${id}:ready`, () => {
      setLoading(false)
    })

    channel.bind(`whatsapp:${id}:connecting`, () => {
      setConnecting(true)
    })

    channel.bind(`whatsapp:${id}:connected`, () => {
      setConnecting(false)
      setConnected(true)
    })

    return () => {
      pusher.unsubscribe("goodly-grove-306")
    }
  }, [])

  return (
    <div>
      <h1 className="text-5xl uppercase font-bold">WhatsApp</h1>
      {loading ? <span>Estamos subindo uma instância do WhatsApp Web para você. Esse processo geralmente leva cerca de 10 minutos.</span> : <>
        {!connected && qr && (
          <div className="mt-5">
            <QRCodeSVG value={qr} level="H" size={256} />
          </div>
        )}
        {connecting && <span>Conectando...</span>}
        {connected && <span>Conectado!</span>}
      </>}
    </div>
  )
}

export default Page
