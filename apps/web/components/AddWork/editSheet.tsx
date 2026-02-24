"use client"

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@workspace/ui/components/sheet"
import { Button } from "@workspace/ui/components/button"
import { Input } from "@workspace/ui/components/input"
import { useForm } from "react-hook-form"
import { $api } from "@/lib/api-client"
import { type Work } from "@repo/shared"
import { useQueryClient } from "@tanstack/react-query"

type FormValues = {
  title: string
  description: string
  status: string
  endDate?: string
  endTime?: string
}

// ✅ Helper: Convert UTC → Local input format
function formatDateForInputs(isoString?: string) {
  if (!isoString) {
    return { date: "", time: "" }
  }

  const local = new Date(isoString)

  const date = local.toLocaleDateString("en-CA") // yyyy-mm-dd
  const time = local.toLocaleTimeString("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  })

  return { date, time }
}

export function EditWorkSheet({
  work,
  children,
}: {
  work: Work
  children: React.ReactNode
}) {
  const queryClient = useQueryClient()
  const { mutateAsync: updateWork } =
    $api.useMutation("patch", "/api/update/{id}")

  // ✅ Convert UTC → local for display
  const { date, time } = formatDateForInputs(work.endDate)

  const { register, handleSubmit, formState } = useForm<FormValues>({
    values: {
      title: work.title ?? "",
      description: work.description ?? "",
      status: work.status ?? "todo",
      endDate: date,
      endTime: time,
    },
  })

  const onSubmit = handleSubmit(async (data) => {
    let finalEndDate: string | undefined

    // ✅ Convert local → UTC before saving
    if (data.endDate && data.endTime) {
      const localDate = new Date(
        `${data.endDate}T${data.endTime}:00`
      )
      finalEndDate = localDate.toISOString()
    } else if (data.endDate) {
      const localDate = new Date(data.endDate)
      finalEndDate = localDate.toISOString()
    }

    await updateWork(
      {
        params: {
          path: { id: work.id },
        },
        body: {
          title: data.title,
          description: data.description,
          status: data.status as any,
          endDate: finalEndDate,
        },
      },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["get", "/api"] })
        },
      }
    )
  })

  return (
    <Sheet>
      <SheetTrigger asChild>{children}</SheetTrigger>

      <SheetContent className="p-6">
        <SheetHeader>
          <SheetTitle>Edit Work</SheetTitle>
          <SheetDescription>
            Update work item details
          </SheetDescription>
        </SheetHeader>

        <form
          onSubmit={onSubmit}
          className="space-y-6 text-white mt-6"
        >
          {/* Title */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Title
            </label>
            <Input
              {...register("title", {
                required: "Title is required",
                minLength: {
                  value: 3,
                  message:
                    "Title must be at least 3 characters long",
                },
              })}
            />
            {formState.errors.title && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.title.message}
              </p>
            )}
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Description
            </label>
            <textarea
              {...register("description", {
                required: "Description is required",
                minLength: {
                  value: 10,
                  message:
                    "Description must be at least 10 characters long",
                },
              })}
              className="w-full p-2 border border-gray-300 rounded-md resize-none h-24 bg-black text-white"
            />
            {formState.errors.description && (
              <p className="text-red-500 text-sm mt-1">
                {formState.errors.description.message}
              </p>
            )}
          </div>

          {/* End Date & Time */}
          <div>
            <label className="block text-sm font-medium mb-1">
              End Date (Optional)
            </label>
            <div className="space-y-2">
              <Input
                type="date"
                {...register("endDate")}
                min={new Date().toISOString().split("T")[0]}
                className="bg-black text-white"
              />
              <Input
                type="time"
                {...register("endTime")}
                className="bg-black text-white"
              />
            </div>
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Status
            </label>
            <select
              {...register("status")}
              className="w-full bg-black text-white border rounded-md p-2"
            >
              <option value="backlog">Backlog</option>
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="done">Done</option>
              <option value="cancelled">Cancel</option>
            </select>
          </div>

          <Button type="submit" disabled={formState.isSubmitting}>
            {formState.isSubmitting ? "Saving..." : "Save"}
          </Button>
        </form>
      </SheetContent>
    </Sheet>
  )
}