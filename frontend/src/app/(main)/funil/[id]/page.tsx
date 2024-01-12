"use client"

import Card from "@/app/_components/Card"
import React, { useCallback } from "react"
import ReactFlow, { addEdge, useEdgesState, useNodesState } from "reactflow"
import "reactflow/dist/style.css"
import CopyButton from "../../redirect/_components/CopyButton"

const initialNodes = [
  { id: "1", position: { x: 0, y: 0 }, data: { label: "1" } },
  { id: "2", position: { x: 0, y: 100 }, data: { label: "2" } }
]

const initialEdges = [{ id: "e1-2", source: "1", target: "2" }]

export default () => {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)

  const onConnect = useCallback(
    (params: any) => setEdges((eds: any) => addEdge(params, eds)),
    [setEdges]
  )

  return (
    <div>
      <h1 className="text-5xl uppercase font-bold">Fúnil de mensagens</h1>
      <Card className="mt-5 flex flex-col gap-1">
        <span className="text-2xl font-semibold">Webhook</span>
        <input type="text" value={""} disabled className="bg-white focus:outline-none p-2 mt-1 block w-full rounded-md border border-3 border-gray-200 shadow-sm focus:ring focus:ring-green-500 focus:ring-opacity-50 font-semibold" />
        <CopyButton className="mt-1 ml-auto" text={""} />
      </Card>
      <Card style={{ height: 600 }} className="w-full mt-5">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
        />
      </Card>
    </div>
  )
}
