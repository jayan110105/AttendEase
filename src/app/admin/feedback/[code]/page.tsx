"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { Icon } from "@iconify/react"

export default function FeedbackPage() {
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

  return (
    <div className="flex flex-col gap-4">

        {step === "feedback" && (
          <div className="w-full mx-auto max-w-xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900">Provide Feedback</h2>
            </div>
            
            <div>
              <div className="p-8">
                <div className="space-y-6">
                  <div>
                    <Label className="mb-3 block text-base font-medium">How would you rate this event?</Label>
                    <div className="flex items-center gap-2 rounded-lg p-4">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => handleRatingChange(star)}
                          onMouseEnter={() => setHoveredRating(star)}
                          onMouseLeave={() => setHoveredRating(0)}
                          className={`text-4xl transition-all hover:scale-110 ${
                            star <= (hoveredRating || rating) ? "text-yellow-500" : "text-gray-300"
                          }`}
                        >
                          <Icon icon="solar:star-bold" className="h-8 w-8" />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="feedback" className="text-base font-medium">Comments</Label>
                    <Textarea
                      id="feedback"
                      placeholder="Share your experience, what you liked, and suggestions for improvement..."
                      value={feedback}
                      onChange={(e) => setFeedback(e.target.value)}
                      className="mt-2 min-h-[120px] border-gray-300 focus:border-primary focus:ring-primary rounded-lg"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex justify-end gap-3 p-6">
                <Button
                  className="bg-primary hover:bg-primary/90 h-12 text-base font-bold"
                  onClick={handleSubmitFeedback}
                  disabled={isLoading}
                  size="lg"
                >
                  {isLoading ? "Submitting..." : "Submit Feedback"}
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
                
                <h2 className="mb-2 text-2xl font-bold text-gray-900">Feedback Submitted!</h2>
                <p className="mb-3 text-gray-600">Thank you for providing your feedback</p>
              </div>
              
              <div className="p-6">
                <Button 
                  variant="outline" 
                  className="w-full h-12 text-base font-bold" 
                  onClick={resetForm}
                  size="lg"
                >
                  Submit Another Feedback
                </Button>
              </div>
            </div>
          </div>
        )}
    </div>
  )
}

