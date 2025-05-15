"use client"

import type React from "react"
import { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, ArrowLeft, Calendar, Download, FileText, MapPin } from "lucide-react"
import Link from "next/link"
import { toast } from "react-hot-toast"


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
}

const ApplicationDetailPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (params.id) {
      fetchApplicationDetails(params.id as string)
    }
  }, [params.id])

  const fetchApplicationDetails = async (id: string) => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get(`/api/application/${id}`)

      setApplication(response.data.project)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      toast.error("Failed to load application details")
      console.error("Error fetching application details:", err)
      setError(err.response?.data?.message || "Failed to fetch application details.")
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
    if (!dateString) return "N/A"
    const date = new Date(dateString)
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-6 w-32 mb-4" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
          <Skeleton className="h-40" />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
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
      <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
        <Button variant="ghost" size="sm" className="mb-6" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <div className="text-center py-10">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">Application not found</h3>
          <p className="text-gray-500 mt-2">
            The application you&apos;re looking for doesn&apos;t exist or you don&apos;t have permission to view it.
          </p>
          <Button className="mt-4" asChild>
            <Link href="/applicants/dashboard/application">View All Applications</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-xl shadow-lg">
      <div className="flex items-center mb-6">
        <Button variant="ghost" size="sm" className="mr-4" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">Application Details</h1>
      </div>

      <div className="flex justify-between items-center mb-6">
        <Badge className={getStatusColor(application.status)}>
          {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
        </Badge>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          Submitted on {formatDate(application.createdAt)}
        </div>
      </div>

      <Card className="mb-6">
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
              <p className="mt-1">{application.projectDescription}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Organization Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <div>
              <h3 className="font-medium text-gray-500">Email</h3>
              <p className="mt-1">{application.email}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="font-medium text-gray-500">First Name</h3>
              <p className="mt-1">{application.contactFirstName}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Family Name</h3>
              <p className="mt-1">{application.contactFamilyName}</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-500">Email</h3>
              <p className="mt-1">{application.contactEmail}</p>
            </div>
            {application.contactPersonIfNotLegal && (
              <div className="md:col-span-2">
                <h3 className="font-medium text-gray-500">Contact Person (If Not Legal)</h3>
                <p className="mt-1">{application.contactPersonIfNotLegal}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Project Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-500">Project Main Objective</h3>
              <p className="mt-1">{application.projectMainObjective}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-gray-500">Specific Objectives</h3>
              <p className="mt-1">{application.specificObjectives}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-gray-500">Implementation Plan</h3>
              <p className="mt-1">{application.implementationPlan}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-gray-500">Target Groups</h3>
              <p className="mt-1">{application.targetGroups}</p>
            </div>
            <Separator />
            <div>
              <h3 className="font-medium text-gray-500">Communication Plan</h3>
              <p className="mt-1">{application.communicationPlan}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="mb-6">
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

      {application.supportingDocuments && application.supportingDocuments.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Supporting Documents</CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {application.supportingDocuments.map((doc, index) => (
                <li key={index} className="flex items-center">
                  <FileText className="h-4 w-4 mr-2 text-gray-500" />
                  <span className="flex-1 truncate">{doc}</span>
                  <Button variant="ghost" size="sm">
                    <Download className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between mt-8">
        <Button variant="outline" onClick={() => router.back()}>
          Back to Applications
        </Button>
        <Button>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>
    </div>
  )
}

export default ApplicationDetailPage
