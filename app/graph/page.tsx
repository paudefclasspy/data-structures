"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Undo, Plus, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Graph class
class Graph {
  adjacencyList: Map<string, string[]>

  constructor() {
    this.adjacencyList = new Map()
  }

  // Add a vertex
  addVertex(vertex: string) {
    if (!this.adjacencyList.has(vertex)) {
      this.adjacencyList.set(vertex, [])
    }
    return this
  }

  // Add an edge
  addEdge(vertex1: string, vertex2: string) {
    if (!this.adjacencyList.has(vertex1)) {
      this.addVertex(vertex1)
    }
    if (!this.adjacencyList.has(vertex2)) {
      this.addVertex(vertex2)
    }

    this.adjacencyList.get(vertex1)?.push(vertex2)
    this.adjacencyList.get(vertex2)?.push(vertex1)

    return this
  }

  // Remove an edge
  removeEdge(vertex1: string, vertex2: string) {
    if (this.adjacencyList.has(vertex1) && this.adjacencyList.has(vertex2)) {
      this.adjacencyList.set(vertex1, this.adjacencyList.get(vertex1)?.filter((v) => v !== vertex2) || [])
      this.adjacencyList.set(vertex2, this.adjacencyList.get(vertex2)?.filter((v) => v !== vertex1) || [])
    }
    return this
  }

  // Remove a vertex
  removeVertex(vertex: string) {
    if (!this.adjacencyList.has(vertex)) return this

    // Remove all edges connected to this vertex
    for (const adjacentVertex of this.adjacencyList.get(vertex) || []) {
      this.removeEdge(vertex, adjacentVertex)
    }

    // Remove the vertex
    this.adjacencyList.delete(vertex)

    return this
  }

  // Depth-first traversal
  depthFirstTraversal(start: string) {
    const result: string[] = []
    const visited = new Set<string>()

    const dfs = (vertex: string) => {
      if (!vertex) return

      visited.add(vertex)
      result.push(vertex)

      for (const neighbor of this.adjacencyList.get(vertex) || []) {
        if (!visited.has(neighbor)) {
          dfs(neighbor)
        }
      }
    }

    dfs(start)
    return result
  }

  // Breadth-first traversal
  breadthFirstTraversal(start: string) {
    const queue: string[] = [start]
    const result: string[] = []
    const visited = new Set<string>()
    visited.add(start)

    while (queue.length) {
      const currentVertex = queue.shift()!
      result.push(currentVertex)

      for (const neighbor of this.adjacencyList.get(currentVertex) || []) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor)
          queue.push(neighbor)
        }
      }
    }

    return result
  }

  // Get all vertices
  getVertices() {
    return Array.from(this.adjacencyList.keys())
  }

  // Get all edges
  getEdges() {
    const edges: [string, string][] = []
    const visited = new Set<string>()

    for (const [vertex, neighbors] of this.adjacencyList.entries()) {
      for (const neighbor of neighbors) {
        // Create a unique key for the edge to avoid duplicates
        const edgeKey = [vertex, neighbor].sort().join("-")

        if (!visited.has(edgeKey)) {
          visited.add(edgeKey)
          edges.push([vertex, neighbor])
        }
      }
    }

    return edges
  }
}

// Node positions for visualization
interface NodePosition {
  id: string
  x: number
  y: number
}

export default function GraphPage() {
  const [graph] = useState(new Graph())
  const [vertices, setVertices] = useState<string[]>([])
  const [edges, setEdges] = useState<[string, string][]>([])
  const [nodePositions, setNodePositions] = useState<NodePosition[]>([])
  const [vertexName, setVertexName] = useState("")
  const [sourceVertex, setSourceVertex] = useState("")
  const [targetVertex, setTargetVertex] = useState("")
  const [traversalType, setTraversalType] = useState("dfs")
  const [traversalStart, setTraversalStart] = useState("")
  const [traversalResult, setTraversalResult] = useState<string[]>([])
  const [traversalStep, setTraversalStep] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [operationDescription, setOperationDescription] = useState("")
  const canvasRef = useRef<HTMLDivElement>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update the graph visualization
  const updateGraph = () => {
    setVertices(graph.getVertices())
    setEdges(graph.getEdges())

    // Update node positions if new nodes were added
    const currentVertices = graph.getVertices()
    const newPositions = [...nodePositions]

    // Add positions for new vertices
    for (const vertex of currentVertices) {
      if (!newPositions.some((pos) => pos.id === vertex)) {
        // Calculate a random position within the canvas
        const canvasWidth = canvasRef.current?.clientWidth || 500
        const canvasHeight = canvasRef.current?.clientHeight || 300
        const padding = 50

        newPositions.push({
          id: vertex,
          x: Math.random() * (canvasWidth - padding * 2) + padding,
          y: Math.random() * (canvasHeight - padding * 2) + padding,
        })
      }
    }

    // Remove positions for deleted vertices
    const updatedPositions = newPositions.filter((pos) => currentVertices.includes(pos.id))

    setNodePositions(updatedPositions)
  }

  // Clear any ongoing animations
  const clearAnimation = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
    setTraversalStep(0)
    setTraversalResult([])
    setIsAnimating(false)
  }

  // Handle adding a vertex
  const handleAddVertex = () => {
    if (!vertexName.trim()) return

    clearAnimation()
    setOperationDescription(`Adding vertex "${vertexName}"`)

    graph.addVertex(vertexName)
    updateGraph()
    setVertexName("")
  }

  // Handle adding an edge
  const handleAddEdge = () => {
    if (!sourceVertex || !targetVertex || sourceVertex === targetVertex) return

    clearAnimation()
    setOperationDescription(`Adding edge from "${sourceVertex}" to "${targetVertex}"`)

    graph.addEdge(sourceVertex, targetVertex)
    updateGraph()
  }

  // Handle removing a vertex
  const handleRemoveVertex = (vertex: string) => {
    clearAnimation()
    setOperationDescription(`Removing vertex "${vertex}"`)

    graph.removeVertex(vertex)
    updateGraph()

    // Reset selected vertices if they were removed
    if (sourceVertex === vertex) setSourceVertex("")
    if (targetVertex === vertex) setTargetVertex("")
    if (traversalStart === vertex) setTraversalStart("")
  }

  // Handle removing an edge
  const handleRemoveEdge = (source: string, target: string) => {
    clearAnimation()
    setOperationDescription(`Removing edge from "${source}" to "${target}"`)

    graph.removeEdge(source, target)
    updateGraph()
  }

  // Handle graph traversal
  const handleTraversal = () => {
    if (!traversalStart) return

    clearAnimation()
    setIsAnimating(true)

    const result =
      traversalType === "dfs" ? graph.depthFirstTraversal(traversalStart) : graph.breadthFirstTraversal(traversalStart)

    setTraversalResult(result)
    setOperationDescription(
      `${traversalType === "dfs" ? "Depth-First" : "Breadth-First"} Traversal starting from "${traversalStart}"`,
    )

    // Animate the traversal
    let step = 0
    const animateTraversal = () => {
      if (step >= result.length) {
        // Animation complete
        animationTimeoutRef.current = setTimeout(() => {
          clearAnimation()
        }, 1000)
        return
      }

      setTraversalStep(step + 1)
      step++
      animationTimeoutRef.current = setTimeout(animateTraversal, 800)
    }

    animateTraversal()
  }

  // Handle node dragging - Mouse Events
  const handleNodeMouseDown = (nodeId: string, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault() // Prevent default actions
    setDraggedNode(nodeId)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggedNode || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setNodePositions((prev) => prev.map((node) => (node.id === draggedNode ? { ...node, x, y } : node)))
  }

  // Handle touch events for mobile devices
  const handleTouchMove = (e: React.TouchEvent) => {
    if (!draggedNode || !canvasRef.current || e.touches.length === 0) return

    e.preventDefault() // Prevent scrolling while dragging
    
    const rect = canvasRef.current.getBoundingClientRect()
    const touch = e.touches[0]
    const x = touch.clientX - rect.left
    const y = touch.clientY - rect.top

    setNodePositions((prev) => prev.map((node) => (node.id === draggedNode ? { ...node, x, y } : node)))
  }

  const handleDragEnd = () => {
    setDraggedNode(null)
  }

  // Reset the graph
  const handleReset = () => {
    clearAnimation()

    // Create a new graph
    for (const vertex of vertices) {
      graph.removeVertex(vertex)
    }

    updateGraph()
    setSourceVertex("")
    setTargetVertex("")
    setTraversalStart("")
  }

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Initialize the graph with some example vertices and edges
  useEffect(() => {
    if (vertices.length === 0) {
      graph.addVertex("A")
      graph.addVertex("B")
      graph.addVertex("C")
      graph.addVertex("D")
      graph.addEdge("A", "B")
      graph.addEdge("A", "C")
      graph.addEdge("B", "D")
      graph.addEdge("C", "D")
      updateGraph()
    }
  }, [graph, vertices.length])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-white/10 bg-black/20">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold text-white">
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Home</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 py-8">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-5xl">
            <div className="flex flex-col gap-8">
              <div>
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                  Graph Visualization
                </h1>
                <p className="mt-2 text-lg text-white/80">Visualize operations on a graph data structure</p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Card className="card-gradient">
                    <CardHeader>
                      <CardTitle className="text-white">Visualization</CardTitle>
                      <CardDescription className="text-white/70">Visual representation of the graph</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        ref={canvasRef}
                        className="relative h-[400px] border rounded-md bg-muted/30"
                        onMouseMove={handleMouseMove}
                        onMouseUp={handleDragEnd}
                        onMouseLeave={handleDragEnd}
                        onTouchMove={handleTouchMove}
                        onTouchEnd={handleDragEnd}
                        onTouchCancel={handleDragEnd}
                      >
                        {/* Edges */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          {edges.map(([source, target], index) => {
                            const sourcePos = nodePositions.find((node) => node.id === source)
                            const targetPos = nodePositions.find((node) => node.id === target)

                            if (!sourcePos || !targetPos) return null

                            // Check if this edge is part of the traversal
                            const sourceIndex = traversalResult.indexOf(source)
                            const targetIndex = traversalResult.indexOf(target)
                            const isTraversed =
                              sourceIndex >= 0 &&
                              targetIndex >= 0 &&
                              Math.abs(sourceIndex - targetIndex) === 1 &&
                              Math.max(sourceIndex, targetIndex) <= traversalStep

                            const isHighlighted = isTraversed && isAnimating

                            return (
                              <line
                                key={`${source}-${target}-${index}`}
                                x1={sourcePos.x}
                                y1={sourcePos.y}
                                x2={targetPos.x}
                                y2={targetPos.y}
                                stroke={isHighlighted ? "hsl(252, 100%, 69%)" : "hsl(var(--muted-foreground))"}
                                strokeWidth={isHighlighted ? 4 : 1.5}
                                strokeOpacity={isHighlighted ? 1 : 0.6}
                                className={isHighlighted ? "filter drop-shadow-[0_0_8px_rgba(168,85,247,0.6)]" : ""}
                                strokeDasharray={isHighlighted ? "none" : "none"}
                              />
                            )
                          })}
                        </svg>

                        {/* Vertices */}
                        {nodePositions.map((node, index) => {
                          const isTraversed =
                            traversalResult.includes(node.id) && traversalResult.indexOf(node.id) < traversalStep
                          const isActive = traversalResult[traversalStep - 1] === node.id

                          return (
                            <div
                              key={node.id}
                              className={`
                                absolute flex items-center justify-center w-12 h-12 rounded-full 
                                border-2 cursor-move select-none touch-none
                                ${
                                  isActive
                                    ? "border-purple-500 bg-purple-900 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                    : isTraversed
                                      ? "border-purple-400 bg-purple-800/50 text-white shadow-[0_0_10px_rgba(168,85,247,0.3)]"
                                      : "border-muted-foreground bg-background"
                                }
                                transition-colors duration-300
                              `}
                              style={{
                                left: `${node.x - 24}px`,
                                top: `${node.y - 24}px`,
                              }}
                              onMouseDown={(e) => handleNodeMouseDown(node.id, e)}
                              onTouchStart={(e) => handleNodeMouseDown(node.id, e)}
                            >
                              {node.id}

                              {/* Remove vertex button */}
                              <button
                                className="absolute -top-2 -right-2 w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  handleRemoveVertex(node.id)
                                }}
                              >
                                ×
                              </button>
                            </div>
                          )
                        })}

                        {/* Edge removal indicators */}
                        {edges.map(([source, target], index) => {
                          const sourcePos = nodePositions.find((node) => node.id === source)
                          const targetPos = nodePositions.find((node) => node.id === target)

                          if (!sourcePos || !targetPos) return null

                          // Calculate the midpoint of the edge
                          const midX = (sourcePos.x + targetPos.x) / 2
                          const midY = (sourcePos.y + targetPos.y) / 2

                          return (
                            <button
                              key={`remove-${source}-${target}-${index}`}
                              className="absolute w-5 h-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs transform -translate-x-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
                              style={{
                                left: `${midX}px`,
                                top: `${midY}px`,
                              }}
                              onClick={() => handleRemoveEdge(source, target)}
                            >
                              ×
                            </button>
                          )
                        })}
                      </div>

                      {/* Operation description */}
                      {operationDescription && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="font-medium">{operationDescription}</p>
                          {isAnimating && (
                            <p className="text-sm text-muted-foreground mt-1">
                              {traversalStep === traversalResult.length
                                ? "Traversal completed"
                                : `Visiting node ${traversalResult[traversalStep - 1] || ""}`}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Reset button */}
                      <div className="mt-4 flex justify-end">
                        <Button variant="outline" size="sm" onClick={handleReset}>
                          <Undo className="mr-2 h-4 w-4" />
                          Reset Graph
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="card-gradient">
                    <CardHeader>
                      <CardTitle className="text-white">Operations</CardTitle>
                      <CardDescription className="text-white/70">Perform operations on the graph</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="vertex" className="w-full">
                        <TabsList className="w-full">
                          <TabsTrigger value="vertex" className="flex-1">
                            Add Vertex
                          </TabsTrigger>
                          <TabsTrigger value="edge" className="flex-1">
                            Add Edge
                          </TabsTrigger>
                          <TabsTrigger value="traversal" className="flex-1">
                            Traverse
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="vertex" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">Vertex Name</label>
                            <Input
                              placeholder="Enter vertex name"
                              value={vertexName}
                              onChange={(e) => setVertexName(e.target.value)}
                              disabled={isAnimating}
                            />
                          </div>

                          <Button
                            className="w-full"
                            onClick={handleAddVertex}
                            disabled={!vertexName.trim() || isAnimating}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Vertex
                          </Button>
                        </TabsContent>

                        <TabsContent value="edge" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">Source Vertex</label>
                            <Select value={sourceVertex} onValueChange={setSourceVertex} disabled={isAnimating}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select source" />
                              </SelectTrigger>
                              <SelectContent>
                                {vertices.map((vertex) => (
                                  <SelectItem key={vertex} value={vertex}>
                                    {vertex}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">Target Vertex</label>
                            <Select value={targetVertex} onValueChange={setTargetVertex} disabled={isAnimating}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select target" />
                              </SelectTrigger>
                              <SelectContent>
                                {vertices
                                  .filter((v) => v !== sourceVertex)
                                  .map((vertex) => (
                                    <SelectItem key={vertex} value={vertex}>
                                      {vertex}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            className="w-full"
                            onClick={handleAddEdge}
                            disabled={!sourceVertex || !targetVertex || sourceVertex === targetVertex || isAnimating}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Add Edge
                          </Button>
                        </TabsContent>

                        <TabsContent value="traversal" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">Traversal Type</label>
                            <Select value={traversalType} onValueChange={setTraversalType} disabled={isAnimating}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="dfs">Depth-First Search (DFS)</SelectItem>
                                <SelectItem value="bfs">Breadth-First Search (BFS)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-white/90">Start Vertex</label>
                            <Select value={traversalStart} onValueChange={setTraversalStart} disabled={isAnimating}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select start vertex" />
                              </SelectTrigger>
                              <SelectContent>
                                {vertices.map((vertex) => (
                                  <SelectItem key={vertex} value={vertex}>
                                    {vertex}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>

                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={handleTraversal}
                            disabled={!traversalStart || isAnimating}
                          >
                            Start Traversal
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <Card className="mt-6 card-gradient">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Info className="h-5 w-5 text-purple-400" />
                        Graph Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-medium text-white">Structure</h4>
                          <p className="text-white/70 mt-1">
                            A graph consists of a set of vertices (nodes) and a set of edges connecting these vertices.
                            This implementation uses an adjacency list representation.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-white">Time Complexity</h4>
                          <div className="flex justify-between">
                            <span className="text-white/70">Add Vertex:</span>
                            <span className="font-mono text-purple-300">O(1)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Add Edge:</span>
                            <span className="font-mono text-purple-300">O(1)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Remove Vertex:</span>
                            <span className="font-mono text-purple-300">O(|V| + |E|)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Remove Edge:</span>
                            <span className="font-mono text-purple-300">O(|E|)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">DFS/BFS Traversal:</span>
                            <span className="font-mono text-purple-300">O(|V| + |E|)</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-white">Applications</h4>
                          <ul className="list-disc list-inside text-white/70 mt-1">
                            <li>Social networks</li>
                            <li>Web page ranking</li>
                            <li>Route planning and navigation</li>
                            <li>Network topology</li>
                            <li>Dependency resolution</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <footer className="border-t border-white/10 py-6 bg-black/20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <p className="text-center text-sm text-white/60">Data Structures Visualizer - An interactive learning tool</p>
        </div>
      </footer>
    </div>
  )
}