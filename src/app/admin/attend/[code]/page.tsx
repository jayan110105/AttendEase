"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { SignaturePad } from "@/components/signature-pad"
import { CheckCircle2, Clock, User, UserCheck, Users } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function AttendEventPage() {
  const params = useParams()
  const eventCode = params.code as string
  const { toast } = useToast()

  const [step, setStep] = useState<"role" | "registration" | "verification" | "success">("role")
  const [role, setRole] = useState<"faculty" | "student" | "guest" | "">("")
  const [identificationNumber, setIdentificationNumber] = useState("")
  const [studentData, setStudentData] = useState<null | {
    name: string
    idNumber: string
    class?: string
    section?: string
    department?: string
    phoneNumber?: string
  }>(null)
  const [signature, setSignature] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleRoleSelect = (selectedRole: "faculty" | "student" | "guest") => {
    setRole(selectedRole)
    setStep("registration")
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
      // Simulate API call to fetch student data
      await new Promise((resolve) => setTimeout(resolve, 1000))

      // Mock student data - in a real app, this would come from the API
      let mockData: typeof studentData = {
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

      setStudentData(mockData)
      setStep("verification")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to verify identification. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignatureChange = (signatureDataUrl: string | null) => {
    setSignature(signatureDataUrl)
  }

  const handleSubmitAttendance = async () => {
    if (!signature) {
      toast({
        title: "Signature required",
        description: "Please sign to confirm your attendance",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Simulate API call to submit attendance
      await new Promise((resolve) => setTimeout(resolve, 1500))

      setStep("success")
    } catch (error) {
      console.error(error)
      toast({
        title: "Error",
        description: "Failed to record attendance. Please try again.",
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
    setStudentData(null)
    setSignature(null)
  }

  const getRoleIcon = () => {
    switch (role) {
      case "faculty":
        return <UserCheck className="h-5 w-5" />
      case "student":
        return <User className="h-5 w-5" />
      case "guest":
        return <Users className="h-5 w-5" />
      default:
        return <User className="h-5 w-5" />
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

        {step === "registration" && (
          <Card className="w-full max-w-md border-none shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Mark Your Attendance</CardTitle>
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

        {step === "verification" && studentData && (
          <Card className="w-full max-w-md border-none shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Verify & Sign</CardTitle>
              <CardDescription>
                Confirm your details and sign to mark attendance
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="rounded-lg bg-gray-50 p-4">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                    {getRoleIcon()}
                  </div>
                  <div>
                    <h3 className="font-medium">{studentData.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {role === "faculty" ? "MAHE ID: " : role === "student" ? "Reg No: " : "Phone: "}
                      {studentData.idNumber}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  {role === "faculty" && (
                    <>
                      <div>
                        <p className="text-muted-foreground">Department</p>
                        <p className="font-medium">{studentData.department}</p>
                      </div>
                    </>
                  )}
                  {role === "student" && (
                    <>
                      <div>
                        <p className="text-muted-foreground">Class</p>
                        <p className="font-medium">{studentData.class}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Section</p>
                        <p className="font-medium">{studentData.section}</p>
                      </div>
                    </>
                  )}
                  {role === "guest" && (
                    <div>
                      <p className="text-muted-foreground">Phone</p>
                      <p className="font-medium">{studentData.phoneNumber}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Time</p>
                    <p className="font-medium">{new Date().toLocaleTimeString()}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Your Signature</Label>
                <div className="rounded-lg border bg-white p-2">
                  <SignaturePad onChange={handleSignatureChange} />
                </div>
                <p className="text-xs text-muted-foreground">Sign above to confirm your attendance</p>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-2 px-6 py-4">
              <Button
                className="w-full"
                onClick={handleSubmitAttendance}
                disabled={isLoading || !signature}
              >
                {isLoading ? "Submitting..." : "Mark Attendance"}
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setStep("registration")}
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
              <CardTitle className="text-2xl">Attendance Recorded</CardTitle>
              <CardDescription>
                Your attendance has been successfully recorded
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center justify-center space-y-4 py-6">
              <div className="rounded-full bg-green-100 p-6 text-green-600">
                <CheckCircle2 className="h-12 w-12" />
              </div>
              <div className="text-center">
                <h3 className="text-lg font-medium">Thank You!</h3>
                <p className="text-muted-foreground">Your attendance has been recorded for event {eventCode}</p>
              </div>
              <div className="mt-4 flex items-center gap-2 rounded-full bg-gray-100 px-4 py-2">
                <Clock className="h-4 w-4" />
                <span className="text-sm font-medium">Recorded at {new Date().toLocaleTimeString()}</span>
              </div>
            </CardContent>
            <CardFooter>
              <Button variant="outline" className="w-full" onClick={resetForm}>
                Mark Another Attendance
              </Button>
            </CardFooter>
          </Card>
        )}
      </main>

      <footer className="container mx-auto mt-8 py-4 text-center text-sm text-muted-foreground">
        &copy; {new Date().getFullYear()} Attendance System. All rights reserved.
      </footer>
    </div>
  )
}

