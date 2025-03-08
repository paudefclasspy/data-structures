import Link from "next/link"
import { ArrowRight, Database, Linkedin, Github} from "lucide-react"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col">
      <header className="border-b border-white/10 bg-black/20">
        <div className="container flex h-16 items-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-lg font-semibold flex items-center gap-2">
            <Database className="h-5 w-5 text-purple-400" />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Data Structures Visualizer
            </span>
          </h1>
        </div>
      </header>
      <div className="container flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="text-center space-y-4">
            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
              Interactive Data Structures
            </h2>
            <p className="text-lg text-white/80">
              Visualize and interact with common data structures to understand their operations and applications.
            </p>
          </div>
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                href: "/linked-list",
                title: "Linked List",
                description:
                  "A linear data structure where elements are stored in nodes that point to the next node in the sequence.",
                preview: (
                  <div className="mt-4 flex items-center gap-2 overflow-x-auto py-2">
                    {[1, 2, 3, 4, 5].map((value, index) => (
                      <div key={index} className="flex items-center">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white">
                          {value}
                        </div>
                        {index < 4 && <div className="h-0.5 w-6 bg-white/20"></div>}
                      </div>
                    ))}
                  </div>
                ),
              },
              {
                href: "/graph",
                title: "Graph",
                description: "A non-linear data structure consisting of nodes and edges that connect pairs of nodes.",
                preview: (
                  <div className="mt-4 relative h-24">
                    <div className="absolute left-1/4 top-1/4 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      A
                    </div>
                    <div className="absolute right-1/4 top-1/4 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      B
                    </div>
                    <div className="absolute bottom-1/4 left-1/2 transform -translate-x-1/2 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      C
                    </div>
                    <svg className="absolute inset-0 h-full w-full">
                      <line x1="30%" y1="30%" x2="70%" y2="30%" stroke="white" strokeOpacity="0.2" />
                      <line x1="30%" y1="30%" x2="50%" y2="70%" stroke="white" strokeOpacity="0.2" />
                      <line x1="70%" y1="30%" x2="50%" y2="70%" stroke="white" strokeOpacity="0.2" />
                    </svg>
                  </div>
                ),
              },
              {
                href: "/stack",
                title: "Stack",
                description: "A linear data structure that follows the Last-In-First-Out (LIFO) principle.",
                preview: (
                  <div className="mt-4 flex flex-col-reverse items-center gap-2 py-2">
                    {[1, 2, 3, 4].map((value, index) => (
                      <div
                        key={index}
                        className="flex h-8 w-20 items-center justify-center rounded bg-white/10 text-white"
                      >
                        {value}
                      </div>
                    ))}
                    <div className="text-xs text-white/60">Top</div>
                  </div>
                ),
              },
              {
                href: "/queue",
                title: "Queue",
                description: "A linear data structure that follows the First-In-First-Out (FIFO) principle.",
                preview: (
                  <div className="mt-4 relative">
                    <div className="flex flex-col items-center">
                      <div className="flex items-center gap-2 overflow-x-auto py-2">
                        <div className="text-xs text-white/60">Front</div>
                        {[1, 2, 3, 4].map((value, index) => (
                          <div
                            key={index}
                            className="flex h-8 w-10 items-center justify-center rounded bg-white/10 text-white"
                          >
                            {value}
                          </div>
                        ))}
                        <div className="text-xs text-white/60">Rear</div>
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                href: "/hash-table",
                title: "Hash Table",
                description: "A data structure that maps keys to values using a hash function for efficient lookups.",
                preview: (
                  <div className="mt-4 relative">
                    <div className="grid grid-cols-3 gap-1">
                      <div className="flex h-8 items-center justify-center rounded bg-white/10 text-xs text-white">
                        0: A→Z
                      </div>
                      <div className="flex h-8 items-center justify-center rounded bg-white/10 text-xs text-white">
                        1: B
                      </div>
                      <div className="flex h-8 items-center justify-center rounded bg-white/10 text-xs text-white">
                        2: —
                      </div>
                      <div className="flex h-8 items-center justify-center rounded bg-white/10 text-xs text-white">
                        3: C
                      </div>
                      <div className="flex h-8 items-center justify-center rounded bg-white/10 text-xs text-white">
                        4: —
                      </div>
                      <div className="flex h-8 items-center justify-center rounded bg-white/10 text-xs text-white">
                        5: D→Y
                      </div>
                    </div>
                  </div>
                ),
              },
              {
                href: "/binary-tree",
                title: "Binary Tree",
                description: "A hierarchical data structure where each node has at most two children.",
                preview: (
                  <div className="mt-4 relative h-32">
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      8
                    </div>
                    <div className="absolute top-12 left-1/4 transform -translate-x-1/2 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      3
                    </div>
                    <div className="absolute top-12 left-3/4 transform -translate-x-1/2 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      10
                    </div>
                    <div className="absolute bottom-0 left-1/8 transform -translate-x-1/2 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      1
                    </div>
                    <div className="absolute bottom-0 left-3/8 transform -translate-x-1/2 h-8 w-8 rounded-full bg-white/10 flex items-center justify-center text-white">
                      6
                    </div>
                    <svg className="absolute inset-0 h-full w-full">
                      <line x1="50%" y1="8%" x2="25%" y2="38%" stroke="white" strokeOpacity="0.2" />
                      <line x1="50%" y1="8%" x2="75%" y2="38%" stroke="white" strokeOpacity="0.2" />
                      <line x1="25%" y1="38%" x2="12.5%" y2="68%" stroke="white" strokeOpacity="0.2" />
                      <line x1="25%" y1="38%" x2="37.5%" y2="68%" stroke="white" strokeOpacity="0.2" />
                    </svg>
                  </div>
                ),
              },
            ].map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group relative overflow-hidden rounded-xl card-gradient p-6 transition-all hover:shadow-lg hover:-translate-y-1"
              >
                <div className="flex flex-col gap-2">
                  <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                  <p className="text-white/70">{item.description}</p>
                  <div className="mt-4 flex items-center text-sm font-medium text-purple-400 group-hover:text-purple-300">
                    Explore
                    <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
                {item.preview}
              </Link>
            ))}
          </div>
        </div>
      </div>
      <footer className="border-t border-white/10 py-6 bg-black/20">
        <div className="container px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center gap-3">
            <p className="text-center text-sm text-white/60">Data Structures Visualizer - An interactive learning tool created by Pau Aranega Bellido</p>
            <div className="flex items-center gap-4">
              <a 
                href="https://www.linkedin.com/in/pauaranegabellido" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/60 hover:text-purple-400 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
                <span className="text-sm">LinkedIn</span>
              </a>
              <a 
                href="https://github.com/paudefclasspy" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-white/60 hover:text-purple-400 transition-colors"
              >
                <Github className="h-4 w-4" />
                <span className="text-sm">GitHub</span>
              </a>
            </div>
          </div>
        </div>
      </footer>
    </main>
  )
}

