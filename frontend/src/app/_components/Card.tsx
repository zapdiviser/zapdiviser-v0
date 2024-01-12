import { twMerge } from "tailwind-merge"

type Props = React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>

const Card: React.FC<Props> = ({ children, className, ...props }) => {
  return (
    <div className={twMerge("bg-white shadow-xl rounded-md p-4", className)} {...props}>
      {children}
    </div>
  )
}

export default Card
