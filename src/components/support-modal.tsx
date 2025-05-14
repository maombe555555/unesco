"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { supportSchema } from "@/lib/validations/auth"
import type { z } from "zod"
import { Loader2 } from "lucide-react"
import toast from "react-hot-toast"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

type SupportFormInputs = z.infer<typeof supportSchema>

interface SupportModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SupportModal({ open, onOpenChange }: SupportModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SupportFormInputs>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  })

  const onSubmit = async (data: SupportFormInputs) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/support", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to send support request")
      }

      toast.success("Support request sent successfully")
      setIsSuccess(true)
      reset()
    } catch (error: any) {
      toast.error(error.message || "Failed to send support request. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    if (isSuccess) {
      setIsSuccess(false)
    }
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-[#0077D4]">Contact Support</DialogTitle>
          <DialogDescription>Fill out the form below to get help from our support team.</DialogDescription>
        </DialogHeader>

        {isSuccess ? (
          <div className="space-y-6 py-4">
            <div className="bg-green-50 p-4 rounded-md text-center border border-green-100">
              <h3 className="text-green-800 font-medium mb-2">Support Request Sent!</h3>
              <p className="text-green-700 text-sm">
                Thank you for contacting us. Our support team will get back to you as soon as possible.
              </p>
            </div>
            <Button className="w-full bg-[#0077D4] hover:bg-[#005ea6]" onClick={handleClose}>
              Close
            </Button>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input id="name" {...register("name")} className={errors.name ? "border-red-500" : ""} />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    {...register("email")}
                    className={errors.email ? "border-red-500" : ""}
                  />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email.message}</p>}
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Input id="subject" {...register("subject")} className={errors.subject ? "border-red-500" : ""} />
                {errors.subject && <p className="text-red-500 text-xs">{errors.subject.message}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  {...register("message")}
                  className={errors.message ? "border-red-500" : ""}
                />
                {errors.message && <p className="text-red-500 text-xs">{errors.message.message}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button type="submit" className="bg-[#0077D4] hover:bg-[#005ea6]" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  "Send Message"
                )}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}
