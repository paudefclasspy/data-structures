"use client"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Info, Plus, Search, Trash, ArrowDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"

// Hash Table class with separate chaining for collision resolution
class HashTable {
  size: number
  buckets: Array<Array<{ key: string; value: any }>>

  constructor(size = 10) {
    this.size = size
    this.buckets = Array(size)
      .fill(null)
      .map(() => [])
  }

  // Hash function to convert key to index
  hash(key: string): number {
    let hashValue = 0
    for (let i = 0; i < key.length; i++) {
      hashValue += key.charCodeAt(i)
    }
    return hashValue % this.size
  }

  // Insert a key-value pair
  insert(key: string, value: any) {
    const index = this.hash(key)

    // Check if key already exists
    const existingItemIndex = this.buckets[index].findIndex((item) => item.key === key)
    if (existingItemIndex !== -1) {
      this.buckets[index][existingItemIndex].value = value // Update value if key exists
    } else {
      this.buckets[index].push({ key, value }) // Add new key-value pair
    }

    return index
  }

  // Get a value by key
  get(key: string) {
    const index = this.hash(key)
    const item = this.buckets[index].find((item) => item.key === key)
    return item ? item.value : undefined
  }

  // Delete a key-value pair
  delete(key: string) {
    const index = this.hash(key)
    const itemIndex = this.buckets[index].findIndex((item) => item.key === key)

    if (itemIndex !== -1) {
      this.buckets[index].splice(itemIndex, 1)
      return true
    }

    return false
  }

  // Check if a key exists
  has(key: string) {
    const index = this.hash(key)
    return this.buckets[index].some((item) => item.key === key)
  }

  // Get all entries
  entries() {
    const result: Array<{ index: number; items: Array<{ key: string; value: any }> }> = []

    for (let i = 0; i < this.size; i++) {
      result.push({
        index: i,
        items: [...this.buckets[i]],
      })
    }

    return result
  }
}

export default function HashTablePage() {
  const [hashTable] = useState(() => new HashTable(10))
  const [tableEntries, setTableEntries] = useState<Array<{ index: number; items: Array<{ key: string; value: any }> }>>(
    [],
  )
  const [key, setKey] = useState("")
  const [value, setValue] = useState("")
  const [searchKey, setSearchKey] = useState("")
  const [searchResult, setSearchResult] = useState<{ found: boolean; value?: any; index?: number } | null>(null)
  const [animationStep, setAnimationStep] = useState(0)
  const [animationIndex, setAnimationIndex] = useState<number | null>(null)
  const [animationKey, setAnimationKey] = useState<string | null>(null)
  const [isAnimating, setIsAnimating] = useState(false)
  const [operationDescription, setOperationDescription] = useState("")
  const animationTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update the hash table entries whenever the hash table changes
  const updateTableEntries = () => {
    const entries = hashTable.entries()
    setTableEntries(entries)
  }

  // Clear any ongoing animations
  const clearAnimation = () => {
    if (animationTimeoutRef.current) {
      clearTimeout(animationTimeoutRef.current)
      animationTimeoutRef.current = null
    }
    setAnimationStep(0)
    setAnimationIndex(null)
    setAnimationKey(null)
    setIsAnimating(false)
  }

  // Handle insert operation
  const handleInsert = () => {
    if (!key.trim()) return

    clearAnimation()
    setIsAnimating(true)
    setAnimationKey(key)
    setOperationDescription(`Inserting key "${key}" with value "${value}"`)

    // Step 1: Show the hash calculation
    setAnimationStep(1)

    // Step 2: Show the index where the item will be inserted
    animationTimeoutRef.current = setTimeout(() => {
      const index = hashTable.hash(key)
      setAnimationIndex(index)
      setAnimationStep(2)

      // Step 3: Insert the item
      animationTimeoutRef.current = setTimeout(() => {
        hashTable.insert(key, value)
        updateTableEntries()
        setAnimationStep(3)

        // Step 4: Complete
        animationTimeoutRef.current = setTimeout(() => {
          clearAnimation()
          setKey("")
          setValue("")
        }, 1000)
      }, 1000)
    }, 1000)
  }

  // Handle search operation
  const handleSearch = () => {
    if (!searchKey.trim()) return

    clearAnimation()
    setIsAnimating(true)
    setAnimationKey(searchKey)
    setOperationDescription(`Searching for key "${searchKey}"`)

    // Step 1: Show the hash calculation
    setAnimationStep(1)

    // Step 2: Show the index where the item should be
    animationTimeoutRef.current = setTimeout(() => {
      const index = hashTable.hash(searchKey)
      setAnimationIndex(index)
      setAnimationStep(2)

      // Step 3: Show the search result
      animationTimeoutRef.current = setTimeout(() => {
        const value = hashTable.get(searchKey)
        const found = value !== undefined
        setSearchResult({ found, value, index })
        setAnimationStep(found ? 4 : 5) // 4 for found, 5 for not found

        // Step 4: Complete
        animationTimeoutRef.current = setTimeout(() => {
          clearAnimation()
        }, 2000)
      }, 1000)
    }, 1000)
  }

  // Handle delete operation
  const handleDelete = () => {
    if (!searchKey.trim()) return

    clearAnimation()
    setIsAnimating(true)
    setAnimationKey(searchKey)
    setOperationDescription(`Deleting key "${searchKey}"`)

    // Step 1: Show the hash calculation
    setAnimationStep(1)

    // Step 2: Show the index where the item should be
    animationTimeoutRef.current = setTimeout(() => {
      const index = hashTable.hash(searchKey)
      setAnimationIndex(index)
      setAnimationStep(2)

      // Step 3: Delete the item
      animationTimeoutRef.current = setTimeout(() => {
        const deleted = hashTable.delete(searchKey)
        updateTableEntries()
        setAnimationStep(deleted ? 6 : 5) // 6 for deleted, 5 for not found

        // Step 4: Complete
        animationTimeoutRef.current = setTimeout(() => {
          clearAnimation()
          setSearchKey("")
        }, 1000)
      }, 1000)
    }, 1000)
  }

  // Clean up animations on unmount
  useEffect(() => {
    return () => {
      if (animationTimeoutRef.current) {
        clearTimeout(animationTimeoutRef.current)
      }
    }
  }, [])

  // Initialize the hash table with some example entries
  useEffect(() => {
    if (tableEntries.length === 0 || tableEntries.every((entry) => entry.items.length === 0)) {
      hashTable.insert("apple", "red fruit")
      hashTable.insert("banana", "yellow fruit")
      hashTable.insert("carrot", "orange vegetable")
      hashTable.insert("date", "brown fruit")
      hashTable.insert("eggplant", "purple vegetable")
      updateTableEntries()
    }
  }, [hashTable, tableEntries])

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
                <h1 className="text-3xl font-bold tracking-tight">Hash Table Visualization</h1>
                <p className="mt-2 text-lg text-muted-foreground">
                  Visualize operations on a hash table data structure with separate chaining
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-3">
                <div className="md:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle>Visualization</CardTitle>
                      <CardDescription>Visual representation of the hash table</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="relative min-h-[400px]">
                        {/* Hash calculation animation */}
                        {isAnimating && animationStep === 1 && animationKey && (
                          <div className="mb-4 p-3 bg-yellow-100 rounded-md">
                            <p className="font-medium">Hash Calculation</p>
                            <p className="text-sm">
                              hash("{animationKey}") ={" "}
                              {Array.from(animationKey)
                                .map((char) => char.charCodeAt(0))
                                .join(" + ")}{" "}
                              % 10 = {hashTable.hash(animationKey)}
                            </p>
                          </div>
                        )}

                        {/* Hash table visualization */}
                        <div className="grid gap-2">
                          {tableEntries.map((entry) => (
                            <div
                              key={entry.index}
                              className={`
                                flex items-center border rounded-md p-2
                                ${
                                  animationIndex === entry.index && animationStep > 1
                                    ? "border-primary bg-primary/5"
                                    : "border-muted-foreground/20"
                                }
                              `}
                            >
                              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-muted mr-2">
                                {entry.index}
                              </div>

                              {entry.items.length === 0 ? (
                                <div className="text-muted-foreground text-sm">Empty bucket</div>
                              ) : (
                                <div className="flex flex-wrap gap-2">
                                  {entry.items.map((item, itemIndex) => (
                                    <div
                                      key={itemIndex}
                                      className={`
                                        flex items-center rounded-md border px-2 py-1 text-sm
                                        ${
                                          animationKey === item.key && animationStep > 2
                                            ? (animationStep === 4 || animationStep === 6)
                                              ? "border-green-500 bg-green-100"
                                              : animationStep === 5
                                                ? "border-red-500 bg-red-100"
                                                : "border-yellow-500 bg-yellow-100"
                                            : "border-muted-foreground/30"
                                        }
                                      `}
                                    >
                                      <span className="font-medium">{item.key}</span>
                                      <span className="mx-1">:</span>
                                      <span className="text-muted-foreground">{item.value}</span>
                                    </div>
                                  ))}
                                </div>
                              )}

                              {/* Animation for insertion */}
                              {isAnimating && animationStep === 2 && animationIndex === entry.index && (
                                <div className="ml-auto flex items-center">
                                  <ArrowDown className="h-5 w-5 text-primary animate-bounce" />
                                </div>
                              )}
                            </div>
                          ))}
                        </div>

                        {/* Operation description */}
                        {isAnimating && (
                          <div className="mt-4 p-3 bg-muted rounded-md">
                            <p className="font-medium">{operationDescription}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                              {animationStep === 1 && "Calculating hash..."}
                              {animationStep === 2 && "Finding bucket..."}
                              {animationStep === 3 && "Inserting key-value pair..."}
                              {animationStep === 4 && "Key found!"}
                              {animationStep === 5 && "Key not found."}
                              {animationStep === 6 && "Key deleted successfully."}
                            </p>
                          </div>
                        )}

                        {/* Search result */}
                        {searchResult && !isAnimating && (
                          <div className={`mt-4 p-3 rounded-md ${searchResult.found ? "bg-green-100" : "bg-red-100"}`}>
                            <p className="font-medium">
                              {searchResult.found
                                ? `Key "${searchKey}" found at index ${searchResult.index}`
                                : `Key "${searchKey}" not found`}
                            </p>
                            {searchResult.found && <p className="text-sm mt-1">Value: {searchResult.value}</p>}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <div>
                  <Card>
                    <CardHeader>
                      <CardTitle>Operations</CardTitle>
                      <CardDescription>Perform operations on the hash table</CardDescription>
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
                        </TabsList>

                        <TabsContent value="insert" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Key</label>
                            <Input
                              placeholder="Enter key"
                              value={key}
                              onChange={(e) => setKey(e.target.value)}
                              disabled={isAnimating}
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium">Value</label>
                            <Input
                              placeholder="Enter value"
                              value={value}
                              onChange={(e) => setValue(e.target.value)}
                              disabled={isAnimating}
                            />
                          </div>

                          <Button className="w-full" onClick={handleInsert} disabled={!key.trim() || isAnimating}>
                            <Plus className="mr-2 h-4 w-4" />
                            Insert Key-Value
                          </Button>
                        </TabsContent>

                        <TabsContent value="search" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Key to Search</label>
                            <Input
                              placeholder="Enter key"
                              value={searchKey}
                              onChange={(e) => setSearchKey(e.target.value)}
                              disabled={isAnimating}
                            />
                          </div>

                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={handleSearch}
                            disabled={!searchKey.trim() || isAnimating}
                          >
                            <Search className="mr-2 h-4 w-4" />
                            Search Key
                          </Button>
                        </TabsContent>

                        <TabsContent value="delete" className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Key to Delete</label>
                            <Input
                              placeholder="Enter key"
                              value={searchKey}
                              onChange={(e) => setSearchKey(e.target.value)}
                              disabled={isAnimating}
                            />
                          </div>

                          <Button
                            className="w-full"
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={!searchKey.trim() || isAnimating}
                          >
                            <Trash className="mr-2 h-4 w-4" />
                            Delete Key
                          </Button>
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>

                  <Card className="mt-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Info className="h-5 w-5" />
                        Hash Table Properties
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 text-sm">
                        <div>
                          <h4 className="font-medium">Collision Resolution</h4>
                          <p className="text-muted-foreground mt-1">
                            This implementation uses separate chaining to handle collisions, where multiple key-value
                            pairs can be stored in the same bucket.
                          </p>
                        </div>

                        <div className="space-y-2">
                          <h4 className="font-medium">Time Complexity</h4>
                          <div className="flex justify-between">
                            <span>Insert:</span>
                            <span className="font-mono">O(1) average</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Search:</span>
                            <span className="font-mono">O(1) average</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Delete:</span>
                            <span className="font-mono">O(1) average</span>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-medium">Applications</h4>
                          <ul className="list-disc list-inside text-muted-foreground mt-1">
                            <li>Database indexing</li>
                            <li>Caching</li>
                            <li>Symbol tables in compilers</li>
                            <li>Associative arrays</li>
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

