/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react/no-unescaped-entities */
"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, ArrowLeft, Calendar, Save } from 'lucide-react'
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
  feedback: string
  createdAt: string
  updatedAt: string
}

const EditApplicationPage: React.FC = () => {
  const params = useParams()
  const router = useRouter()
  const [application, setApplication] = useState<ProjectDetails | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [saving, setSaving] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState<Partial<ProjectDetails>>({})

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
      
      const appData = response.data.application
      setApplication(appData)
      setFormData(appData)
    } catch (err: any) {
      toast.error("Failed to load application details.")
      console.error("Error fetching application details:", err)
      setError(err.response?.data?.message || "Failed to fetch application details.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleDateChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      await axios.put(`/api/admin/application/${params.id}`, formData)
      toast.success("Application updated successfully!")
      router.push(`/admin/dashboard/application/${params.id}`)
    } catch (err: any) {
      console.error("Error updating application:", err)
      toast.success(err.response?.data?.message || "Failed to update application.")
    } finally {
      setSaving(false)
    }
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
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <h3 className="text-lg font-medium">Application not found</h3>
          <p className="text-gray-500 mt-2">
            The application you're looking for doesn't exist or you don't have permission to edit it.
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
          <h1 className="text-2xl font-bold">Edit Application</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/dashboard/application/${application._id}`}>Cancel</Link>
          </Button>
          <Button size="sm" onClick={handleSubmit} disabled={saving}>
            {saving ? (
              <>
                <Calendar className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="projectTitle">Project Title</Label>
                <Input
                  id="projectTitle"
                  name="projectTitle"
                  value={formData.projectTitle || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="projectName">Project Name</Label>
                <Input
                  id="projectName"
                  name="projectName"
                  value={formData.projectName || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  name="startDate"
                  type="date"
                  value={
                    formData.startDate
                      ? new Date(formData.startDate).toISOString().split("T")[0]
                      : ""
                  }
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  name="endDate"
                  type="date"
                  value={
                    formData.endDate ? new Date(formData.endDate).toISOString().split("T")[0] : ""
                  }
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="placeOfImplementation">Place of Implementation</Label>
                <Input
                  id="placeOfImplementation"
                  name="placeOfImplementation"
                  value={formData.placeOfImplementation || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="projectDescription">Project Description</Label>
                <Textarea
                  id="projectDescription"
                  name="projectDescription"
                  value={formData.projectDescription || ""}
                  onChange={handleInputChange}
                  className="mt-1 min-h-[150px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Organization Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="orgName">Organization Name</Label>
                <Input
                  id="orgName"
                  name="orgName"
                  value={formData.orgName || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="orgType">Organization Type</Label>
                <Input
                  id="orgType"
                  name="orgType"
                  value={formData.orgType || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="repName">Representative Name</Label>
                <Input
                  id="repName"
                  name="repName"
                  value={formData.repName || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="email">Primary Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contactFirstName">First Name</Label>
                <Input
                  id="contactFirstName"
                  name="contactFirstName"
                  value={formData.contactFirstName || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactFamilyName">Family Name</Label>
                <Input
                  id="contactFamilyName"
                  name="contactFamilyName"
                  value={formData.contactFamilyName || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactEmail">Contact Email</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="contactPersonIfNotLegal">Alternative Contact (if not legal)</Label>
                <Input
                  id="contactPersonIfNotLegal"
                  name="contactPersonIfNotLegal"
                  value={formData.contactPersonIfNotLegal || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
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
                <Label htmlFor="projectMainObjective">Project Main Objective</Label>
                <Textarea
                  id="projectMainObjective"
                  name="projectMainObjective"
                  value={formData.projectMainObjective || ""}
                  onChange={handleInputChange}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <Separator />
              <div>
                <Label htmlFor="specificObjectives">Specific Objectives</Label>
                <Textarea
                  id="specificObjectives"
                  name="specificObjectives"
                  value={formData.specificObjectives || ""}
                  onChange={handleInputChange}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <Separator />
              <div>
                <Label htmlFor="implementationPlan">Implementation Plan</Label>
                <Textarea
                  id="implementationPlan"
                  name="implementationPlan"
                  value={formData.implementationPlan || ""}
                  onChange={handleInputChange}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <Separator />
              <div>
                <Label htmlFor="targetGroups">Target Groups</Label>
                <Textarea
                  id="targetGroups"
                  name="targetGroups"
                  value={formData.targetGroups || ""}
                  onChange={handleInputChange}
                  className="mt-1 min-h-[100px]"
                />
              </div>
              <Separator />
              <div>
                <Label htmlFor="communicationPlan">Communication Plan</Label>
                <Textarea
                  id="communicationPlan"
                  name="communicationPlan"
                  value={formData.communicationPlan || ""}
                  onChange={handleInputChange}
                  className="mt-1 min-h-[100px]"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Location</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <Label htmlFor="selectedProvince">Province</Label>
                <Input
                  id="selectedProvince"
                  name="selectedProvince"
                  value={formData.selectedProvince || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="selectedDistrict">District</Label>
                <Input
                  id="selectedDistrict"
                  name="selectedDistrict"
                  value={formData.selectedDistrict || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="selectedSector">Sector</Label>
                <Input
                  id="selectedSector"
                  name="selectedSector"
                  value={formData.selectedSector || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="selectedCell">Cell</Label>
                <Input
                  id="selectedCell"
                  name="selectedCell"
                  value={formData.selectedCell || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="selectedVillage">Village</Label>
                <Input
                  id="selectedVillage"
                  name="selectedVillage"
                  value={formData.selectedVillage || ""}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Application Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status || "pending"}
                  onValueChange={(value) => handleSelectChange("status", value)}
                >
                  <SelectTrigger id="status" className="mt-1">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="approved">Approved</SelectItem>
                    <SelectItem value="rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="marks">Evaluation Score (0-100)</Label>
                <Input
                  id="marks"
                  name="marks"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.marks || 0}
                  onChange={handleInputChange}
                  className="mt-1"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="feedback">Feedback & Notes</Label>
                <Textarea
                  id="feedback"
                  name="feedback"
                  value={formData.feedback || ""}
                  onChange={handleInputChange}
                  className="mt-1 min-h-[150px]"
                  placeholder="Enter feedback, notes, or comments about this application..."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end gap-4">
          <Button variant="outline" type="button" asChild>
            <Link href={`/admin/dashboard/application/${application._id}`}>Cancel</Link>
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Calendar className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default EditApplicationPage
