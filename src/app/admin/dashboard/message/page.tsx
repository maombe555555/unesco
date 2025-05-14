"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDistanceToNow } from "date-fns"
import {
  Search,
  MoreVertical,
  Trash2,
  Mail,
  MailOpen,
  Reply,
  RefreshCcw,
  CheckCircle,
  XCircle,
  Filter,
} from "lucide-react"
import toast from "react-hot-toast"

// Define the shape of a message
interface Message {
  _id: string
  name: string
  email: string
  message: string
  createdAt: string
  isRead?: boolean
  status?: "pending" | "responded" | "archived"
}

const MessagePage: React.FC = () => {
  const router = useRouter()
  const [messages, setMessages] = useState<Message[]>([])
  const [filteredMessages, setFilteredMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [activeTab, setActiveTab] = useState<string>("all")
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null)
  const [isDetailOpen, setIsDetailOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [messageToDelete, setMessageToDelete] = useState<string | null>(null)
  const [isReplyDialogOpen, setIsReplyDialogOpen] = useState<boolean>(false)
  const [replyText, setReplyText] = useState<string>("")

  // Fetch messages when the component mounts
  useEffect(() => {
    fetchMessages()
  }, [])

  // Filter messages when search query or active tab changes
  useEffect(() => {
    filterMessages()
  }, [searchQuery, activeTab, messages])

  const fetchMessages = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/message")
      if (!response.ok) {
        throw new Error(`Error: ${response.status}`)
      }
      const data = await response.json()

      // Add isRead and status properties if they don't exist
      const enhancedData = data.map((msg: Message) => ({
        ...msg,
        isRead: msg.isRead || false,
        status: msg.status || "pending",
      }))

      setMessages(enhancedData)
    } catch (err: any) {
      setError(err.message || "An error occurred")
      
      toast.error("Failed to load messages. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const filterMessages = () => {
    let filtered = [...messages]

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      filtered = filtered.filter(
        (msg) =>
          msg.name.toLowerCase().includes(query) ||
          msg.email.toLowerCase().includes(query) ||
          msg.message.toLowerCase().includes(query),
      )
    }

    // Filter by tab
    if (activeTab !== "all") {
      if (activeTab === "unread") {
        filtered = filtered.filter((msg) => !msg.isRead)
      } else {
        filtered = filtered.filter((msg) => msg.status === activeTab)
      }
    }

    setFilteredMessages(filtered)
  }

  const handleMarkAsRead = async (id: string) => {
    try {
      // In a real app, you would update this in your database
      // For now, we'll just update the local state
      setMessages((prev) => prev.map((msg) => (msg._id === id ? { ...msg, isRead: true } : msg)))

      toast.success("Message marked as read")
    } catch (error) {
      
      toast.error("Failed to mark message as read")
    }
  }

  const handleUpdateStatus = async (id: string, status: "pending" | "responded" | "archived") => {
    try {
      // In a real app, you would update this in your database
      // For now, we'll just update the local state
      setMessages((prev) => prev.map((msg) => (msg._id === id ? { ...msg, status } : msg)))


      toast.success(`Message marked as ${status}`)
    } catch (error) {
          toast.error("Failed to update message status")
    }
  }

  const handleDeleteMessage = async () => {
    if (!messageToDelete) return

    try {
      const response = await fetch("/api/message", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: messageToDelete }),
      })

      if (!response.ok) {
        throw new Error("Failed to delete message")
      }

      setMessages((prev) => prev.filter((msg) => msg._id !== messageToDelete))
      setIsDeleteDialogOpen(false)
      setMessageToDelete(null)


      toast.success("Message deleted successfully")
    } catch (error) {
  
      toast.error("Failed to delete message")
    }
  }

  const handleReply = async () => {
    if (!selectedMessage || !replyText) return

    try {
      // In a real app, you would send the reply via email or save it
      // For now, we'll just update the message status
      setMessages((prev) =>
        prev.map((msg) => (msg._id === selectedMessage._id ? { ...msg, status: "responded", isRead: true } : msg)),
      )

      setIsReplyDialogOpen(false)
      setReplyText("")

      toast.success("Reply sent successfully")
    } catch (error) {
    
      toast.error("Failed to send reply")
    }
  }

  const openMessageDetail = (message: Message) => {
    setSelectedMessage(message)
    setIsDetailOpen(true)

    // Mark as read when opened
    if (!message.isRead) {
      handleMarkAsRead(message._id)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending</Badge>
      case "responded":
        return <Badge variant="success">Responded</Badge>
      case "archived":
        return <Badge variant="secondary">Archived</Badge>
      default:
        return null
    }
  }

  const getMessagePreview = (message: string) => {
    return message.length > 100 ? `${message.substring(0, 100)}...` : message
  }

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Messages</h1>
          <p className="text-muted-foreground">Manage incoming messages from users</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search messages..."
              className="pl-8 w-full md:w-[250px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" size="icon" onClick={fetchMessages}>
            <RefreshCcw className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">
              Unread
              {messages.filter((msg) => !msg.isRead).length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {messages.filter((msg) => !msg.isRead).length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="responded">Responded</TabsTrigger>
            <TabsTrigger value="archived">Archived</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Messages</CardTitle>
              <CardDescription>
                {filteredMessages.length} message{filteredMessages.length !== 1 ? "s" : ""} found
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                </div>
              ) : error ? (
                <div className="text-center text-red-500 p-4">{error}</div>
              ) : filteredMessages.length === 0 ? (
                <div className="text-center p-8 text-muted-foreground">
                  No messages found. {searchQuery && "Try a different search term."}
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[180px]">Sender</TableHead>
                        <TableHead className="w-[200px]">Email</TableHead>
                        <TableHead>Message</TableHead>
                        <TableHead className="w-[120px]">Status</TableHead>
                        <TableHead className="w-[120px]">Date</TableHead>
                        <TableHead className="w-[80px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredMessages.map((msg) => (
                        <TableRow
                          key={msg._id}
                          className={`cursor-pointer ${!msg.isRead ? "font-medium bg-muted/30" : ""}`}
                          onClick={() => openMessageDetail(msg)}
                        >
                          <TableCell className="font-medium">
                            {!msg.isRead && <div className="w-2 h-2 rounded-full bg-blue-500 inline-block mr-2"></div>}
                            {msg.name}
                          </TableCell>
                          <TableCell>{msg.email}</TableCell>
                          <TableCell>{getMessagePreview(msg.message)}</TableCell>
                          <TableCell>{getStatusBadge(msg.status || "pending")}</TableCell>
                          <TableCell>{formatDistanceToNow(new Date(msg.createdAt), { addSuffix: true })}</TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                <Button variant="ghost" size="icon">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                {!msg.isRead ? (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      handleMarkAsRead(msg._id)
                                    }}
                                  >
                                    <MailOpen className="mr-2 h-4 w-4" />
                                    Mark as read
                                  </DropdownMenuItem>
                                ) : (
                                  <DropdownMenuItem
                                    onClick={(e) => {
                                      e.stopPropagation()
                                      setMessages((prev) =>
                                        prev.map((m) => (m._id === msg._id ? { ...m, isRead: false } : m)),
                                      )
                                    }}
                                  >
                                    <Mail className="mr-2 h-4 w-4" />
                                    Mark as unread
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedMessage(msg)
                                    setIsReplyDialogOpen(true)
                                  }}
                                >
                                  <Reply className="mr-2 h-4 w-4" />
                                  Reply
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateStatus(msg._id, "pending")
                                  }}
                                >
                                  <Filter className="mr-2 h-4 w-4" />
                                  Mark as pending
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateStatus(msg._id, "responded")
                                  }}
                                >
                                  <CheckCircle className="mr-2 h-4 w-4" />
                                  Mark as responded
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleUpdateStatus(msg._id, "archived")
                                  }}
                                >
                                  <XCircle className="mr-2 h-4 w-4" />
                                  Archive
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive focus:text-destructive"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setMessageToDelete(msg._id)
                                    setIsDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  Delete
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Message Detail Dialog */}
      {selectedMessage && (
        <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Message from {selectedMessage.name}</DialogTitle>
              <DialogDescription>
                Received {formatDistanceToNow(new Date(selectedMessage.createdAt), { addSuffix: true })}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium">From:</p>
                <p>
                  {selectedMessage.name} &lt;{selectedMessage.email}&gt;
                </p>
              </div>
              <div>
                <p className="text-sm font-medium">Status:</p>
                <div className="mt-1">{getStatusBadge(selectedMessage.status || "pending")}</div>
              </div>
              <div>
                <p className="text-sm font-medium">Message:</p>
                <div className="mt-2 p-4 bg-muted rounded-md whitespace-pre-wrap">{selectedMessage.message}</div>
              </div>
            </div>
            <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:gap-0">
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  onClick={() => {
                    handleUpdateStatus(selectedMessage._id, "archived")
                    setIsDetailOpen(false)
                  }}
                >
                  Archive
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    setMessageToDelete(selectedMessage._id)
                    setIsDetailOpen(false)
                    setIsDeleteDialogOpen(true)
                  }}
                >
                  Delete
                </Button>
              </div>
              <Button
                onClick={() => {
                  setIsDetailOpen(false)
                  setIsReplyDialogOpen(true)
                }}
              >
                Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the message.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteMessage} className="bg-destructive text-destructive-foreground">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reply Dialog */}
      {selectedMessage && (
        <Dialog open={isReplyDialogOpen} onOpenChange={setIsReplyDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Reply to {selectedMessage.name}</DialogTitle>
              <DialogDescription>Your reply will be sent to {selectedMessage.email}</DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="bg-muted p-4 rounded-md">
                <p className="text-sm text-muted-foreground mb-2">Original message:</p>
                <p className="text-sm">{getMessagePreview(selectedMessage.message)}</p>
              </div>
              <div className="space-y-2">
                <label htmlFor="reply" className="text-sm font-medium">
                  Your reply:
                </label>
                <textarea
                  id="reply"
                  className="w-full min-h-[150px] p-3 border rounded-md"
                  placeholder="Type your reply here..."
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsReplyDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleReply} disabled={!replyText.trim()}>
                Send Reply
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

export default MessagePage
