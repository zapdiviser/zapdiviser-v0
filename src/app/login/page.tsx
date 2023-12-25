"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Button from "../_components/Button"
import { signIn } from "next-auth/react"
import { NextPage } from "next"
import Link from "next/link"

const schema = z.object({
  email: z.string(),
  password: z.string()
})

type FormValues = z.infer<typeof schema>

const Page: NextPage<{ searchParams: { callbackUrl: string } }> = ({ searchParams: { callbackUrl } }) => {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur"
  })

  const onSubmit = handleSubmit(({ email, password }) => {
    signIn("credentials", { callbackUrl: callbackUrl ?? "/", email, password })
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 md:px-0 py-2">
      <h1 className="text-2xl font-bold mb-4">Entrar</h1>
      <form onSubmit={onSubmit} className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
        <div className="flex flex-col mb-4">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")} className="bg-white border border-gray-300 p-2 rounded-md" />
        </div>
        <div className="flex flex-col mb-8">
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" {...register("password")}  className="bg-white border border-gray-300 p-2 rounded-md" />
        </div>
        <Button className="w-full font-semibold" type="submit">Entrar</Button>
      </form>
      <span className="mt-4 text-center">Não tem uma conta? <Link href="/cadastro">Cadastre-se</Link></span>
    </div>
  )
}

export default Page
