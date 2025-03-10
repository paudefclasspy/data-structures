"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Info, Plus, ArrowUp } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Stack class
class Stack {
  items: number[]

  constructor() {
    this.items = []
  }

  // Push an item onto the stack
  push(item: number) {
    this.items.push(item)
    return this
  }

  // Pop an item from the stack
  pop() {
    if (this.isEmpty()) {
      return null
    }
    return this.items.pop()
  }

  // Peek at the top item without removing it
  peek() {
    if (this.isEmpty()) {
      return null
    }
    return this.items[this.items.length - 1]
  }

  // Check if the stack is empty
  isEmpty() {
    return this.items.length === 0
  }

  // Get the size of the stack
  size() {
    return this.items.length
  }

  // Get all items in the stack
  getItems() {
    return [...this.items]
  }
}

export default function StackPage() {
  const [stack] = useState(new Stack())
  const [stackItems, setStackItems] = useState<number[]>([])
  const [value, setValue] = useState("")
  const [animationStep, setAnimationStep] = useState(0)
  const [animationItem, setAnimationItem] = useState<number | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [operationDescription, setOperationDescription] = useState("")
  const [poppedItem, setPoppedItem] = useState<number | null>(null)
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update the stack items whenever the stack changes
  const updateStackItems = () => {
    setStackItems(stack.getItems())
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
    setPoppedItem(null)
  }

  // Handle push operation
  const handlePush = () => {
    if (!value || isNaN(Number(value))) return

    const numValue = Number(value)
    clearAnimation()
    setIsAnimating(true)
    setAnimationItem(numValue)
    setOperationDescription(`Pushing ${numValue} onto the stack`)

    // Step 1: Show the new item above the stack
    setAnimationStep(1)

    // Step 2: Push the item onto the stack
    animationTimeoutRef.current = setTimeout(() => {
      stack.push(numValue)
      updateStackItems()
      setAnimationStep(2)

      // Step 3: Complete
      animationTimeoutRef.current = setTimeout(() => {
        clearAnimation()
        setValue("")
      }, 1000)
    }, 1000)
  }

  // Handle pop operation
  const handlePop = () => {
    if (stack.isEmpty()) {
      alert("Stack is empty")
      return
    }

    clearAnimation()
    setIsAnimating(true)
    const topItem = stack.peek()
    setAnimationItem(topItem)
    setOperationDescription(`Popping ${topItem} from the stack`)

    // Step 1: Highlight the top item
    setAnimationStep(1)

    // Step 2: Pop the item
    animationTimeoutRef.current = setTimeout(() => {
      const poppedValue = stack.pop() ?? null
      setPoppedItem(poppedValue)
      updateStackItems()
      setAnimationStep(2)

      // Step 3: Complete
      animationTimeoutRef.current = setTimeout(() => {
        clearAnimation()
      }, 1000)
    }, 1000)
  }

  // Handle peek operation
  const handlePeek = () => {
    if (stack.isEmpty()) {
      alert("Stack is empty")
      return
    }

    clearAnimation()
    setIsAnimating(true)
    const topItem = stack.peek()
    setAnimationItem(topItem)
    setOperationDescription(`Peeking at the top item: ${topItem}`)

    // Step 1: Highlight the top item
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

  // Initialize the stack with some example items
  useEffect(() => {
    if (stackItems.length === 0) {
      stack.push(10)
      stack.push(20)
      stack.push(30)
      updateStackItems()
    }
  }, [stack, stackItems.length])

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
                <h1 className="text-3xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">Stack Visualization</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Visualize operations on a stack data structure (Last-In-First-Out)
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Card className="mt-6 card-gradient">
                    <CardHeader>
                      <CardTitle>Visualization</CardTitle>
                      <CardDescription>Visual representation of the stack</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative min-h-[400px] flex items-center justify-center">
                        <div className="flex flex-col-reverse items-center gap-2 w-full max-w-[200px]">
                          {/* Animation for pushing */}
                          {isAnimating && animationStep === 1 && animationItem !== null && (
                            <div className="flex h-12 w-full items-center justify-center rounded-md border-2 border-purple-500 bg-purple-900 text-white mb-4 animate-bounce shadow-[0_0_15px_rgba(168,85,247,0.5)]">
                              {animationItem}
                            </div>
                          )}

                          {/* Animation for popping */}
                          {isAnimating && animationStep === 2 && poppedItem !== null && (
                            <div className="absolute top-4 flex h-12 w-[200px] items-center justify-center rounded-md border-2 border-red-500 bg-red-900 text-white animate-fade-up shadow-[0_0_15px_rgba(239,68,68,0.5)]">
                              {poppedItem}
                            </div>
                          )}

                          {/* Stack items */}
                          {stackItems.length === 0 ? (
                            <div className="text-center text-muted-foreground">
                              <p>The stack is empty</p>
                              <p className="text-sm">Use the controls to add items</p>
                            </div>
                          ) : (
                            <>
                              <div className="text-xs text-muted-foreground mt-2">Bottom</div>
                              {stackItems.map((item, index) => (
                                <div
                                  key={index}
                                  className={`
                                    flex h-12 w-full items-center justify-center rounded-md border-2
                                    ${
                                      index === stackItems.length - 1 &&
                                      isAnimating &&
                                      (animationStep === 1 || animationStep === 3)
                                        ? "border-purple-500 bg-purple-900 text-white shadow-[0_0_15px_rgba(168,85,247,0.5)]"
                                        : "border-muted-foreground/30 bg-background"
                                    }
                                    transition-all duration-300
                                  `}
                                >
                                  {item}
                                </div>
                              ))}
                              <div className="text-xs text-muted-foreground mb-2">Top</div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Operation description */}
                      {isAnimating && (
                        <div className="mt-4 p-3 bg-muted rounded-md">
                          <p className="font-medium">{operationDescription}</p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {animationStep === 1 && "Preparing operation..."}
                            {animationStep === 2 && "Operation completed successfully"}
                            {animationStep === 3 && "Peeking at the top element without removing it"}
                          </p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card className="mt-6 card-gradient">
                    <CardHeader>
                      <CardTitle>Operations</CardTitle>
                      <CardDescription>Perform operations on the stack</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Tabs defaultValue="push" className="w-full">
                        <TabsList className="w-full">
                          <TabsTrigger value="push" className="flex-1">
                            Push
                          </TabsTrigger>
                          <TabsTrigger value="pop" className="flex-1">
                            Pop
                          </TabsTrigger>
                          <TabsTrigger value="peek" className="flex-1">
                            Peek
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="push" className="space-y-4">
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

                          <Button className="w-full" onClick={handlePush} disabled={!value || isAnimating}>
                            <Plus className="mr-2 h-4 w-4" />
                            Push Item
                          </Button>
                        </TabsContent>

                        <TabsContent value="pop" className="space-y-4">
                          <p className="text-sm text-muted-foreground">Pop removes the top item from the stack.</p>

                          <Button
                            className="w-full"
                            variant="destructive"
                            onClick={handlePop}
                            disabled={stack.isEmpty() || isAnimating}
                          >
                            <ArrowUp className="mr-2 h-4 w-4" />
                            Pop Item
                          </Button>
                        </TabsContent>

                        <TabsContent value="peek" className="space-y-4">
                          <p className="text-sm text-muted-foreground">Peek shows the top item without removing it.</p>

                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={handlePeek}
                            disabled={stack.isEmpty() || isAnimating}
                          >
                            Peek at Top Item
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <Card className="mt-6 card-gradient">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5 text-purple-400" />
                        Stack Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-medium">Last-In-First-Out (LIFO)</h4>
                          <p className="text-muted-foreground mt-1">
                            The last item added to the stack is the first one to be removed.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Time Complexity</h4>
                          <div className="flex justify-between">
                            <span className="text-white/70">Push:</span>
                            <span className="font-mono text-purple-300">O(1)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Pop:</span>
                            <span className="font-mono text-purple-300">O(1)</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-white/70">Peek:</span>
                            <span className="font-mono text-purple-300">O(1)</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Applications</h4>
                          <ul className="list-disc list-inside text-white/70 mt-1">
                            <li>Function call management</li>
                            <li>Expression evaluation</li>
                            <li>Undo mechanisms</li>
                            <li>Backtracking algorithms</li>
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

