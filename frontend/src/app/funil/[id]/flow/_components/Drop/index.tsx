import { useState } from "react"

interface DropProps {
  children: React.ReactNode
  text: string
}

const Drop: React.FC<DropProps> = ({ children, text }) => {
  const [opened, setOpened] = useState(false)

  return (
    <div>
      <button
        className="bg-white rounded rounded-lg text-black font-black p-2 text-xl w-full text-left"
        onClick={() => setOpened(!opened)}
      >
        {text}
      </button>
      {opened && (
        <div className="p-3">
          {children}
        </div>
      )}
    </div>
  )
}

export default Drop
