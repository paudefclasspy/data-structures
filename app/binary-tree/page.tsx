"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Info, Plus, Search, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Binary Tree Node class
class TreeNode {
  value: number
  left: TreeNode | null
  right: TreeNode | null
  x: number
  y: number

  constructor(value: number) {
    this.value = value
    this.left = null
    this.right = null
    this.x = 0
    this.y = 0
  }
}

// Binary Search Tree class
class BinarySearchTree {
  root: TreeNode | null

  constructor() {
    this.root = null
  }

  // Insert a value
  insert(value: number) {
    const newNode = new TreeNode(value)

    if (!this.root) {
      this.root = newNode
      return this
    }

    const insertNode = (node: TreeNode, newNode: TreeNode) => {
      // Go left if value is less than current node
      if (newNode.value < node.value) {
        if (node.left === null) {
          node.left = newNode
        } else {
          insertNode(node.left, newNode)
        }
      }
      // Go right if value is greater than current node
      else if (newNode.value > node.value) {
        if (node.right === null) {
          node.right = newNode
        } else {
          insertNode(node.right, newNode)
        }
      }
      // Value already exists, do nothing
    }

    insertNode(this.root, newNode)
    return this
  }

  // Search for a value
  search(value: number): TreeNode | null {
    const searchNode = (node: TreeNode | null, value: number): TreeNode | null => {
      if (node === null) {
        return null
      }

      if (value === node.value) {
        return node
      }

      if (value < node.value) {
        return searchNode(node.left, value)
      }

      return searchNode(node.right, value)
    }

    return searchNode(this.root, value)
  }

  // Find the path to a node
  findPath(value: number): TreeNode[] {
    const path: TreeNode[] = []

    const findPathNode = (node: TreeNode | null, value: number): boolean => {
      if (node === null) {
        return false
      }

      path.push(node)

      if (node.value === value) {
        return true
      }

      if (value < node.value) {
        if (findPathNode(node.left, value)) {
          return true
        }
      } else {
        if (findPathNode(node.right, value)) {
          return true
        }
      }

      path.pop()
      return false
    }

    findPathNode(this.root, value)
    return path
  }

  // Delete a node
  delete(value: number) {
    const removeNode = (node: TreeNode | null, value: number): TreeNode | null => {
      if (node === null) {
        return null
      }

      if (value < node.value) {
        node.left = removeNode(node.left, value)
        return node
      }

      if (value > node.value) {
        node.right = removeNode(node.right, value)
        return node
      }

      // Value found, now delete

      // Case 1: Leaf node (no children)
      if (node.left === null && node.right === null) {
        return null
      }

      // Case 2: Node with only one child
      if (node.left === null) {
        return node.right
      }

      if (node.right === null) {
        return node.left
      }

      // Case 3: Node with two children
      // Find the minimum value in the right subtree
      let successor = node.right
      while (successor.left !== null) {
        successor = successor.left
      }

      // Replace the node's value with the successor's value
      node.value = successor.value

      // Delete the successor
      node.right = removeNode(node.right, successor.value)

      return node
    }

    this.root = removeNode(this.root, value)
    return this
  }

  // In-order traversal (left, root, right)
  inOrderTraversal(): number[] {
    const result: number[] = []

    const traverse = (node: TreeNode | null) => {
      if (node !== null) {
        traverse(node.left)
        result.push(node.value)
        traverse(node.right)
      }
    }

    traverse(this.root)
    return result
  }

  // Pre-order traversal (root, left, right)
  preOrderTraversal(): number[] {
    const result: number[] = []

    const traverse = (node: TreeNode | null) => {
      if (node !== null) {
        result.push(node.value)
        traverse(node.left)
        traverse(node.right)
      }
    }

    traverse(this.root)
    return result
  }

  // Post-order traversal (left, right, root)
  postOrderTraversal(): number[] {
    const result: number[] = []

    const traverse = (node: TreeNode | null) => {
      if (node !== null) {
        traverse(node.left)
        traverse(node.right)
        result.push(node.value)
      }
    }

    traverse(this.root)
    return result
  }

  // Calculate positions for visualization
  calculatePositions() {
    if (!this.root) return

    const nodeWidth = 40
    const levelHeight = 70
    const getWidth = (node: TreeNode | null): number => {
      if (!node) return 0
      return getWidth(node.left) + nodeWidth + getWidth(node.right)
    }

    const setPositions = (node: TreeNode | null, x: number, y: number, level: number) => {
      if (!node) return

      const leftWidth = getWidth(node.left)

      node.x = x
      node.y = y

      if (node.left) {
        setPositions(node.left, x - leftWidth / 2, y + levelHeight, level + 1)
      }

      if (node.right) {
        setPositions(node.right, x + leftWidth / 2 + nodeWidth, y + levelHeight, level + 1)
      }
    }

    const totalWidth = getWidth(this.root)
    setPositions(this.root, totalWidth / 2, 40, 0)
  }

  // Get all nodes for visualization
  getAllNodes(): TreeNode[] {
    const nodes: TreeNode[] = []

    const traverse = (node: TreeNode | null) => {
      if (node !== null) {
        nodes.push(node)
        traverse(node.left)
        traverse(node.right)
      }
    }

    traverse(this.root)
    return nodes
  }

  // Get all edges for visualization
  getAllEdges(): { from: TreeNode; to: TreeNode }[] {
    const edges: { from: TreeNode; to: TreeNode }[] = []

    const traverse = (node: TreeNode | null) => {
      if (node !== null) {
        if (node.left) {
          edges.push({ from: node, to: node.left })
          traverse(node.left)
        }

        if (node.right) {
          edges.push({ from: node, to: node.right })
          traverse(node.right)
        }
      }
    }

    traverse(this.root)
    return edges
  }
}

export default function BinaryTreePage() {
  const [bst] = useState(() => new BinarySearchTree())
  const [nodes, setNodes] = useState<TreeNode[]>([])
  const [edges, setEdges] = useState<{ from: TreeNode; to: TreeNode }[]>([])
  const [value, setValue] = useState("")
  const [searchValue, setSearchValue] = useState("")
  const [traversalType, setTraversalType] = useState("inorder")
  const [traversalResult, setTraversalResult] = useState<number[]>([])
  const [animationStep, setAnimationStep] = useState(0)
  const [animationPath, setAnimationPath] = useState<TreeNode[]>([])
  const [animationIndex, setAnimationIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [operationDescription, setOperationDescription] = useState("")
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 })
  const canvasRef = useRef<HTMLDivElement>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update the tree visualization
  const updateTree = () => {
    bst.calculatePositions()
    setNodes(bst.getAllNodes())
    setEdges(bst.getAllEdges())
  }

  // Clear any ongoing animations
  const clearAnimation = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
    setAnimationStep(0)
    setAnimationPath([])
    setAnimationIndex(0)
    setIsAnimating(false)
  }

  // Handle insert operation
  const handleInsert = () => {
    if (!value || isNaN(Number(value))) return

    const numValue = Number(value)
    clearAnimation()
    setIsAnimating(true)
    setOperationDescription(`Inserting ${numValue} into the tree`)

    // Find the path where the new node will be inserted
    const path = bst.findPath(numValue)
    setAnimationPath(path)

    // Step 1: Animate traversal to find insertion point
    const animateTraversal = (index: number) => {
      if (index >= path.length) {
        // Step 2: Insert the node
        bst.insert(numValue)
        updateTree()
        setAnimationStep(2)

        // Step 3: Complete
        animationTimeoutRef.current = setTimeout(() => {
          clearAnimation()
          setValue("")
        }, 1000)
        return
      }

      setAnimationIndex(index)
      setAnimationStep(1)

      animationTimeoutRef.current = setTimeout(() => {
        animateTraversal(index + 1)
      }, 800)
    }

    animateTraversal(0)
  }

  // Handle search operation
  const handleSearch = () => {
    if (!searchValue || isNaN(Number(searchValue))) return

    const numValue = Number(searchValue)
    clearAnimation()
    setIsAnimating(true)
    setOperationDescription(`Searching for ${numValue} in the tree`)

    // Find the path to the node
    const path = bst.findPath(numValue)
    setAnimationPath(path)

    // Step 1: Animate traversal to find the node
    const animateTraversal = (index: number) => {
      if (index >= path.length) {
        // Node not found
        setAnimationStep(4)

        // Complete
        animationTimeoutRef.current = setTimeout(() => {
          clearAnimation()
        }, 1000)
        return
      }

      setAnimationIndex(index)
      setAnimationStep(1)

      if (path[index].value === numValue) {
        // Node found
        animationTimeoutRef.current = setTimeout(() => {
          setAnimationStep(3)

          // Complete
          animationTimeoutRef.current = setTimeout(() => {
            clearAnimation()
          }, 1000)
        }, 800)
        return
      }

      animationTimeoutRef.current = setTimeout(() => {
        animateTraversal(index + 1)
      }, 800)
    }

    animateTraversal(0)
  }

  // Handle delete operation
  const handleDelete = () => {
    if (!searchValue || isNaN(Number(searchValue))) return

    const numValue = Number(searchValue)
    clearAnimation()
    setIsAnimating(true)
    setOperationDescription(`Deleting ${numValue} from the tree`)

    // Find the path to the node
    const path = bst.findPath(numValue)
    setAnimationPath(path)

    // Step 1: Animate traversal to find the node
    const animateTraversal = (index: number) => {
      if (index >= path.length) {
        // Node not found
        setAnimationStep(4)

        // Complete
        animationTimeoutRef.current = setTimeout(() => {
          clearAnimation()
        }, 1000)
        return
      }

      setAnimationIndex(index)
      setAnimationStep(1)

      if (path[index].value === numValue) {
        // Node found, delete it
        animationTimeoutRef.current = setTimeout(() => {
          setAnimationStep(5)

          // Delete the node
          animationTimeoutRef.current = setTimeout(() => {
            bst.delete(numValue)
            updateTree()
            setAnimationStep(6)

            // Complete
            animationTimeoutRef.current = setTimeout(() => {
              clearAnimation()
              setSearchValue("")
            }, 1000)
          }, 800)
        }, 800)
        return
      }

      animationTimeoutRef.current = setTimeout(() => {
        animateTraversal(index + 1)
      }, 800)
    }

    animateTraversal(0)
  }

  // Handle traversal operation
  const handleTraversal = () => {
    clearAnimation()
    setIsAnimating(true)

    let result: number[] = []

    if (traversalType === "inorder") {
      result = bst.inOrderTraversal()
      setOperationDescription("In-order Traversal (Left, Root, Right)")
    } else if (traversalType === "preorder") {
      result = bst.preOrderTraversal()
      setOperationDescription("Pre-order Traversal (Root, Left, Right)")
    } else if (traversalType === "postorder") {
      result = bst.postOrderTraversal()
      setOperationDescription("Post-order Traversal (Left, Right, Root)")
    }

    setTraversalResult(result)
    setAnimationStep(7)

    // Complete
    animationTimeoutRef.current = setTimeout(() => {
      clearAnimation()
    }, 3000)
  }

  // Update canvas size on resize
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const width = canvasRef.current.clientWidth || 600
        const height = 400
        setCanvasSize({ width, height })
      }
    }

    // Initial update
    updateCanvasSize()

    // Use a safer way to add event listeners
    const resizeHandler = () => {
      window.requestAnimationFrame(() => {
        updateCanvasSize()
      })
    }

    window.addEventListener("resize", resizeHandler)

    return () => {
      window.removeEventListener("resize", resizeHandler)
    }
  }, [])

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Initialize the tree with some example nodes
  useEffect(() => {
    if (nodes.length === 0) {
      bst.insert(50)
      bst.insert(30)
      bst.insert(70)
      bst.insert(20)
      bst.insert(40)
      bst.insert(60)
      bst.insert(80)
      updateTree()
    }
  }, [bst, nodes.length])

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 text-lg font-semibold">
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
                <h1 className="text-3xl font-bold tracking-tight">Binary Search Tree Visualization</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Visualize operations on a binary search tree data structure
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visualization</CardTitle>
                      <CardDescription>Visual representation of the binary search tree</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div
                        ref={canvasRef}
                        className="relative min-h-[400px] border rounded-md bg-muted/30 overflow-hidden"
                      >
                        {/* Tree edges */}
                        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                          {edges.map((edge, index) => (
                            <line
                              key={index}
                              x1={edge.from.x + 20}
                              y1={edge.from.y + 20}
                              x2={edge.to.x + 20}
                              y2={edge.to.y + 20}
                              stroke="currentColor"
                              strokeOpacity="0.5"
                              strokeWidth="2"
                            />
                          ))}
                        </svg>

                        {/* Tree nodes */}
                        {nodes.map((node, index) => {
                          const isInPath = animationPath.includes(node)
                          const isCurrentNode = isInPath && animationPath[animationIndex] === node

                          return (
                            <div
                              key={index}
                              className={`
                                absolute flex items-center justify-center w-10 h-10 rounded-full border-2
                                ${
                                  isCurrentNode
                                    ? animationStep === 3
                                      ? "border-green-500 bg-green-100"
                                      : animationStep === 4
                                        ? "border-red-500 bg-red-100"
                                        : animationStep === 5
                                          ? "border-red-500 bg-red-100"
                                          : "border-yellow-500 bg-yellow-100"
                                    : isInPath && animationIndex > 0
                                      ? "border-primary bg-primary/10"
                                      : "border-muted-foreground/50 bg-background"
                                }
                                transition-all duration-300
                              `}
                              style={{
                                left: `${node.x}px`,
                                top: `${node.y}px`,
                              }}
                            >
                              {node.value}
                            </div>
                          )
                        })}
                      </div>

                      {/* Operation description */}
                      {isAnimating && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="font-medium">{operationDescription}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {animationStep === 1 && "Traversing the tree..."}
                            {animationStep === 2 && "Node inserted successfully"}
                            {animationStep === 3 && "Node found!"}
                            {animationStep === 4 && "Node not found"}
                            {animationStep === 5 && "Preparing to delete node..."}
                            {animationStep === 6 && "Node deleted successfully"}
                            {animationStep === 7 && "Traversal result: " + traversalResult.join(" → ")}
                          </p>
                        </div>
                      )}

                      {/* Traversal result */}
                      {traversalResult.length > 0 && !isAnimating && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="font-medium">
                            {traversalType === "inorder" && "In-order Traversal (Left, Root, Right)"}
                            {traversalType === "preorder" && "Pre-order Traversal (Root, Left, Right)"}
                            {traversalType === "postorder" && "Post-order Traversal (Left, Right, Root)"}
                          </p>
                          <p className="text-sm mt-1">Result: {traversalResult.join(" → ")}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Operations</CardTitle>
                      <CardDescription>Perform operations on the binary search tree</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="insert" className="w-full">
                        <TabsList className="w-full">
                          <TabsTrigger value="insert" className="flex-1">
                            Insert
                          </TabsTrigger>
                          <TabsTrigger value="search" className="flex-1">
                            Search
                          </TabsTrigger>
                          <TabsTrigger value="delete" className="flex-1">
                            Delete
                          </TabsTrigger>
                          <TabsTrigger value="traversal" className="flex-1">
                            Traversal
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="insert" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Value</label>
                            <Input
                              type="number"
                              placeholder="Enter a number"
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                              disabled={isAnimating}
                            />
                          </div>

                          <Button
                            className="w-full"
                            onClick={handleInsert}
                            disabled={!value || isNaN(Number(value)) || isAnimating}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Insert Node
                          </Button>
                        </TabsContent>

                        <TabsContent value="search" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Value to Search</label>
                            <Input
                              type="number"
                              placeholder="Enter a number"
                              value={searchValue}
                              onChange={(e) => setSearchValue(e.target.value)}
                              disabled={isAnimating}
                            />
                          </div>

                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={handleSearch}
                            disabled={!searchValue || isNaN(Number(searchValue)) || isAnimating}
                          >
                            <Search className="mr-2 h-4 w-4" />
                            Search Node
                          </Button>
                        </TabsContent>

                        <TabsContent value="delete" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Value to Delete</label>
                            <Input
                              type="number"
                              placeholder="Enter a number"
                              value={searchValue}
                              onChange={(e) => setSearchValue(e.target.value)}
                              disabled={isAnimating}
                            />
                          </div>

                          <Button
                            className="w-full"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={!searchValue || isNaN(Number(searchValue)) || isAnimating}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Node
                          </Button>
                        </TabsContent>

                        <TabsContent value="traversal" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Traversal Type</label>
                            <Select value={traversalType} onValueChange={setTraversalType} disabled={isAnimating}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select traversal type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="inorder">In-order (Left, Root, Right)</SelectItem>
                                <SelectItem value="preorder">Pre-order (Root, Left, Right)</SelectItem>
                                <SelectItem value="postorder">Post-order (Left, Right, Root)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <Button className="w-full" variant="outline" onClick={handleTraversal} disabled={isAnimating}>
                            Start Traversal
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Binary Search Tree Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-medium">Ordering Property</h4>
                          <p className="text-muted-foreground mt-1">
                            For each node, all values in the left subtree are less than the node's value, and all values
                            in the right subtree are greater.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Time Complexity</h4>
                          <div className="flex justify-between">
                            <span>Insert:</span>
                            <span className="font-mono">O(log n) average</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Search:</span>
                            <span className="font-mono">O(log n) average</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delete:</span>
                            <span className="font-mono">O(log n) average</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Traversal:</span>
                            <span className="font-mono">O(n)</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Applications</h4>
                          <ul className="list-disc list-inside text-muted-foreground mt-1">
                            <li>Searching and sorting</li>
                            <li>Priority queues</li>
                            <li>Database indexing</li>
                            <li>Syntax trees in compilers</li>
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
    </div>
  )
}

