import clsx from "clsx"
import { NodeToolbar, Position, useReactFlow } from "reactflow"
import { FaTrash, FaEdit } from "react-icons/fa"

interface Props {
  children: React.ReactNode
  selected: boolean
  id: string
}

const NodeBase: React.FC<Props> = ({ children, selected, id }) => {
  const { setNodes } = useReactFlow()

  const remove = () => {
    setNodes(nodes => nodes.filter(node => node.id !== id))
  }

  return (
    <div className={clsx("bg-white rounded p-2 border border-black", selected && "outline-dashed outline-1 outline-offset-1")}>
      <NodeToolbar isVisible={selected} position={Position.Bottom}>
        <div className="bg-white rounded p-2 shadow flex gap-3 text-lg">
          <button className="text-red-600" onClick={remove}>
            <FaTrash />
          </button>
          <button>
            <FaEdit />
          </button>
        </div>
      </NodeToolbar>
      {children}
    </div>
  )
}

export default NodeBase
