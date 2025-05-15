/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import React, { useState, useEffect } from "react"
import axios from "axios"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertCircle, CheckCircle, Download, Eye, Filter, MoreHorizontal, Pencil, RefreshCw, Search, Trash2, XCircle } from 'lucide-react'
import Link from "next/link"
import { toast } from "react-hot-toast"

interface Application {
  _id: string
  projectName: string
  projectTitle: string
  orgName: string
  email: string
  contactFirstName: string
  contactFamilyName: string
  status: string
  createdAt: string
  marks: number
}

const AdminDashboard: React.FC = () => {
  const [applications, setApplications] = useState<Application[]>([])
  const [filteredApplications, setFilteredApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [sortField, setSortField] = useState<string>("createdAt")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  useEffect(() => {
    fetchApplications()
  }, [])

  useEffect(() => {
    filterAndSortApplications()
  }, [applications, searchTerm, statusFilter, sortField, sortDirection])

  const fetchApplications = async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await axios.get("/api/admin/application")
      console.log("Fetched applications:", response.data)
      setApplications(response.data.applications || [])
    } catch (err: any) {
      console.error("Error fetching applications:", err)
      setError(err.response?.data?.message || "Failed to fetch applications.")
    } finally {
      setLoading(false)
    }
  }

  const filterAndSortApplications = () => {
    let filtered = [...applications]

    // Apply status filter
    if (statusFilter !== "all") {
      filtered = filtered.filter((app) => app.status.toLowerCase() === statusFilter.toLowerCase())
    }

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (app) =>
          app.projectTitle.toLowerCase().includes(term) ||
          app.projectName.toLowerCase().includes(term) ||
          app.orgName.toLowerCase().includes(term) ||
          app.email.toLowerCase().includes(term) ||
          `${app.contactFirstName} ${app.contactFamilyName}`.toLowerCase().includes(term),
      )
    }

    // Apply sorting
    filtered.sort((a, b) => {
      let aValue: any = a[sortField as keyof Application]
      let bValue: any = b[sortField as keyof Application]

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

    setFilteredApplications(filtered)
  }

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this application? This action cannot be undone.")) return

    try {
      await axios.delete(`/api/admin/application/${id}`)
      setApplications((prev) => prev.filter((app) => app._id !== id))
      toast.success("Application deleted successfully.")
    } catch (err: any) {
      console.error("Error deleting application:", err)
      toast.error(err.response?.data?.message || "Failed to delete application.")
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await axios.patch(`/api/admin/application/${id}/status`, { status: newStatus })
      setApplications((prev) =>
        prev.map((app) => (app._id === id ? { ...app, status: newStatus } : app)),
      )
      toast.success(`Application status updated to ${newStatus}.`)
    } catch (err: any) {
      console.error("Error updating application status:", err)
      toast.error(err.response?.data?.message || "Failed to update application status.")
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

  const getSortIcon = (field: string) => {
    if (sortField !== field) return null
    return sortDirection === "asc" ? "↑" : "↓"
  }

  const getApplicationsStats = () => {
    const total = applications.length
    const approved = applications.filter((app) => app.status.toLowerCase() === "approved").length
    const rejected = applications.filter((app) => app.status.toLowerCase() === "rejected").length
    const pending = applications.filter((app) => app.status.toLowerCase() === "pending").length

    return { total, approved, rejected, pending }
  }

  const stats = getApplicationsStats()

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Applications Dashboard</h1>
        <div className="flex justify-center items-center h-64">
          <div className="flex flex-col items-center">
            <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
            <p className="mt-4 text-lg">Loading applications...</p>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-6">Applications Dashboard</h1>
        <div className="bg-red-50 border border-red-200 rounded-md p-4 flex items-start">
          <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
          <div>
            <h3 className="text-red-800 font-medium">Error loading applications</h3>
            <p className="text-red-700 mt-1">{error}</p>
            <Button onClick={fetchApplications} variant="outline" className="mt-4">
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Applications Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Total Applications
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-600">{stats.pending}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Approved</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">{stats.approved}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Rejected</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-red-600">{stats.rejected}</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search applications..."
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
          <Button variant="outline" onClick={fetchApplications}>
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="border rounded-md overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("projectTitle")}
              >
                Project Title {getSortIcon("projectTitle")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("orgName")}
              >
                Organization {getSortIcon("orgName")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("contactName")}
              >
                Contact Person {getSortIcon("contactName")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("createdAt")}
              >
                Submission Date {getSortIcon("createdAt")}
              </TableHead>
              <TableHead
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => handleSort("status")}
              >
                Status {getSortIcon("status")}
              </TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredApplications.length > 0 ? (
              filteredApplications.map((app) => (
                <TableRow key={app._id}>
                  <TableCell className="font-medium">{app.projectTitle}</TableCell>
                  <TableCell>{app.orgName}</TableCell>
                  <TableCell>
                    {app.contactFirstName} {app.contactFamilyName}
                    <div className="text-xs text-gray-500">{app.email}</div>
                  </TableCell>
                  <TableCell>{formatDate(app.createdAt)}</TableCell>
                  <TableCell>{getStatusBadge(app.status)}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Actions</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/dashboard/application/${app._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link href={`/admin/dashboard/application/${app._id}/edit`}>
                            <Pencil className="mr-2 h-4 w-4" />
                            Edit
                          </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(app._id, "approved")}
                          disabled={app.status === "approved"}
                        >
                          <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleStatusChange(app._id, "rejected")}
                          disabled={app.status === "rejected"}
                        >
                          <XCircle className="mr-2 h-4 w-4 text-red-600" />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDelete(app._id)}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8">
                  {applications.length === 0 ? (
                    <div className="flex flex-col items-center">
                      <AlertCircle className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">No applications found</p>
                      <p className="text-gray-500 mt-1">
                        There are no applications submitted to the system yet.
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center">
                      <Search className="h-8 w-8 text-gray-400 mb-2" />
                      <p className="text-lg font-medium">No matching applications</p>
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
    </div>
  )
}

export default AdminDashboard
