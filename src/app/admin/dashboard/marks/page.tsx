/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { AlertCircle, ArrowUpDown, CheckCircle, Filter, RefreshCw, Save, Search, Send, XCircle } from "lucide-react"
import Link from "next/link"
import {toast} from "react-hot-toast"

interface Project {
  _id: string
  projectName: string
  projectTitle: string
  orgName: string
  email: string
  contactFirstName: string
  contactFamilyName: string
  status: string
  marks: number
  feedback: string
  createdAt: string
}

const MarksAdminPage: React.FC = () => {
  const router = useRouter()
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<{ [key: string]: boolean }>({})
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [marksUpdates, setMarksUpdates] = useState<{ [key: string]: number }>({})
  const [feedbackUpdates, setFeedbackUpdates] = useState<{ [key: string]: string }>({})
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [feedbackDialogOpen, setFeedbackDialogOpen] = useState<boolean>(false)
  const [notifyDialogOpen, setNotifyDialogOpen] = useState<boolean>(false)
  const [emailSubject, setEmailSubject] = useState<string>("")
  const [emailBody, setEmailBody] = useState<string>("")

  useEffect(() => {
    fetchProjects()
  }, [])

  useEffect(() => {
    filterAndSortProjects()
  }, [projects, searchTerm, statusFilter, sortField, sortDirection])

  const fetchProjects = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get("/api/admin/application")
      console.log("Fetched projects:", response.data)

      const projectsData = response.data.applications || []
      setProjects(projectsData)

      // Initialize marks and feedback updates
      const initialMarks: { [key: string]: number } = {}
      const initialFeedback: { [key: string]: string } = {}

      projectsData.forEach((project: Project) => {
        initialMarks[project._id] = project.marks || 0
        initialFeedback[project._id] = project.feedback || ""
      })

      setMarksUpdates(initialMarks)
      setFeedbackUpdates(initialFeedback)
    } catch (err: any) {
      console.error("Error fetching projects:", err)
      setError(err.response?.data?.message || "Failed to fetch projects.")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortProjects = () => {
    let filtered = [...projects]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((project) => project.status.toLowerCase() === statusFilter.toLowerCase())
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (project) =>
          project.projectTitle.toLowerCase().includes(term) ||
          project.projectName.toLowerCase().includes(term) ||
          project.orgName.toLowerCase().includes(term) ||
          `${project.contactFirstName} ${project.contactFamilyName}`.toLowerCase().includes(term),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof Project]
      let bValue: any = b[sortField as keyof Project]

      // Handle special cases
      if (sortField === "contactName") {
        aValue = `${a.contactFirstName} ${a.contactFamilyName}`
        bValue = `${b.contactFirstName} ${b.contactFamilyName}`
      }

      if (sortDirection === "asc") {
        return aValue > bValue ? 1 : -1
      } else {
        return aValue < bValue ? 1 : -1
      }
    })

    setFilteredProjects(filtered)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleMarksChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value, 10) || 0
    // Ensure marks are between 0 and 100
    const validValue = Math.min(Math.max(numValue, 0), 100)
    setMarksUpdates((prev) => ({ ...prev, [id]: validValue }))
  }

  const handleFeedbackChange = (id: string, value: string) => {
    setFeedbackUpdates((prev) => ({ ...prev, [id]: value }))
  }

  const handleSaveMarks = async (id: string) => {
    setSaving((prev) => ({ ...prev, [id]: true }))
    try {
      const updatedMarks = marksUpdates[id]
      const updatedFeedback = feedbackUpdates[id]

      await axios.patch(`/api/admin/application/${id}/feedback`, {
        marks: updatedMarks,
        feedback: updatedFeedback,
      })

      // Update local state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === id ? { ...project, marks: updatedMarks, feedback: updatedFeedback } : project,
        ),
      )

      toast.success("Marks and feedback updated successfully!")
    } catch (err: any) {
      console.error("Error updating marks:", err)
      toast.error(err.response?.data?.message || "Failed to update marks and feedback.")
    } finally {
      setSaving((prev) => ({ ...prev, [id]: false }))
    }
  }

  const openFeedbackDialog = (project: Project) => {
    setSelectedProject(project)
    setFeedbackDialogOpen(true)
  }

  const saveFeedbackAndMarks = async () => {
    if (!selectedProject) return

    setSaving((prev) => ({ ...prev, [selectedProject._id]: true }))
    try {
      const updatedMarks = marksUpdates[selectedProject._id]
      const updatedFeedback = feedbackUpdates[selectedProject._id]

      await axios.patch(`/api/admin/application/${selectedProject._id}/feedback`, {
        marks: updatedMarks,
        feedback: updatedFeedback,
      })

      // Update local state
      setProjects((prevProjects) =>
        prevProjects.map((project) =>
          project._id === selectedProject._id
            ? { ...project, marks: updatedMarks, feedback: updatedFeedback }
            : project,
        ),
      )

      setFeedbackDialogOpen(false)
      toast.success("Marks and feedback updated successfully!")
    } catch (err: any) {
      console.error("Error updating marks and feedback:", err)
      toast.error(err.response?.data?.message || "Failed to update marks and feedback.")
    } finally {
      setSaving((prev) => ({ ...prev, [selectedProject._id]: false }))
    }
  }

  const openNotifyDialog = (project: Project) => {
    setSelectedProject(project)

    // Pre-populate email subject and body
    setEmailSubject(`Your UNESCO Application Evaluation - ${project.projectTitle}`)
    setEmailBody(`Dear ${project.contactFirstName} ${project.contactFamilyName},

We have completed the evaluation of your application to the UNESCO Participation Programme.

Project Title: ${project.projectTitle}
Application ID: ${project._id}
Evaluation Score: ${project.marks}/100

${project.feedback ? `Feedback from the evaluation committee:\n${project.feedback}\n` : ""}

You can view your complete application details by logging into your dashboard.

Thank you for your participation in the UNESCO programme.

Best regards,
UNESCO Participation Programme Team`)

    setNotifyDialogOpen(true)
  }

  const sendNotificationEmail = async () => {
    if (!selectedProject) return

    try {
      await axios.post(`/api/admin/application/${selectedProject._id}/email`, {
        subject: emailSubject,
        body: emailBody,
      })

      setNotifyDialogOpen(false)
      toast.success("Notification email sent successfully!")
    } catch (err: any) {
      console.error("Error sending notification:", err)
      toast.error(err.response?.data?.message || "Failed to send notification email.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Rejected
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <AlertCircle className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        )
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
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Project Evaluation</h1>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-4 text-lg">Loading projects...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Project Evaluation</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading projects</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <Button onClick={fetchProjects} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Project Evaluation</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Projects</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{projects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Evaluated</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">{projects.filter((p) => p.marks > 0).length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Average Score</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {projects.length > 0
                ? Math.round(projects.reduce((sum, p) => sum + (p.marks || 0), 0) / projects.length)
                : 0}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Evaluation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{projects.filter((p) => !p.marks).length}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search projects..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <div className="w-48">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder="Filter by status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <Button variant="outline" onClick={fetchProjects}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Projects Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("projectTitle")}>
                Project Title
                <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("contactName")}>
                Applicant
                <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("status")}>
                Status
                <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead className="cursor-pointer hover:bg-gray-50" onClick={() => handleSort("marks")}>
                Score
                <ArrowUpDown className="ml-1 h-3 w-3 inline" />
              </TableHead>
              <TableHead>Assign Score</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project) => (
                <TableRow key={project._id}>
                  <TableCell className="font-medium">
                    <Link
                      href={`/admin/dashboard/application/${project._id}`}
                      className="hover:underline text-blue-600"
                    >
                      {project.projectTitle}
                    </Link>
                    <div className="text-xs text-gray-500">{project.orgName}</div>
                  </TableCell>
                  <TableCell>
                    {project.contactFirstName} {project.contactFamilyName}
                    <div className="text-xs text-gray-500">{project.email}</div>
                  </TableCell>
                  <TableCell>{getStatusBadge(project.status)}</TableCell>
                  <TableCell className="font-medium">
                    {project.marks ? (
                      <span
                        className={`text-lg ${
                          project.marks >= 70
                            ? "text-green-600"
                            : project.marks >= 50
                              ? "text-yellow-600"
                              : "text-red-600"
                        }`}
                      >
                        {project.marks}
                      </span>
                    ) : (
                      <span className="text-gray-400">Not scored</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <Input
                        type="number"
                        value={marksUpdates[project._id] || 0}
                        onChange={(e) => handleMarksChange(project._id, e.target.value)}
                        className="w-20 text-center"
                        min="0"
                        max="100"
                      />
                      <span className="ml-1 text-gray-500">/100</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openFeedbackDialog(project)}>
                        Feedback
                      </Button>
                      <Button size="sm" onClick={() => handleSaveMarks(project._id)} disabled={saving[project._id]}>
                        {saving[project._id] ? (
                          <>
                            <RefreshCw className="mr-1 h-3 w-3 animate-spin" />
                            Saving
                          </>
                        ) : (
                          <>
                            <Save className="mr-1 h-3 w-3" />
                            Save
                          </>
                        )}
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openNotifyDialog(project)}>
                        <Send className="h-3 w-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {projects.length === 0 ? (
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">No projects found</p>
                      <p className="text-gray-500 mt-1">There are no projects submitted to the system yet.</p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">No matching projects</p>
                      <p className="text-gray-500 mt-1">
                        Try adjusting your search or filter to find what you&apos;re looking for.
                      </p>
                      <Button
                        variant="outline"
                        className="mt-4"
                        onClick={() => {
                          setSearchTerm("")
                          setStatusFilter("all")
                        }}
                      >
                        Clear filters
                      </Button>
                    </div>
                  )}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Feedback Dialog */}
      <Dialog open={feedbackDialogOpen} onOpenChange={setFeedbackDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Evaluation Feedback</DialogTitle>
            <DialogDescription>
              {selectedProject && (
                <>
                  Project: {selectedProject.projectTitle}
                  <br />
                  Applicant: {selectedProject.contactFirstName} {selectedProject.contactFamilyName}
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="marks-input">Evaluation Score (0-100)</Label>
              <Input
                id="marks-input"
                type="number"
                min="0"
                max="100"
                value={selectedProject ? marksUpdates[selectedProject._id] || 0 : 0}
                onChange={(e) => selectedProject && handleMarksChange(selectedProject._id, e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="feedback-input">Feedback & Comments</Label>
              <Textarea
                id="feedback-input"
                value={selectedProject ? feedbackUpdates[selectedProject._id] || "" : ""}
                onChange={(e) => selectedProject && handleFeedbackChange(selectedProject._id, e.target.value)}
                className="min-h-[200px]"
                placeholder="Provide detailed feedback about this project's evaluation..."
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={saveFeedbackAndMarks}>Save Evaluation</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Notification Dialog */}
      <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Evaluation Notification</DialogTitle>
            <DialogDescription>
              {selectedProject && <>This email will be sent to {selectedProject.email}</>}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="email-subject">Subject</Label>
              <Input id="email-subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email-body">Message</Label>
              <Textarea
                id="email-body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                className="min-h-[300px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setNotifyDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendNotificationEmail}>
              <Send className="mr-2 h-4 w-4" />
              Send Notification
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default MarksAdminPage
