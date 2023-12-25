import { twMerge } from "tailwind-merge"

type Props = React.DetailedHTMLProps<React.ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>

const Button: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <button className={twMerge("bg-gradient-to-r from-green-600 to-green-500 hover:bg-green-700 text-white text-xl py-1 px-2 rounded uppercase", className)} {...props}>
      {children}
    </button>
  )
}

export default Button
