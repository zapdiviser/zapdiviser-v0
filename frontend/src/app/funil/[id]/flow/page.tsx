"use client"

import React, { useCallback, useState } from "react"
import ReactFlow, {
  Node,
  NodeTypes,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useEdgesState,
  useNodesState,
  Edge,
  OnConnect,
  ReactFlowProvider,
  ReactFlowInstance
} from "reactflow"
import "reactflow/dist/style.css"
import Drop from "./_components/Drop"
import Link from "next/link"
import { NextPage } from "next"
import MessageNode from "./_components/nodes/Message"
import { nanoid } from "nanoid"
import EventNode from "./_components/nodes/Event"

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

const nodeTypes: NodeTypes = {
  event: EventNode,
  message: MessageNode
}

const Page: NextPage<{ params: { id: string } }> = ({ params: { id } }) => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [reactFlowInstance, setReactFlowInstance] = useState<ReactFlowInstance | null>(null)

  const onConnect: OnConnect = useCallback(
    params => setEdges(eds => addEdge(params, eds)),
    [setEdges]
  )

  const onDragStart = (event: React.DragEvent<HTMLDivElement>, nodeType: string, data: any) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.setData("application/reactflow-data", JSON.stringify(data))
    event.dataTransfer.effectAllowed = "move"
  }

  const onDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault()

      const type = event.dataTransfer.getData("application/reactflow")

      if (typeof type === "undefined" || !type) {
        return
      }

      const data = JSON.parse(event.dataTransfer.getData("application/reactflow-data"))

      const position = reactFlowInstance?.screenToFlowPosition({
        x: event.clientX,
        y: event.clientY
      })!

      setNodes(nds => nds.concat([{
        id: nanoid(),
        type,
        position,
        data
      }]))
    },
    [reactFlowInstance]
  )

  return (
    <ReactFlowProvider>
      <div className="w-screen h-screen flex">
        <aside className="w-96 bg-gradient-to-r from-green-700 to-green-500 h-screen p-8 flex flex-col">
          <h1 className="font-black text-3xl uppercase text-white">Campanha</h1>
          <div className="mt-6 flex flex-col gap-4">
            <Drop text="Ações">
              <div className="font-black text-left rounded-lg p-1" onDragStart={event => onDragStart(event, "message", { message: "Insira a mensagem aqui" })} draggable>
                Enviar mensagem
              </div>
            </Drop>
            <Drop text="Eventos">
              <div className="font-black text-left rounded-lg p-1" onDragStart={event => onDragStart(event, "event", {})} draggable>
                Carrinho abandonado
              </div>
            </Drop>
          </div>
          <div className="mt-auto w-full flex flex-col gap-2 items-center justify-center">
            <Link className="text-black font-black text-xl py-1 px-2 rounded uppercase w-full text-center" href={`/funil/${id}`}>Sair sem salvar</Link>
            <button className="bg-white text-black font-black text-xl py-1 px-2 rounded uppercase w-full">Salvar</button>
          </div>
        </aside>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onDragOver={onDragOver}
          onDrop={onDrop}
          onInit={setReactFlowInstance}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
        >
          <Controls />
          <MiniMap />
          <Background gap={12} size={1} />
        </ReactFlow>
      </div>
    </ReactFlowProvider>
  )
}

export default Page
