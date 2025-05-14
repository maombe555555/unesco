"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updatePreferences } from "./actions"
import type { IUser } from "@/models/User"
import toast from "react-hot-toast"

interface PreferencesFormProps {
  user: IUser
}

export default function PreferencesForm({ user }: PreferencesFormProps) {

  const [isSubmitting, setIsSubmitting] = useState(false)

  // These would typically come from the user's preferences in the database
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [theme, setTheme] = useState("system")
  const [language, setLanguage] = useState("en")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // In a real implementation, you would save these preferences to the database
      await updatePreferences({
        userId: user._id,
        preferences: {
          emailNotifications,
          theme,
          language,
        },
      })

     
      toast.success("Preferences updated successfully")
    } catch (error) {
        
    
      toast.error("Failed to update preferences. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences</CardTitle>
        <CardDescription>Manage your application preferences and settings</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Notifications</h3>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="email-notifications">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive email notifications about application updates and announcements
                </p>
              </div>
              <Switch id="email-notifications" checked={emailNotifications} onCheckedChange={setEmailNotifications} />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Appearance</h3>
            <div className="space-y-2">
              <Label>Theme</Label>
              <RadioGroup value={theme} onValueChange={setTheme} className="flex flex-col space-y-1">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="light" id="theme-light" />
                  <Label htmlFor="theme-light">Light</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="dark" id="theme-dark" />
                  <Label htmlFor="theme-dark">Dark</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="system" id="theme-system" />
                  <Label htmlFor="theme-system">System</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-medium">Language</h3>
            <div className="space-y-2">
              <Label htmlFor="language">Display Language</Label>
              <Select value={language} onValueChange={setLanguage}>
                <SelectTrigger id="language">
                  <SelectValue placeholder="Select language" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="en">English</SelectItem>
                  <SelectItem value="fr">French</SelectItem>
                  <SelectItem value="es">Spanish</SelectItem>
                  <SelectItem value="de">German</SelectItem>
                  <SelectItem value="zh">Chinese</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              "Save Preferences"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
