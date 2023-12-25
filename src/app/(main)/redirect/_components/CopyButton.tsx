"use client"

import { twMerge } from "tailwind-merge"

type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement> & {
  text: string
}

const CopyButton: React.FC<Props> = ({ text, className, children, ...props }) => {
  return (
    <button className={twMerge("", className)} {...props} onClick={() => navigator.clipboard.writeText(text)}>{children}</button>
  )
}

export default CopyButton
