"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronRight, Info, Plus, Trash } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Node class for linked list
class ListNode {
  value: number
  next: ListNode | null

  constructor(value: number) {
    this.value = value
    this.next = null
  }
}

// Linked List class
class LinkedList {
  head: ListNode | null

  constructor() {
    this.head = null
  }

  // Insert at the beginning
  insertAtBeginning(value: number) {
    const newNode = new ListNode(value)
    newNode.next = this.head
    this.head = newNode
    return this
  }

  // Insert at the end
  insertAtEnd(value: number) {
    const newNode = new ListNode(value)

    if (!this.head) {
      this.head = newNode
      return this
    }

    let current = this.head
    while (current.next) {
      current = current.next
    }

    current.next = newNode
    return this
  }

  // Insert at a specific position
  insertAtPosition(value: number, position: number) {
    if (position === 0) {
      return this.insertAtBeginning(value)
    }

    const newNode = new ListNode(value)
    let current = this.head
    let count = 0

    while (current && count < position - 1) {
      current = current.next
      count++
    }

    if (!current) {
      return this.insertAtEnd(value)
    }

    newNode.next = current.next
    current.next = newNode
    return this
  }

  // Delete a node with a specific value
  delete(value: number) {
    if (!this.head) {
      return this
    }

    if (this.head.value === value) {
      this.head = this.head.next
      return this
    }

    let current = this.head
    while (current.next && current.next.value !== value) {
      current = current.next
    }

    if (current.next) {
      current.next = current.next.next
    }

    return this
  }

  // Search for a value
  search(value: number) {
    let current = this.head
    let position = 0

    while (current) {
      if (current.value === value) {
        return position
      }
      current = current.next
      position++
    }

    return -1
  }

  // Convert to array for visualization
  toArray() {
    const result = []
    let current = this.head

    while (current) {
      result.push(current.value)
      current = current.next
    }

    return result
  }
}

export default function LinkedListPage() {
  const [linkedList] = useState(new LinkedList())
  const [listArray, setListArray] = useState<number[]>([])
  const [value, setValue] = useState("")
  const [position, setPosition] = useState("0")
  const [operation, setOperation] = useState("beginning")
  const [searchValue, setSearchValue] = useState("")
  const [searchResult, setSearchResult] = useState<number | null>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [animationNode, setAnimationNode] = useState<number | null>(null)
  const [animationPosition, setAnimationPosition] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [operationDescription, setOperationDescription] = useState("")
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update the list array whenever the linked list changes
  const updateListArray = () => {
    setListArray(linkedList.toArray())
  }

  // Clear any ongoing animations
  const clearAnimation = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
    setAnimationStep(0)
    setAnimationNode(null)
    setAnimationPosition(null)
    setIsAnimating(false)
  }

  // Handle insertion operations
  const handleInsert = () => {
    if (!value || isNaN(Number(value))) return

    const numValue = Number(value)
    clearAnimation()
    setIsAnimating(true)

    // Set initial animation state
    setAnimationNode(numValue)

    // Different animation steps based on operation
    if (operation === "beginning") {
      setOperationDescription("Inserting at the beginning")
      setAnimationPosition(-1)

      // Step 1: Show the new node
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationStep(1)

        // Step 2: Insert the node
        animationTimeoutRef.current = setTimeout(() => {
          linkedList.insertAtBeginning(numValue)
          updateListArray()
          setAnimationStep(2)

          // Step 3: Complete
          animationTimeoutRef.current = setTimeout(() => {
            clearAnimation()
            setValue("")
          }, 1000)
        }, 1000)
      }, 500)
    } else if (operation === "end") {
      setOperationDescription("Inserting at the end")
      setAnimationPosition(listArray.length)

      // Step 1: Show the new node
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationStep(1)

        // Step 2: Insert the node
        animationTimeoutRef.current = setTimeout(() => {
          linkedList.insertAtEnd(numValue)
          updateListArray()
          setAnimationStep(2)

          // Step 3: Complete
          animationTimeoutRef.current = setTimeout(() => {
            clearAnimation()
            setValue("")
          }, 1000)
        }, 1000)
      }, 500)
    } else if (operation === "position") {
      const pos = Number(position)
      setOperationDescription(`Inserting at position ${pos}`)
      setAnimationPosition(pos)

      // Step 1: Show the new node
      animationTimeoutRef.current = setTimeout(() => {
        setAnimationStep(1)

        // Step 2: Insert the node
        animationTimeoutRef.current = setTimeout(() => {
          linkedList.insertAtPosition(numValue, pos)
          updateListArray()
          setAnimationStep(2)

          // Step 3: Complete
          animationTimeoutRef.current = setTimeout(() => {
            clearAnimation()
            setValue("")
          }, 1000)
        }, 1000)
      }, 500)
    }
  }

  // Handle delete operation
  const handleDelete = () => {
    if (!value || isNaN(Number(value))) return

    const numValue = Number(value)
    const position = linkedList.search(numValue)

    if (position === -1) {
      alert("Value not found in the linked list")
      return
    }

    clearAnimation()
    setIsAnimating(true)
    setAnimationNode(numValue)
    setAnimationPosition(position)
    setOperationDescription(`Deleting node with value ${numValue}`)

    // Step 1: Highlight the node to delete
    setAnimationStep(1)

    // Step 2: Delete the node
    animationTimeoutRef.current = setTimeout(() => {
      linkedList.delete(numValue)
      updateListArray()
      setAnimationStep(2)

      // Step 3: Complete
      animationTimeoutRef.current = setTimeout(() => {
        clearAnimation()
        setValue("")
      }, 1000)
    }, 1000)
  }

  // Handle search operation
  const handleSearch = () => {
    if (!searchValue || isNaN(Number(searchValue))) return

    const numValue = Number(searchValue)
    const position = linkedList.search(numValue)

    clearAnimation()
    setIsAnimating(true)
    setAnimationNode(numValue)
    setOperationDescription(`Searching for value ${numValue}`)

    // Step 1: Start search
    setAnimationStep(1)

    // Animate through each node
    let currentPos = 0
    const animateSearch = () => {
      if (currentPos > position && position !== -1) {
        // Found the value
        setAnimationPosition(position)
        setSearchResult(position)
        setAnimationStep(2)

        // Complete
        animationTimeoutRef.current = setTimeout(() => {
          clearAnimation()
        }, 1000)
        return
      }

      if (currentPos >= listArray.length) {
        // Value not found
        setSearchResult(-1)
        setAnimationStep(3)

        // Complete
        animationTimeoutRef.current = setTimeout(() => {
          clearAnimation()
        }, 1000)
        return
      }

      // Move to next node
      setAnimationPosition(currentPos)
      currentPos++
      animationTimeoutRef.current = setTimeout(animateSearch, 500)
    }

    animateSearch()
  }

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

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
                  Linked List Visualization
                </h1>
                <p className="mt-2 text-lg text-white/80">
                  Visualize operations on a singly linked list data structure
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Card className="card-gradient">
                    <CardHeader>
                      <CardTitle className="text-white">Visualization</CardTitle>
                      <CardDescription className="text-white/70">
                        Visual representation of the linked list
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative min-h-[200px] flex items-center justify-center">
                        {listArray.length === 0 ? (
                          <div className="text-center text-muted-foreground">
                            <p>The linked list is empty</p>
                            <p className="text-sm">Use the controls to add nodes</p>
                          </div>
                        ) : (
                          <div className="flex items-center overflow-x-auto py-10 px-4">
                            {listArray.map((value, index) => (
                              <div key={index} className="flex items-center">
                                <div
                                  className={`
                                    flex h-14 w-14 items-center justify-center rounded-full border-2 
                                    ${
                                      animationPosition === index && animationStep > 0
                                        ? animationStep === 1 && animationNode === value
                                          ? "border-yellow-500 bg-yellow-100"
                                          : animationStep === 2 && animationNode === value
                                            ? "border-green-500 bg-green-100"
                                            : animationStep === 3
                                              ? "border-red-500 bg-red-100"
                                              : "border-primary bg-primary/10"
                                        : "border-primary bg-primary/10"
                                    }
                                    transition-all duration-300
                                  `}
                                >
                                  {value}
                                </div>
                                {index < listArray.length - 1 && (
                                  <div className="flex w-8 items-center justify-center">
                                    <ChevronRight className="h-6 w-6 text-muted-foreground" />
                                  </div>
                                )}
                              </div>
                            ))}

                            {/* Animation node */}
                            {isAnimating &&
                              animationStep === 1 &&
                              animationPosition !== null &&
                              ((operation === "beginning" && animationPosition === -1) ||
                                (operation === "end" && animationPosition === listArray.length) ||
                                operation === "position") && (
                                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex items-center">
                                  <div className="flex h-14 w-14 items-center justify-center rounded-full border-2 border-yellow-500 bg-yellow-100">
                                    {animationNode}
                                  </div>
                                  <div className="ml-2 bg-white p-1 rounded shadow-sm text-sm">New node</div>
                                </div>
                              )}
                          </div>
                        )}
                      </div>

                      {/* Operation description */}
                      {isAnimating && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="font-medium">{operationDescription}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {animationStep === 1 && "Preparing operation..."}
                            {animationStep === 2 && "Operation completed successfully"}
                            {animationStep === 3 && "Value not found in the list"}
                          </p>
                        </div>
                      )}

                      {/* Search result */}
                      {searchResult !== null && !isAnimating && (
                        <div className={`mt-4 p-3 rounded-md ${searchResult >= 0 ? "bg-green-100" : "bg-red-100"}`}>
                          <p className="font-medium">
                            {searchResult >= 0
                              ? `Value found at position ${searchResult}`
                              : "Value not found in the list"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="card-gradient">
                    <CardHeader>
                      <CardTitle className="text-white">Operations</CardTitle>
                      <CardDescription className="text-white/70">Perform operations on the linked list</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="insert" className="w-full">
                        <TabsList className="w-full">
                          <TabsTrigger value="insert" className="flex-1">
                            Insert
                          </TabsTrigger>
                          <TabsTrigger value="delete" className="flex-1">
                            Delete
                          </TabsTrigger>
                          <TabsTrigger value="search" className="flex-1">
                            Search
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

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Insert at</label>
                            <Select value={operation} onValueChange={setOperation} disabled={isAnimating}>
                              <SelectTrigger>
                                <SelectValue placeholder="Select position" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="beginning">Beginning</SelectItem>
                                <SelectItem value="end">End</SelectItem>
                                <SelectItem value="position">Specific Position</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          {operation === "position" && (
                            <div className="space-y-2">
                              <label className="text-sm font-medium">Position</label>
                              <Input
                                type="number"
                                placeholder="Enter position"
                                value={position}
                                onChange={(e) => setPosition(e.target.value)}
                                min="0"
                                max={listArray.length.toString()}
                                disabled={isAnimating}
                              />
                            </div>
                          )}

                          <Button className="w-full" onClick={handleInsert} disabled={!value || isAnimating}>
                            <Plus className="mr-2 h-4 w-4" />
                            Insert Node
                          </Button>
                        </TabsContent>

                        <TabsContent value="delete" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Value to Delete</label>
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
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={!value || isAnimating}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Node
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
                            disabled={!searchValue || isAnimating}
                          >
                            Search
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <Card className="mt-6 card-gradient">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-white">
                        <Info className="h-5 w-5 text-purple-400" />
                        Linked List Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-medium text-white">Structure</h4>
                          <p className="text-white/70 mt-1">
                            A linked list consists of nodes where each node contains data and a reference to the next
                            node in the sequence.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium text-white">Time Complexity</h4>
                          <div className="flex justify-between">
                            <span className="text-white/70">Insert at Beginning:</span>
                            <span className="font-mono text-purple-300">O(1)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Insert at End:</span>
                            <span className="font-mono text-purple-300">O(n)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Insert at Position:</span>
                            <span className="font-mono text-purple-300">O(n)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Delete:</span>
                            <span className="font-mono text-purple-300">O(n)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Search:</span>
                            <span className="font-mono text-purple-300">O(n)</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium text-white">Applications</h4>
                          <ul className="list-disc list-inside text-white/70 mt-1">
                            <li>Implementation of stacks and queues</li>
                            <li>Dynamic memory allocation</li>
                            <li>Maintaining directory of names</li>
                            <li>Performing arithmetic operations on long integers</li>
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

