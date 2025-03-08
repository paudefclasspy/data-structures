"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Info, Plus, ArrowRight} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Queue class
class Queue {
  items: number[]

  constructor() {
    this.items = []
  }

  // Enqueue an item
  enqueue(item: number) {
    this.items.push(item)
    return this
  }

  // Dequeue an item
  dequeue() {
    if (this.isEmpty()) {
      return null
    }
    return this.items.shift()
  }

  // Peek at the front item without removing it
  peek() {
    if (this.isEmpty()) {
      return null
    }
    return this.items[0]
  }

  // Check if the queue is empty
  isEmpty() {
    return this.items.length === 0
  }

  // Get the size of the queue
  size() {
    return this.items.length
  }

  // Get all items in the queue
  getItems() {
    return [...this.items]
  }
}

export default function QueuePage() {
  const [queue] = useState(new Queue())
  const [queueItems, setQueueItems] = useState<number[]>([])
  const [value, setValue] = useState("")
  const [animationStep, setAnimationStep] = useState(0)
  const [animationItem, setAnimationItem] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [operationDescription, setOperationDescription] = useState("")
  const [dequeuedItem, setDequeuedItem] = useState<number | null>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update the queue items whenever the queue changes
  const updateQueueItems = () => {
    setQueueItems(queue.getItems())
  }

  // Clear any ongoing animations
  const clearAnimation = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
    setAnimationStep(0)
    setAnimationItem(null)
    setIsAnimating(false)
    setDequeuedItem(null)
  }

  // Handle enqueue operation
  const handleEnqueue = () => {
    if (!value || isNaN(Number(value))) return

    const numValue = Number(value)
    clearAnimation()
    setIsAnimating(true)
    setAnimationItem(numValue)
    setOperationDescription(`Enqueuing ${numValue} to the queue`)

    // Step 1: Show the new item to the right of the queue
    setAnimationStep(1)

    // Step 2: Enqueue the item
    animationTimeoutRef.current = setTimeout(() => {
      queue.enqueue(numValue)
      updateQueueItems()
      setAnimationStep(2)

      // Step 3: Complete
      animationTimeoutRef.current = setTimeout(() => {
        clearAnimation()
        setValue("")
      }, 1000)
    }, 1000)
  }

  // Handle dequeue operation
  const handleDequeue = () => {
    if (queue.isEmpty()) {
      alert("Queue is empty")
      return
    }

    clearAnimation()
    setIsAnimating(true)
    const frontItem = queue.peek()
    setAnimationItem(frontItem)
    setOperationDescription(`Dequeuing ${frontItem} from the queue`)

    // Step 1: Highlight the front item
    setAnimationStep(1)

    // Step 2: Dequeue the item
    animationTimeoutRef.current = setTimeout(() => {
      const dequeuedValue = queue.dequeue() ?? null
      setDequeuedItem(dequeuedValue)
      updateQueueItems()
      setAnimationStep(2)

      // Step 3: Complete
      animationTimeoutRef.current = setTimeout(() => {
        clearAnimation()
      }, 1000)
    }, 1000)
  }

  // Handle peek operation
  const handlePeek = () => {
    if (queue.isEmpty()) {
      alert("Queue is empty")
      return
    }

    clearAnimation()
    setIsAnimating(true)
    const frontItem = queue.peek()
    setAnimationItem(frontItem)
    setOperationDescription(`Peeking at the front item: ${frontItem}`)

    // Step 1: Highlight the front item
    setAnimationStep(3) // Using a different step for peek

    // Step 2: Complete
    animationTimeoutRef.current = setTimeout(() => {
      clearAnimation()
    }, 2000)
  }

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Initialize the queue with some example items
  useEffect(() => {
    if (queueItems.length === 0) {
      queue.enqueue(10)
      queue.enqueue(20)
      queue.enqueue(30)
      updateQueueItems()
    }
  }, [queue, queueItems.length])

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
                <h1 className="text-3xl font-bold tracking-tight">Queue Visualization</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Visualize operations on a queue data structure (First-In-First-Out)
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visualization</CardTitle>
                      <CardDescription>Visual representation of the queue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative min-h-[300px] flex items-center justify-center">
                        <div className="flex flex-col items-center w-full">
                          {/* Animation for enqueuing */}
                          {isAnimating && animationStep === 1 && animationItem !== null && (
                            <div className="absolute right-4 flex h-12 w-12 items-center justify-center rounded-md border-2 border-purple-500 bg-purple-900 text-white animate-bounce shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                              {animationItem}
                            </div>
                          )}

                          {/* Animation for dequeuing */}
                          {isAnimating && animationStep === 2 && dequeuedItem !== null && (
                            <div className="absolute left-4 flex h-12 w-12 items-center justify-center rounded-md border-2 border-red-500 bg-red-900 text-white animate-fade-left shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                              {dequeuedItem}
                            </div>
                          )}

                          {/* Queue items */}
                          <div className="flex items-center gap-2 overflow-x-auto py-10 px-4">
                            {queueItems.length === 0 ? (
                              <div className="text-center text-muted-foreground">
                                <p>The queue is empty</p>
                                <p className="text-sm">Use the controls to add items</p>
                              </div>
                            ) : (
                              <>
                                <div className="text-xs text-muted-foreground">Front</div>
                                {queueItems.map((item, index) => (
                                  <div
                                    key={index}
                                    className={`
                                      flex h-12 w-12 items-center justify-center rounded-md border-2
                                      ${
                                        index === 0 && isAnimating && (animationStep === 1 || animationStep === 3)
                                          ? "border-purple-500 bg-purple-900 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                          : index === queueItems.length - 1 && isAnimating && animationStep === 1
                                            ? "border-purple-500 bg-purple-900 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                            : "border-muted-foreground/30 bg-background"
                                      }
                                      transition-all duration-300
                                    `}
                                  >
                                    {item}
                                  </div>
                                ))}
                                <div className="text-xs text-muted-foreground">Rear</div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Operation description */}
                      {isAnimating && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="font-medium">{operationDescription}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {animationStep === 1 && "Preparing operation..."}
                            {animationStep === 2 && "Operation completed successfully"}
                            {animationStep === 3 && "Peeking at the front element without removing it"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Operations</CardTitle>
                      <CardDescription>Perform operations on the queue</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="enqueue" className="w-full">
                        <TabsList className="w-full">
                          <TabsTrigger value="enqueue" className="flex-1">
                            Enqueue
                          </TabsTrigger>
                          <TabsTrigger value="dequeue" className="flex-1">
                            Dequeue
                          </TabsTrigger>
                          <TabsTrigger value="peek" className="flex-1">
                            Peek
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="enqueue" className="space-y-4">
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

                          <Button className="w-full" onClick={handleEnqueue} disabled={!value || isAnimating}>
                            <Plus className="mr-2 h-4 w-4" />
                            Enqueue Item
                          </Button>
                        </TabsContent>

                        <TabsContent value="dequeue" className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Dequeue removes the front item from the queue.
                          </p>

                          <Button
                            className="w-full"
                            variant="destructive"
                            onClick={handleDequeue}
                            disabled={queue.isEmpty() || isAnimating}
                          >
                            <ArrowRight className="mr-2 h-4 w-4" />
                            Dequeue Item
                          </Button>
                        </TabsContent>

                        <TabsContent value="peek" className="space-y-4">
                          <p className="text-sm text-muted-foreground">
                            Peek shows the front item without removing it.
                          </p>

                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={handlePeek}
                            disabled={queue.isEmpty() || isAnimating}
                          >
                            Peek at Front Item
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Queue Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-medium">First-In-First-Out (FIFO)</h4>
                          <p className="text-muted-foreground mt-1">
                            The first item added to the queue is the first one to be removed.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Time Complexity</h4>
                          <div className="flex justify-between">
                            <span>Enqueue:</span>
                            <span className="font-mono">O(1)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Dequeue:</span>
                            <span className="font-mono">O(1)</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Peek:</span>
                            <span className="font-mono">O(1)</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Applications</h4>
                          <ul className="list-disc list-inside text-muted-foreground mt-1">
                            <li>Task scheduling</li>
                            <li>Print job management</li>
                            <li>Breadth-first search</li>
                            <li>Message queues</li>
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

