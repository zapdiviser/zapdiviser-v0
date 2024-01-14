"use client"

import Button from "@/app/_components/Button"
import Card from "@/app/_components/Card"
import Select from "react-select"
import { saveConectedInsances } from "../_actions/actions"
import { useState } from "react"

const Instances: React.FC<{ id: string, options: { value: string, label: string }[], initialSelected: { value: string, label: string }[] }> = ({ id, options, initialSelected }) => {
  const [selected, setSelected] = useState(initialSelected)

  return (
    <Card className="flex flex-col gap-1">
      <form action={saveConectedInsances}>
        <label className="text-2xl font-semibold" htmlFor="instances">
          Whatsapp conectados
        </label>
        <Select isMulti options={options} value={selected} onChange={ev => setSelected(ev as any)} />
        <input type="hidden" name="id" value={id} />
        <input type="hidden" name="instances" value={JSON.stringify(selected.map(option => option.value))} />
        <Button className="mt-1 ml-auto" type="submit">
          Salvar
        </Button>
      </form>
    </Card>
  )
}

export default Instances
