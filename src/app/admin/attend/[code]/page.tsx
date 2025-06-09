"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { SignaturePad } from "@/components/signature-pad"
import { Icon } from "@iconify/react"
import { cn } from "@/lib/utils"

export default function AttendEventPage() {
  const { toast } = useToast()

  const [step, setStep] = useState<"role" | "identification" | "verification" | "success">("role")
  const [role, setRole] = useState<"staff" | "student" | "guest" | "">("")
  const [identificationNumber, setIdentificationNumber] = useState("")
  const [userData, setUserData] = useState<null | {
    name: string
    idNumber: string
    department?: string
    class?: string
    section?: string
    phoneNumber?: string
  }>(null)
  const [initials, setInitials] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const steps = [
    { id: 1, name: "Select Role", status: step === "role" ? "current" : (step === "identification" || step === "verification" || step === "success") ? "complete" : "upcoming" },
    { id: 2, name: "Enter ID", status: step === "identification" ? "current" : (step === "verification" || step === "success") ? "complete" : "upcoming" },
    { id: 3, name: "Draw & Verify", status: step === "verification" ? "current" : step === "success" ? "complete" : "upcoming" },
  ]

  const handleRoleSelect = (selectedRole: "staff" | "student" | "guest") => {
    setRole(selectedRole)
    setStep("identification")
  }

  const getIdentificationLabel = () => {
    switch (role) {
      case "staff":
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
      case "staff":
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
      let mockData: typeof userData = {
        name: "",
        idNumber: identificationNumber,
      }

      if (role === "staff") {
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
      setStep("verification")
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

  const handleInitialsChange = (initialsDataUrl: string | null) => {
    setInitials(initialsDataUrl)
  }

  const handleSubmitAttendance = async () => {
    if (!initials) {
      toast({
        title: "Initials required",
        description: "Please draw your initials to confirm your attendance",
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
      console.log(error)
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
    setUserData(null)
    setInitials(null)
  }

  return (
    <div className="flex flex-col gap-4">
        
        {/* Progress Steps */}
        <div className="mb-12">
          <div className="flex items-center justify-center">
            {steps.map((stepItem, stepIdx) => (
              <div key={stepItem.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full border-2 text-sm font-semibold",
                      stepItem.status === "complete"
                        ? "border-primary bg-primary text-white"
                        : stepItem.status === "current"
                        ? "border-primary bg-primary text-white"
                        : "border-gray-300 bg-white text-gray-500"
                    )}
                  >
                    {stepItem.id}
                  </div>
                  <div className="mt-2 text-center">
                    <div
                      className={cn(
                        "text-sm font-medium",
                        stepItem.status === "complete" || stepItem.status === "current"
                          ? "text-primary"
                          : "text-gray-500"
                      )}
                    >
                      {stepItem.name}
                    </div>
                  </div>
                </div>
                {stepIdx < steps.length - 1 && (
                  <div
                    className={cn(
                      "mx-8 h-0.5 w-24",
                      stepItem.status === "complete"
                        ? "bg-primary"
                        : "bg-gray-300"
                    )}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === "role" && (
          <div className="mx-auto max-w-4xl">
            <div className="mb-8 text-center">
              <h2 className="text-2xl font-bold text-gray-900">Select Your Role</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
              <Card 
                className={cn(
                  "cursor-pointer border-2 transition-all hover:shadow-lg",
                  role === "student" ? "border-primary bg-primary/10" : "border-gray-200"
                )}
                onClick={() => setRole("student")}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Icon icon="solar:user-bold" className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Student</h3>
                  <p className="text-gray-600">For enrolled students</p>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "cursor-pointer border-2 transition-all hover:shadow-lg",
                  role === "staff" ? "border-primary bg-primary/10" : "border-gray-200"
                )}
                onClick={() => setRole("staff")}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Icon icon="solar:user-check-bold" className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                                      <h3 className="mb-2 text-xl font-bold">Staff</h3>
                    <p className="text-gray-600">For teaching and non-teaching staff</p>
                </CardContent>
              </Card>

              <Card 
                className={cn(
                  "cursor-pointer border-2 transition-all hover:shadow-lg",
                  role === "guest" ? "border-primary bg-primary/10" : "border-gray-200"
                )}
                onClick={() => setRole("guest")}
              >
                <CardContent className="p-8 text-center">
                  <div className="mb-4 flex justify-center">
                    <div className="rounded-full bg-primary/10 p-4">
                      <Icon icon="solar:users-group-rounded-bold" className="h-8 w-8 text-primary" />
                    </div>
                  </div>
                  <h3 className="mb-2 text-xl font-bold">Guest</h3>
                  <p className="text-gray-600">For visitors</p>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8 flex justify-end">
              <Button 
                size="lg"
                onClick={() => role ? handleRoleSelect(role) : null}
                disabled={!role}
                className="bg-primary hover:bg-primary/90 font-bold h-12 text-base"
              >
                Continue
                <Icon icon="solar:arrow-right-linear" className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        )}

        {step === "identification" && (
          <div className="w-full max-w-lg mx-auto">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Verify Your Identity</h2>
            </div>
            
            <div>
              <div className="p-8">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="identification" className="text-base font-medium">{getIdentificationLabel()}</Label>
                    <Input
                      id="identification"
                      placeholder={getIdentificationPlaceholder()}
                      value={identificationNumber}
                      onChange={(e) => setIdentificationNumber(e.target.value)}
                      className="mt-2 h-12 text-base border-gray-300 focus:border-primary focus:ring-primary rounded-lg"
                      type={role === "guest" ? "tel" : "text"}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between gap-3 p-6 rounded-b-lg font-bold">
                <Button
                  variant="outline"
                  onClick={() => setStep("role")}
                  className="h-12 text-base"
                >
                  Back
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 h-12 text-base font-bold"
                  onClick={handleVerifyIdentification}
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Verifying..." : "Continue"}
                  <Icon icon="solar:arrow-right-linear" className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === "verification" && userData && (
          <div className="w-full mx-auto max-w-xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Verify & Draw Initials</h2>
            </div>
            
            <div>
              <div className="p-8">
                <div className="space-y-6">
                  <div className="rounded-lg bg-gray-50 p-6">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        {role === "staff" && <Icon icon="solar:user-check-bold" className="h-6 w-6 text-primary" />}
                        {role === "student" && <Icon icon="solar:user-bold" className="h-6 w-6 text-primary" />}
                        {role === "guest" && <Icon icon="solar:users-group-rounded-bold" className="h-6 w-6 text-primary" />}
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold">{userData.name}</h3>
                        <p className="text-sm text-gray-600">
                          {role === "staff" ? "MAHE ID: " : role === "student" ? "Reg No: " : "Phone: "}
                          {userData.idNumber}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Your Initials</Label>
                    <div className="mt-2 rounded-lg border bg-white p-2">
                      <SignaturePad onChange={handleInitialsChange} />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">Draw your initials above to confirm your attendance</p>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between gap-3 p-6">
                <Button
                  variant="outline"
                  onClick={() => setStep("identification")}
                  disabled={isLoading}
                  className="h-12 text-base font-bold"
                >
                  Back
                </Button>
                <Button
                  className="bg-primary hover:bg-primary/90 h-12 text-base font-bold"
                  onClick={handleSubmitAttendance}
                  disabled={isLoading || !initials}
                  size="lg"
                >
                  {isLoading ? "Submitting..." : "Mark Attendance"}
                  <Icon icon="solar:arrow-right-linear" className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {step === "success" && (
          <div className="mx-auto max-w-2xl">
            <div>
              <div className="p-12 text-center">
                <div className="mb-6 flex justify-center">
                  <div className="rounded-full bg-primary/10 p-6">
                    <Icon icon="solar:check-circle-bold" className="h-16 w-16 text-primary" />
                  </div>
                </div>
                
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Attendance Recorded!</h2>
                <p className="mb-3 text-gray-600">Your attendance has been successfully recorded</p>
              </div>
              
              <div className="p-6">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-bold" 
                  onClick={resetForm}
                  size="lg"
                >
                  Mark Another Attendance
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

