import { Handle, Position, Node, NodeProps } from "reactflow"
import eventTypes from "../../_utils/eventTypes"

interface Props {
  typeId: typeof eventTypes[number]["id"]
}

export type IEventsNode = Node<Props>

const EventsNode: React.FC<NodeProps<Props>> = ({ data, id }) => {
  return (
    <div className="bg-white rounded p-2 border border-black">
      <span className="font-black uppercase text-xs">Quando: {eventTypes.find(eventType => eventType.id === data.typeId)?.name}</span>
      <Handle type="source" position={Position.Right} id={`${id}-output`} />
    </div>
  )
}

export default EventsNode
