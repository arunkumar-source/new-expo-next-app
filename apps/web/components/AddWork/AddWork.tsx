"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@workspace/ui/components/dialog"

import { Input } from "@workspace/ui/components/input"
import { Button } from "@workspace/ui/components/button"

import { useForm } from "react-hook-form"
import type { WorkStatus } from "@repo/shared"
import { $api } from "@/lib/api-client"

interface AddWorkProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

type FormValues = {
  title: string
  description: string
  status: WorkStatus
  endDate: string
  endTime: string
}

export function AddWork({ open, onOpenChange }: AddWorkProps) {
  const createWork = $api.useMutation('post','/api/add')
  
  const form = useForm<FormValues>({
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      endDate: "",
      endTime: "",
    },
  })

  const onSubmit = form.handleSubmit(async (data) => {
    try {
     
      const endDate = data.endDate && data.endTime 
        ? `${data.endDate}T${data.endTime}:00` 
        : data.endDate

     await createWork.mutateAsync({
        body: {
          title: data.title,
          description: data.description,
          status: data.status,
          endDate,
        }
      })
      form.reset()
      onOpenChange(false)
    } catch (error) {
      console.error("Failed to create work:", error)
    }
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger asChild>
        <Button className="bg-black text-white hover:bg-black/80">
          Add Work
        </Button>
      </DialogTrigger>

      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Add work here</DialogTitle>
          <DialogDescription>
            Add new task to the kanban board
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={onSubmit} className="space-y-4 mt-4">
          {/* Title */}
          <div className="space-y-1">
            <Input
              {...form.register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message: "Title must be at least 3 characters",
                },
              })}
              placeholder="Title"
            />
            {form.formState.errors.title && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div className="space-y-1">
            <textarea
              {...form.register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message: "Description must be at least 10 characters",
                },
              })}
              placeholder="Description"
              className="w-full p-2 border border-gray-300 rounded-md resize-none h-24 focus:outline-none focus:ring-2 focus:ring-black"
            />
            {form.formState.errors.description && (
              <p className="text-red-500 text-sm">
                {form.formState.errors.description.message}
              </p>
            )}
          </div>

          {/* End Date + Time */}
          <div className="space-y-2">
            <label className="text-sm font-medium">
              End Date (Optional)
            </label>

            <Input
              type="date"
              {...form.register("endDate")}
              min={new Date().toISOString().split("T")[0]}
            />

            <Input
              type="time"
              {...form.register("endTime")}
            />
          </div>

          {/* Status */}
          <div className="space-y-1">
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              {...form.register("status")}
            >
              <option value="backlog">Backlog</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          {/* Submit */}
          <Button
            type="submit"
            disabled={createWork.isPending}
            className="w-full bg-black text-white hover:bg-black/80 disabled:opacity-50"
          >
            {createWork.isPending ? "Adding..." : "Add Work"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  )
}