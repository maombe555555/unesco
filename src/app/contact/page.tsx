/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client"

import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Toaster } from "react-hot-toast"
import { contactSchema, type ContactSchema } from "@/lib/validations/contact"
import { Send, CheckCircle, AlertCircle, Loader2, Mail, User, MessageSquare } from "lucide-react"

export default function Contact() {
  const [isSuccess, setIsSuccess] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactSchema>({
    resolver: zodResolver(contactSchema),
  })

  const handleSendMessage = async (data: ContactSchema) => {
    setError(null)
    setIsSuccess(false)

    try {
      const response = await fetch("/api/message", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (!response.ok) {
        throw new Error(result.message || "Failed to send message")
      }

      setIsSuccess(true)
      reset() // Clear form after success
    } catch (err: any) {
      setError(err.message || "An error occurred while sending the message")
    }
  }

  return (
    <div className="min-h-screen bg-[url('/background.jpg')] bg-cover bg-center flex flex-col">
      <Toaster position="top-center" />

      <main className="flex-grow flex items-center justify-center px-4 py-12">
        <div className="bg-white bg-opacity-95 rounded-xl shadow-xl p-8 w-full max-w-xl">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Contact Us</h1>
            <p className="text-gray-600 mt-2">Have questions or feedback? We'd love to hear from you.</p>
          </div>

          {isSuccess ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 text-center">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-green-800 mb-2">Message Sent Successfully!</h3>
              <p className="text-green-700 mb-4">
                Thank you for reaching out. We've received your message and will get back to you soon.
              </p>
              <button
                onClick={() => setIsSuccess(false)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit(handleSendMessage)} className="space-y-6">
              <div>
                <label htmlFor="name" className="mb-2 font-medium text-gray-700 flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Your Name
                </label>
                <input
                  id="name"
                  {...register("name")}
                  type="text"
                  placeholder="mase emmy"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.name && <p className="text-red-600 text-sm mt-1">{errors.name.message}</p>}
              </div>

              <div>
                <label htmlFor="email" className="mb-2 font-medium text-gray-700 flex items-center">
                  <Mail className="h-4 w-4 mr-2" />
                  Email Address
                </label>
                <input
                  id="email"
                  {...register("email")}
                  type="email"
                  placeholder="emmy@example.com"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.email && <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>}
              </div>

              <div>
                <label htmlFor="subject" className=" mb-2 font-medium text-gray-700 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Subject
                </label>
                <input
                  id="subject"
                  {...register("subject")}
                  type="text"
                  placeholder="How can we help you?"
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                {errors.subject && <p className="text-red-600 text-sm mt-1">{errors.subject.message}</p>}
              </div>

              <div>
                <label htmlFor="message" className=" mb-2 font-medium text-gray-700 flex items-center">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Your Message
                </label>
                <textarea
                  id="message"
                  {...register("message")}
                  rows={5}
                  placeholder="Please provide details about your inquiry..."
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors resize-none"
                />
                {errors.message && <p className="text-red-600 text-sm mt-1">{errors.message.message}</p>}
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-70 flex items-center justify-center"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2" />
                    Send Message
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Other Ways to Reach Us</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start">
                <Mail className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Email</p>
                  <a href="mailto:info@unesco-cnru.org" className="text-blue-600 hover:underline">
                    info@unesco-cnru.org
                  </a>
                </div>
              </div>
              <div className="flex items-start">
                <MessageSquare className="h-5 w-5 text-blue-600 mr-3 mt-1" />
                <div>
                  <p className="font-medium">Social Media</p>
                  <a href="#" className="text-blue-600 hover:underline">
                    @UNESCO_CNRU
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
