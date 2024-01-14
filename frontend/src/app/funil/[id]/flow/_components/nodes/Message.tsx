import { useState } from "react"
import { Handle, Position, NodeProps, Node, useReactFlow } from "reactflow"
import Modal from "react-modal"
import Button from "@/app/_components/Button"

interface Props {
  message: string
}

export type IMessageNode = Node<Props>

const MessageNode: React.FC<NodeProps<Props>> = ({ data, id }) => {
  const { setNodes } = useReactFlow()

  const [message, setMessage] = useState(data.message)

  const save = () => {
    setIsOpen(false)
    setNodes((nodes) => nodes.map((node) => {
      if (node.id === id) {
        return {
          ...node,
          data: {
            ...node.data,
            message
          }
        }
      }

      return node
    }))
  }

  const closeWithoutSave = () => {
    setIsOpen(false)
    setMessage(data.message)
  }

  const [modalIsOpen, setIsOpen] = useState(false)

  return (
    <div className="bg-white rounded p-2 border border-black" style={{ pointerEvents: "all" }}>
      <Handle type="target" position={Position.Left} id={`${id}-input`} />
      <h1 className="font-black uppercase text-xs">Enviar mensagem</h1>
      <div className="text-xs max-w-48 text-ellipsis overflow-hidden line-clamp-6 truncate break-all text-wrap" onClick={() => setIsOpen(true)}>
        {data.message}
      </div>
      <Modal
        isOpen={modalIsOpen}
        className="w-96 m-auto bg-white rounded p-2 border transform translate-y-1/2"
        onRequestClose={closeWithoutSave}
        ariaHideApp={false}
      >
        <h1 className="font-black text-xl uppercase">Editar mensagem</h1>
        <textarea className="w-full h-32 bg-white border mt-3 p-2 max-h-96 h-32" value={message} onChange={evt => setMessage(evt.target.value)} />
        <Button className="mt-3 w-full" onClick={save}>Salvar</Button>
      </Modal>
      <Handle type="source" position={Position.Right} id={`${id}-output`} />
    </div>
  )
}

export default MessageNode
