"use client"

import Card from "@/app/_components/Card"
import Select from "react-select"

const Instances: React.FC<{ options: { value: string, label: string }[] }> = ({ options }) => {
  return (
    <Card className="mt-5">
      <label className="text-2xl font-semibold" htmlFor="instances">
        Whatsapp conectados
      </label>
      <Select isMulti options={options} />
    </Card>
  )
}

export default Instances
