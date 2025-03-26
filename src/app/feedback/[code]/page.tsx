"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, MessageSquare, User, UserCheck, Users, Phone } from "lucide-react"

export default function FeedbackPage() {
  const params = useParams()
  const eventCode = params.code as string
  const { toast } = useToast()

  const [step, setStep] = useState<"role" | "identification" | "feedback" | "success">("role")
  const [role, setRole] = useState<"faculty" | "student" | "guest" | "">("")
  const [identificationNumber, setIdentificationNumber] = useState("")
  const [userData, setUserData] = useState<null | {
    name: string
    idNumber: string
    department?: string
    class?: string
    section?: string
    phoneNumber?: string
  }>(null)
  const [rating, setRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = (selectedRole: "faculty" | "student" | "guest") => {
    setRole(selectedRole)
    setStep("identification")
  }

  const getIdentificationLabel = () => {
    switch (role) {
      case "faculty":
        return "MAHE ID"
      case "student":
        return "Registration Number"
      case "guest":
        return "Phone Number"
      default:
        return "Identification"
    }
  }

  const getIdentificationPlaceholder = () => {
    switch (role) {
      case "faculty":
        return "Enter your MAHE ID"
      case "student":
        return "Enter your registration number"
      case "guest":
        return "Enter your phone number"
      default:
        return "Enter your identification"
    }
  }

  const handleVerifyIdentification = async () => {
    if (!identificationNumber) {
      toast({
        title: `${getIdentificationLabel()} required`,
        description: `Please enter your ${getIdentificationLabel().toLowerCase()}`,
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call to fetch user data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock data based on role - in a real app, this would come from the API
      let mockData: typeof userData  = {
        name: "",
        idNumber: identificationNumber,
      }

      if (role === "faculty") {
        mockData = {
          ...mockData,
          name: "Dr. Jane Smith",
          department: "Computer Science",
        }
      } else if (role === "student") {
        mockData = {
          ...mockData,
          name: "John Doe",
          class: "Class 5",
          section: "Section A",
        }
      } else if (role === "guest") {
        mockData = {
          ...mockData,
          name: "Alex Johnson",
          phoneNumber: identificationNumber,
        }
      }

      setUserData(mockData)
      setStep("feedback")
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to verify identification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleRatingChange = (newRating: number) => {
    setRating(newRating)
  }

  const handleSubmitFeedback = async () => {
    if (rating === 0) {
      toast({
        title: "Rating required",
        description: "Please provide a rating before submitting",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call to submit feedback
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStep("success")
    } catch (error) {
      console.log(error)
      toast({
        title: "Error",
        description: "Failed to submit feedback. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const resetForm = () => {
    setStep("role")
    setRole("")
    setIdentificationNumber("")
    setUserData(null)
    setRating(0)
    setFeedback("")
  }

  const getRoleIcon = () => {
    switch (role) {
      case "faculty":
        return <UserCheck className="h-5 w-5" />
      case "student":
        return <User className="h-5 w-5" />
      case "guest":
        return <Phone className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
    }
  }

  // Get event name from code (in a real app, this would come from the API)
  const getEventName = () => {
    switch (eventCode) {
      case "ml-workshop":
        return "Introduction to Machine Learning"
      case "data-structures":
        return "Advanced Data Structures"
      case "web-dev":
        return "Web Development Workshop"
      default:
        return `Event ${eventCode}`
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-[#f8f9fa] p-4">
      <main className="container mx-auto flex flex-1 items-center justify-center px-4">
      {step === "role" && (
            <Card className="w-full max-w-md border-none shadow-sm">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl">Select Your Role</CardTitle>
                <CardDescription>Choose your role to proceed</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <RadioGroup value={role} onValueChange={(value) => setRole(value as "faculty" | "student" | "guest")} className="flex flex-col space-y-3">
                  <div className="flex items-center space-x-3 rounded-md border p-4 hover:bg-muted/50">
                  <RadioGroupItem value="faculty" id="faculty"/>
                  <Label htmlFor="faculty" className="flex flex-1 items-center gap-2 font-normal">
                    <UserCheck className="h-5 w-5" />
                    <div>
                    <p className="font-medium">Faculty</p>
                    <p className="text-sm text-muted-foreground">For professors and instructors</p>
                    </div>
                  </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-md border p-4 hover:bg-muted/50">
                  <RadioGroupItem value="student" id="student" />
                  <Label htmlFor="student" className="flex flex-1 items-center gap-2 font-normal">
                    <User className="h-5 w-5"/>
                    <div>
                    <p className="font-medium">Student</p>
                    <p className="text-sm text-muted-foreground">For enrolled students</p>
                    </div>
                  </Label>
                  </div>
                  <div className="flex items-center space-x-3 rounded-md border p-4 hover:bg-muted/50">
                  <RadioGroupItem value="guest" id="guest"/>
                  <Label htmlFor="guest" className="flex flex-1 items-center gap-2 font-normal">
                    <Users className="h-5 w-5" />
                    <div>
                    <p className="font-medium">Guest</p>
                    <p className="text-sm text-muted-foreground">For visitors and external participants</p>
                    </div>
                  </Label>
                  </div>
                </RadioGroup>
              </CardContent>
              <CardFooter>
                <Button 
                  className="w-full" 
                  onClick={() => role ? handleRoleSelect(role) : null}
                  disabled={!role}
                >
                  Continue
                </Button>
              </CardFooter>
            </Card>
        )}

        {step === "identification" && (
          <Card className="w-full max-w-md border-none shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Verify Your Identity</CardTitle>
              <CardDescription>
                Enter your {getIdentificationLabel().toLowerCase()} to proceed
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 rounded-md bg-gray-50 p-3">
                {role === "faculty" && <UserCheck className="h-5 w-5" />}
                {role === "student" && <User className="h-5 w-5" />}
                {role === "guest" && <Users className="h-5 w-5" />}
                <span className="font-medium">
                  {role === "faculty" ? "Faculty" : role === "student" ? "Student" : "Guest"}
                </span>
              </div>
              <div className="space-y-2">
                <Label htmlFor="identification">{getIdentificationLabel()}</Label>
                <Input
                  id="identification"
                  placeholder={getIdentificationPlaceholder()}
                  value={identificationNumber}
                  onChange={(e) => setIdentificationNumber(e.target.value)}
                  className="border-[#1e3a8a]/20"
                  type={role === "guest" ? "tel" : "text"}
                />
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 bg-gray-50 px-6 py-4">
              <Button
                className="w-full"
                onClick={handleVerifyIdentification}
                disabled={isLoading}
              >
                {isLoading ? "Verifying..." : "Continue"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep("role")}
              >
                Back
              </Button>
            </CardFooter>
          </Card>
        )}
            {step === "feedback" && userData && (
              <Card className="w-full max-w-md border-none shadow-sm">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Provide Feedback</CardTitle>
                  <CardDescription>
                    Share your thoughts about {getEventName()}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="rounded-lg bg-gray-50 p-4">
                    <div className="mb-2 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                        {getRoleIcon()}
                      </div>
                      <div>
                        <h3 className="font-medium">{userData.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {role === "faculty" ? "MAHE ID: " : role === "student" ? "Reg No: " : "Phone: "}
                          {userData.idNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label className="mb-2 block">How would you rate this event?</Label>
                      <div className="flex items-center gap-1">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingChange(star)}
                            className={`text-2xl ${star <= rating ? "text-yellow-500" : "text-gray-300"}`}
                          >
                            ★
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-muted-foreground">
                          {rating > 0 ? `${rating}/5` : "Select rating"}
                        </span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="feedback">Comments (Optional)</Label>
                      <Textarea
                        id="feedback"
                        placeholder="Share your experience, what you liked, and suggestions for improvement..."
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        className="min-h-[120px] border-[#1e3a8a]/20"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="flex flex-col space-y-2 bg-gray-50 px-6 py-4">
                  <Button
                    className="w-full"
                    onClick={handleSubmitFeedback}
                    disabled={isLoading}
                  >
                    {isLoading ? "Submitting..." : "Submit Feedback"}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => setStep("identification")}
                    disabled={isLoading}
                  >
                    Back
                  </Button>
                </CardFooter>
              </Card>
            )}

            {step === "success" && (
              <Card className="w-full max-w-md border-none shadow-sm">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-2xl">Feedback Submitted</CardTitle>
                  <CardDescription>Thank you for providing your feedback</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center space-y-4 p-6 py-8">
                  <div className="rounded-full bg-green-100 p-6 text-green-600">
                    <CheckCircle2 className="h-12 w-12" />
                  </div>
                  <div className="text-center">
                    <h3 className="text-lg font-medium">Thank You!</h3>
                    <p className="text-muted-foreground">Your feedback has been submitted for {getEventName()}</p>
                  </div>
                  <div className="mt-4 flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                    <MessageSquare className="h-4 w-4" />
                    <span className="text-sm font-medium">Your feedback is valuable to us</span>
                  </div>
                </CardContent>
                <CardFooter className="bg-gray-50 px-6 py-4">
                  <Button variant="outline" className="w-full" onClick={resetForm}>
                    Submit Another Feedback
                  </Button>
                </CardFooter>
              </Card>
            )}
        </main>

        {/* Footer */}
        <footer className="border-t bg-white py-4 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Attendance System. All rights reserved.
        </footer>
      </div>
  )
}

