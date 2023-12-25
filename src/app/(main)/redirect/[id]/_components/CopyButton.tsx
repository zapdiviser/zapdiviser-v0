"use client"

import Button from "@/app/_components/Button"
import { twMerge } from "tailwind-merge"

type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  text: string
}

const CopyButton: React.FC<Props> = ({ text, className, ...props }) => {
  return (
    <Button className={twMerge("mt-1 ml-auto", className)} {...props} onClick={() => navigator.clipboard.writeText(text)}>Copiar</Button>
  )
}

export default CopyButton
