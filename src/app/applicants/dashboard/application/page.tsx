/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon, FileText, ChevronRight, AlertCircle } from "lucide-react"
import Link from "next/link"

interface Project {
  _id: string
  projectName: string
  projectTitle: string
  orgName: string
  status: string
  createdAt: string
  marks: number
}

const ApplicationPage: React.FC = () => {
  const [applications, setApplications] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedApp, setSelectedApp] = useState<string | null>(null)

  useEffect(() => {
    fetchApplications()
  }, [])

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`/api/application`)
      console.log("Response data:", response.data)
      setApplications(response.data.projects || [])
    } catch (err: any) {
      console.error("Error fetching applications:", err)
      setError(err.response?.data?.message || "Failed to fetch applications.")
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "rejected":
        return "bg-red-100 text-red-800 hover:bg-red-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-2xl font-bold mb-6">My Applications</h1>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="w-full">
              <CardHeader className="pb-2">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent>
                <div className="flex justify-between">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-1/4" />
                </div>
              </CardContent>
              <CardFooter>
                <Skeleton className="h-9 w-28" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
        <Button onClick={fetchApplications} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>

      {applications.length === 0 ? (
        <div className="text-center py-10 border rounded-lg">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">No applications found</h3>
          <p className="text-gray-500 mt-2">You haven&apos;t submitted any applications yet.</p>
          <Button className="mt-4" asChild>
            <Link href="/applicants/dashboard/submit">Submit New Application</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <Card key={app._id} className="w-full hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{app.projectTitle}</CardTitle>
                    <CardDescription>{app.projectName}</CardDescription>
                  </div>
                  <Badge className={getStatusColor(app.status)}>
                    {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Organization:</span> {app.orgName}
                  </div>
                  <div className="flex items-center gap-1">
                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                    <span>Submitted on {formatDate(app.createdAt)}</span>
                  </div>
                  {app.marks > 0 && (
                    <div>
                      <span className="text-gray-500">Score:</span> {app.marks} points
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedApp(selectedApp === app._id ? null : app._id)}
                  className="flex items-center gap-1"
                >
                  View Details
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </CardFooter>

              {selectedApp === app._id && (
                <div className="px-6 pb-6 pt-0 border-t mt-2">
                  <h3 className="font-medium text-lg mb-3">Application Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-gray-500 mb-1">Project Title</p>
                      <p>{app.projectTitle}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Project Name</p>
                      <p>{app.projectName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Organization</p>
                      <p>{app.orgName}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Application ID</p>
                      <p className="font-mono">{app._id}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Submission Date</p>
                      <p>{formatDate(app.createdAt)}</p>
                    </div>
                    <div>
                      <p className="text-gray-500 mb-1">Status</p>
                      <Badge className={getStatusColor(app.status)}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </div>
                  </div>

                  <div className="mt-4">
                    <Button asChild className="mr-2">
                      <Link href={`/applicants/dashboard/application/${app._id}`}>View Full Details</Link>
                    </Button>
                    <Button variant="outline">Download PDF</Button>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}

      <div className="mt-6">
        <Button onClick={fetchApplications} variant="outline" className="mr-2">
          Refresh
        </Button>
        <Button asChild>
          <Link href="/applicants/dashboard/submit">Submit New Application</Link>
        </Button>
      </div>
    </div>
  )
}

export default ApplicationPage
