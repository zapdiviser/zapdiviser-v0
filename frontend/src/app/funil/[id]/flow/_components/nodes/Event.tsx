import { Handle, Position, Node, NodeProps, NodeToolbar } from "reactflow"
import eventTypes from "../../_utils/eventTypes"
import clsx from "clsx"
import NodeBase from "./Base"

interface Props {
  typeId: typeof eventTypes[number]["id"]
}

export type IEventsNode = Node<Props>

const EventsNode: React.FC<NodeProps<Props>> = ({ data, id, selected }) => {
  return (
    <NodeBase selected={selected} id={id}>
      <span className="font-black uppercase text-xs">Quando: {eventTypes.find(eventType => eventType.id === data.typeId)?.name}</span>
      <Handle type="source" position={Position.Right} id={`${id}-output`} />
    </NodeBase>
  )
}

export default EventsNode
