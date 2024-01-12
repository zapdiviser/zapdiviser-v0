"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import Button from "../_components/Button"
import { NextPage } from "next"
import { registerUser } from "./actions"

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  passwordConfirmation: z.string()
})
  .refine(data => data.password === data.passwordConfirmation, {
    message: "As senhas não conferem",
    path: ["passwordConfirmation"]
  })

type FormValues = z.infer<typeof schema>

const Page: NextPage<{ searchParams: { callbackUrl: string } }> = ({ searchParams: { callbackUrl } }) => {
  const { register, handleSubmit } = useForm<FormValues>({
    resolver: zodResolver(schema),
    mode: "onBlur"
  })

  const onSubmit = handleSubmit(({ email, password }) => {
    registerUser(email, password)
  })

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-5 md:px-0 py-2">
      <h1 className="text-2xl font-bold mb-4">Cadastro</h1>
      <form onSubmit={onSubmit} className="w-full md:w-1/3 lg:w-1/4 xl:w-1/5">
        <div className="flex flex-col mb-4">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" {...register("email")} className="bg-white border border-gray-300 p-2 rounded-md" />
        </div>
        <div className="flex flex-col mb-4">
          <label htmlFor="password">Senha</label>
          <input type="password" id="password" {...register("password")}  className="bg-white border border-gray-300 p-2 rounded-md" />
        </div>
        <div className="flex flex-col mb-8">
          <label htmlFor="passwordConfirmation">Confirmação de senha</label>
          <input type="password" id="passwordConfirmation" {...register("passwordConfirmation")}  className="bg-white border border-gray-300 p-2 rounded-md" />
        </div>
        <Button className="w-full font-semibold" type="submit">Cadastrar</Button>
      </form>
    </div>
  )
}

export default Page
