/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/no-unescaped-entities */
"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
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
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import {
  AlertCircle,
  ArrowLeft,
  Calendar,
  CheckCircle,
  Download,
  FileText,
  Mail,
  MapPin,
  Pencil,
  Trash2,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import {toast} from 'react-hot-toast'

interface ProjectDetails {
  _id: string
  projectName: string
  projectTitle: string
  orgName: string
  orgType: string
  repName: string
  email: string
  selectedProvince: string
  selectedDistrict: string
  selectedSector: string
  selectedCell: string
  selectedVillage: string
  contactFirstName: string
  contactFamilyName: string
  contactEmail: string
  contactPersonIfNotLegal: string
  projectPartners: string
  projectTeamMembers: string
  placeOfImplementation: string
  startDate: string
  endDate: string
  projectDescription: string
  projectMainObjective: string
  specificObjectives: string
  implementationPlan: string
  targetGroups: string
  communicationPlan: string
  supportingDocuments: string[]
  status: string
  marks: number
  createdAt: string
  updatedAt: string
  feedback: string
}

const ApplicationDetailPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<string>("")
  const [marks, setMarks] = useState<number>(0)
  const [emailDialogOpen, setEmailDialogOpen] = useState<boolean>(false)
  const [emailSubject, setEmailSubject] = useState<string>("")
  const [emailBody, setEmailBody] = useState<string>("")

  useEffect(() => {
    if (params.id) {
      fetchApplicationDetails(params.id as string)
    }
  }, [params.id])

  const fetchApplicationDetails = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`/api/admin/application/${id}`)
      console.log("Response data:", response.data)
      setApplication(response.data.application)
      setMarks(response.data.application.marks || 0)
      setFeedback(response.data.application.feedback || "")
    } catch (err: any) {
      console.error("Error fetching application details:", err)
      setError(err.response?.data?.message || "Failed to fetch application details.")
    } finally {
      setLoading(false)
    }
  }

  const handleStatusChange = async (newStatus: string) => {
    if (!application) return

    try {
      await axios.patch(`/api/admin/application/${application._id}/status`, {
        status: newStatus,
        feedback,
        marks,
      })
      setApplication({ ...application, status: newStatus, feedback, marks })
      toast.success(`Application status updated to ${newStatus}.`)
    } catch (err: any) {
      console.error("Error updating application status:", err)
      toast.error(err.response?.data?.message || "Failed to update application status.")
    }
  }

  const handleSaveFeedback = async () => {
    if (!application) return

    try {
      await axios.patch(`/api/admin/application/${application._id}/feedback`, {
        feedback,
        marks,
      })
      setApplication({ ...application, feedback, marks })
      toast.success("Feedback and marks saved successfully.")
    } catch (err: any) {
      console.error("Error saving feedback:", err)
      toast.error(err.response?.data?.message || "Failed to save feedback.")
    }
  }

  const handleDelete = async () => {
    if (!application) return
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return

    try {
      await axios.delete(`/api/admin/application/${application._id}`)
      toast.success("Application deleted successfully.")
      router.push("/admin/dashboard/application")
    } catch (err: any) {
      console.error("Error deleting application:", err)
      toast.error(err.response?.data?.message || "Failed to delete application.")
    }
  }

  const handleSendEmail = async () => {
    if (!application) return

    try {
      await axios.post(`/api/admin/application/${application._id}/email`, {
        subject: emailSubject,
        body: emailBody,
      })
      toast.success("Email sent successfully.")
      setEmailDialogOpen(false)
    } catch (err: any) {
      console.error("Error sending email:", err)
      toast.error(err.response?.data?.message || "Failed to send email.")
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
            <CheckCircle className="mr-1 h-4 w-4" />
            Approved
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
            <XCircle className="mr-1 h-4 w-4" />
            Rejected
          </Badge>
        )
      case "pending":
      default:
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
            <AlertCircle className="mr-1 h-4 w-4" />
            Pending
          </Badge>
        )
    }
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const prepareApprovalEmail = () => {
    if (!application) return
    setEmailSubject(`Your UNESCO Application Has Been Approved - ${application.projectTitle}`)
    setEmailBody(`Dear ${application.contactFirstName} ${application.contactFamilyName},

We are pleased to inform you that your application for the UNESCO Participation Programme has been approved.

Project Title: ${application.projectTitle}
Application ID: ${application._id}

${feedback ? `Feedback from the review committee:\n${feedback}\n` : ""}

Next steps:
1. Please review the attached documentation for further instructions.
2. Complete any additional requirements as specified.
3. Our team will contact you shortly to discuss the implementation timeline.

If you have any questions, please don't hesitate to contact us.

Thank you for your participation in the UNESCO programme.

Best regards,
UNESCO Participation Programme Team`)
    setEmailDialogOpen(true)
  }

  const prepareRejectionEmail = () => {
    if (!application) return
    setEmailSubject(`Update on Your UNESCO Application - ${application.projectTitle}`)
    setEmailBody(`Dear ${application.contactFirstName} ${application.contactFamilyName},

Thank you for your application to the UNESCO Participation Programme.

After careful review, we regret to inform you that your application has not been selected for the current funding cycle.

Project Title: ${application.projectTitle}
Application ID: ${application._id}

${feedback ? `Feedback from the review committee:\n${feedback}\n` : ""}

We encourage you to apply again in the future. If you have any questions or would like more detailed feedback, please don't hesitate to contact us.

Best regards,
UNESCO Participation Programme Team`)
    setEmailDialogOpen(true)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div className="h-8 w-64 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="h-6 w-32 bg-gray-200 animate-pulse rounded mb-4"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
          <div className="h-40 bg-gray-200 animate-pulse rounded"></div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="flex items-center gap-3 p-4 border border-red-200 bg-red-50 rounded-lg text-red-700">
          <AlertCircle className="h-5 w-5" />
          <p>{error}</p>
        </div>
        <Button onClick={() => fetchApplicationDetails(params.id as string)} className="mt-4">
          Try Again
        </Button>
      </div>
    )
  }

  if (!application) {
    return (
      <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">Application not found</h3>
          <p className="text-gray-500 mt-2">
            The application you're looking for doesn't exist or you don't have permission to view it.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/admin/dashboard/application">View All Applications</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-2xl font-bold">Application Details</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/dashboard/application/${application._id}/edit`}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit
            </Link>
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEmailDialogOpen(true)}>
            <Mail className="h-4 w-4 mr-2" />
            Email Applicant
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
          <Button variant="destructive" size="sm" onClick={handleDelete}>
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {getStatusBadge(application.status)}
          <span className="text-sm text-gray-500">
            ID: <span className="font-mono">{application._id}</span>
          </span>
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          Submitted on {formatDate(application.createdAt)}
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList className="mb-6">
          <TabsTrigger value="details">Application Details</TabsTrigger>
          <TabsTrigger value="review">Review & Feedback</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="details">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-500">Project Title</h3>
                      <p className="mt-1">{application.projectTitle}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Project Name</h3>
                      <p className="mt-1">{application.projectName}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Start Date</h3>
                      <p className="mt-1">{formatDate(application.startDate)}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">End Date</h3>
                      <p className="mt-1">{formatDate(application.endDate)}</p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="font-medium text-gray-500">Place of Implementation</h3>
                      <p className="mt-1 flex items-center">
                        <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                        {application.placeOfImplementation}
                      </p>
                    </div>
                    <div className="md:col-span-2">
                      <h3 className="font-medium text-gray-500">Project Description</h3>
                      <p className="mt-1 whitespace-pre-line">{application.projectDescription}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Project Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-medium text-gray-500">Project Main Objective</h3>
                      <p className="mt-1 whitespace-pre-line">{application.projectMainObjective}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-gray-500">Specific Objectives</h3>
                      <p className="mt-1 whitespace-pre-line">{application.specificObjectives}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-gray-500">Implementation Plan</h3>
                      <p className="mt-1 whitespace-pre-line">{application.implementationPlan}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-gray-500">Target Groups</h3>
                      <p className="mt-1 whitespace-pre-line">{application.targetGroups}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-gray-500">Communication Plan</h3>
                      <p className="mt-1 whitespace-pre-line">{application.communicationPlan}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Location</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <h3 className="font-medium text-gray-500">Province</h3>
                      <p className="mt-1">{application.selectedProvince}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">District</h3>
                      <p className="mt-1">{application.selectedDistrict}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Sector</h3>
                      <p className="mt-1">{application.selectedSector}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Cell</h3>
                      <p className="mt-1">{application.selectedCell}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Village</h3>
                      <p className="mt-1">{application.selectedVillage}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Organization Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-500">Organization Name</h3>
                      <p className="mt-1">{application.orgName}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Organization Type</h3>
                      <p className="mt-1">{application.orgType}</p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Representative Name</h3>
                      <p className="mt-1">{application.repName}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Contact Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-500">Contact Person</h3>
                      <p className="mt-1">
                        {application.contactFirstName} {application.contactFamilyName}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Email</h3>
                      <p className="mt-1">
                        <a href={`mailto:${application.contactEmail}`} className="text-blue-600 hover:underline">
                          {application.contactEmail}
                        </a>
                      </p>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Primary Email</h3>
                      <p className="mt-1">
                        <a href={`mailto:${application.email}`} className="text-blue-600 hover:underline">
                          {application.email}
                        </a>
                      </p>
                    </div>
                    {application.contactPersonIfNotLegal && (
                      <div>
                        <h3 className="font-medium text-gray-500">Alternative Contact</h3>
                        <p className="mt-1">{application.contactPersonIfNotLegal}</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      className="w-full"
                      onClick={() => handleStatusChange("approved")}
                      disabled={application.status === "approved"}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Approve Application
                    </Button>
                    <Button
                      variant="destructive"
                      className="w-full"
                      onClick={() => handleStatusChange("rejected")}
                      disabled={application.status === "rejected"}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Reject Application
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => handleStatusChange("pending")}
                      disabled={application.status === "pending"}
                    >
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Mark as Pending
                    </Button>
                    <Separator />
                    <Button variant="outline" className="w-full" onClick={prepareApprovalEmail}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Approval Email
                    </Button>
                    <Button variant="outline" className="w-full" onClick={prepareRejectionEmail}>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Rejection Email
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="review">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Review & Feedback</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label htmlFor="marks">Evaluation Score (0-100)</Label>
                      <Input
                        id="marks"
                        type="number"
                        min="0"
                        max="100"
                        value={marks}
                        onChange={(e) => setMarks(Number.parseInt(e.target.value) || 0)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feedback">Feedback & Notes</Label>
                      <Textarea
                        id="feedback"
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="mt-1 min-h-[200px]"
                        placeholder="Enter your feedback, notes, or comments about this application..."
                      />
                    </div>
                    <Button onClick={handleSaveFeedback}>Save Feedback & Score</Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardHeader>
                  <CardTitle>Evaluation Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium text-gray-500">Current Status</h3>
                      <div className="mt-2">{getStatusBadge(application.status)}</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Score</h3>
                      <div className="mt-1 text-2xl font-bold">{application.marks || 0}/100</div>
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-500">Last Updated</h3>
                      <p className="mt-1">{formatDate(application.updatedAt)}</p>
                    </div>
                    <Separator />
                    <div>
                      <h3 className="font-medium text-gray-500">Decision Actions</h3>
                      <div className="mt-3 space-y-3">
                        <Button
                          className="w-full"
                          onClick={() => handleStatusChange("approved")}
                          disabled={application.status === "approved"}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Approve
                        </Button>
                        <Button
                          variant="destructive"
                          className="w-full"
                          onClick={() => handleStatusChange("rejected")}
                          disabled={application.status === "rejected"}
                        >
                          <XCircle className="mr-2 h-4 w-4" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Supporting Documents</CardTitle>
            </CardHeader>
            <CardContent>
              {application.supportingDocuments && application.supportingDocuments.length > 0 ? (
                <div className="space-y-4">
                  {application.supportingDocuments.map((doc, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 border rounded-md hover:bg-gray-50"
                    >
                      <div className="flex items-center">
                        <FileText className="h-5 w-5 mr-3 text-blue-500" />
                        <span>{doc}</span>
                      </div>
                      <Button variant="ghost" size="sm">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium">No documents attached</h3>
                  <p className="text-gray-500 mt-2">This application doesn't have any supporting documents.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Application History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="flex-shrink-0 h-4 w-4 rounded-full bg-blue-500 mt-1"></div>
                  <div className="ml-3">
                    <p className="font-medium">Application Created</p>
                    <p className="text-sm text-gray-500">{formatDate(application.createdAt)}</p>
                    <p className="mt-1">
                      Application submitted by {application.contactFirstName} {application.contactFamilyName}
                    </p>
                  </div>
                </div>

                {application.status !== "pending" && (
                  <div className="flex items-start">
                    <div
                      className={`flex-shrink-0 h-4 w-4 rounded-full mt-1 ${
                        application.status === "approved" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <div className="ml-3">
                      <p className="font-medium">
                        Application {application.status === "approved" ? "Approved" : "Rejected"}
                      </p>
                      <p className="text-sm text-gray-500">{formatDate(application.updatedAt)}</p>
                      {application.feedback && (
                        <div className="mt-2 p-3 bg-gray-50 rounded-md">
                          <p className="text-sm font-medium">Feedback:</p>
                          <p className="mt-1 whitespace-pre-line">{application.feedback}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Placeholder for future history events */}
                <div className="text-center py-4 text-gray-500">
                  <p>End of application history</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Email Dialog */}
      <Dialog open={emailDialogOpen} onOpenChange={setEmailDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Send Email to Applicant</DialogTitle>
            <DialogDescription>
              This email will be sent to {application.contactEmail || application.email}
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
            <Button variant="outline" onClick={() => setEmailDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail}>Send Email</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default ApplicationDetailPage
