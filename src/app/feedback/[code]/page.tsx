"use client"

import { useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { CheckCircle2, MessageSquare, Star } from "lucide-react"

export default function FeedbackPage() {
  const params = useParams()
  const eventCode = params.code as string
  const { toast } = useToast()

  const [step, setStep] = useState<"feedback" | "success">("feedback")
  const [rating, setRating] = useState<number>(0)
  const [hoveredRating, setHoveredRating] = useState<number>(0)
  const [feedback, setFeedback] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)

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
    setStep("feedback")
    setRating(0)
    setHoveredRating(0)
    setFeedback("")
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
        {step === "feedback" && (
          <Card className="w-full max-w-md border-none shadow-sm">
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Event Feedback</CardTitle>
              <CardDescription>Share your feedback for {getEventName()}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Rate your experience</label>
                <div className="flex space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => handleRatingChange(star)}
                      onMouseEnter={() => setHoveredRating(star)}
                      onMouseLeave={() => setHoveredRating(0)}
                      className="focus:outline-none"
                    >
                      <Star
                        className={`h-8 w-8 ${
                          star <= (hoveredRating || rating)
                            ? "fill-yellow-400 text-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Comments (Optional)</label>
                <Textarea
                  placeholder="Share your thoughts about the event..."
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={4}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleSubmitFeedback} 
                disabled={isLoading} 
                className="w-full"
              >
                {isLoading ? "Submitting..." : "Submit Feedback"}
              </Button>
            </CardFooter>
          </Card>
        )}

        {step === "success" && (
          <Card className="w-full max-w-md border-none shadow-sm">
            <CardContent className="flex flex-col items-center space-y-4 p-6">
              <CheckCircle2 className="h-16 w-16 text-green-500" />
              <div className="space-y-2 text-center">
                <h3 className="text-xl font-semibold">Thank you!</h3>
                <p className="text-muted-foreground">
                  Your anonymous feedback has been submitted successfully.
                </p>
              </div>
              <Button onClick={resetForm} variant="outline" className="w-full">
                Submit Another Feedback
              </Button>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

