"use client"

import { useState, useEffect } from "react"
import { KanbanBoard } from "@/components/AddWork/KanbanBoard"
import { AddWork } from "@/components/AddWork/AddWork"

export default function AddWorkKanbanPage() {
  const [open, setOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <div className="w-full p-5 space-y-6" suppressHydrationWarning>

      <h1 className="text-center mt-4 text-4xl font-semibold font-mono">
        Track your work Here!
      </h1>

      <h1 className="text-center text-2xl font-semibold font-mono">
        Manage status of your Works without Notebook or pen 📝
      </h1>

   
      {isMounted && (
        <div className="flex justify-end">
          <AddWork open={open} onOpenChange={setOpen} />
        </div>
      )}
      <div className="border border-black p-4 rounded-2xl w-full">
        <KanbanBoard />
      </div>

    </div>
  )
}