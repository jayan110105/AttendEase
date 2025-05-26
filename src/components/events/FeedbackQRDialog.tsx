import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { QRCodeSVG } from "qrcode.react"
import { useRef } from "react"
import { Icon } from '@iconify/react';

interface FeedbackQRDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedEvent: string
}

export const FeedbackQRDialog = ({ isOpen, onOpenChange, selectedEvent }: FeedbackQRDialogProps) => {
  const qrRef = useRef<HTMLDivElement>(null)

  const downloadQRCode = () => {
    if (!qrRef.current) return
    const svg = qrRef.current.querySelector("svg")
    if (!svg) return

    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const img = new Image()
    const xml = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([xml], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svgBlob)

    img.onload = () => {
      if (!ctx) return
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      
      const pngUrl = canvas.toDataURL("image/png")
      const link = document.createElement("a")
      link.href = pngUrl
      link.download = `${selectedEvent.replace(/\s+/g, "-")}-qr.png`
      link.click()
    }
    img.src = url
  }

  const shareQRCode = async () => {
    if (!qrRef.current) return
    const svg = qrRef.current.querySelector("svg")
    if (!svg) return
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")
    if (!ctx) return
    const img = new Image()
    const xml = new XMLSerializer().serializeToString(svg)
    const svgBlob = new Blob([xml], { type: "image/svg+xml" })
    const url = URL.createObjectURL(svgBlob)

    img.onload = async () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      URL.revokeObjectURL(url)
      
      canvas.toBlob((blob) => {
        if (!blob) return
        const files = [new File([blob], "qr-code.png", { type: "image/png" })]
        if (navigator.share) {
          navigator.share({
            files,
            title: `Feedback QR for ${selectedEvent}`,
            text: `Scan this QR code to provide feedback for ${selectedEvent}.`
          }).catch((error) => {
            console.error("Error sharing QR Code:", error)
          })
        } else {
          alert("Sharing not supported on this device.")
        }
      }, "image/png")
    }
    img.src = url
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[370px] gap-6">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold tracking-tight">Feedback QR Code</DialogTitle>
        </DialogHeader>
        <div ref={qrRef} className="flex flex-col items-center justify-center space-y-4">
          <div className="flex h-64 w-64 items-center justify-center rounded-lg border-2 border-[#1e3a8a]/20 bg-white p-4">
            <QRCodeSVG value={`https://attend-easee.vercel.app/feedback/${selectedEvent.toLowerCase().replace(/\s+/g, "-")}`} className="h-full w-full" />
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row sm:justify-between sm:space-x-2">
          <Button variant="outline" className="font-bold px-2 py-5 mb-2 gap-2 [&_svg]:size-6 sm:mb-0" onClick={downloadQRCode}>
            <Icon icon="solar:round-arrow-down-bold" className="h-4 w-4" />
            Download
          </Button>
          <Button className="font-bold px-2 py-5 mb-2 gap-2 sm:mb-0 [&_svg]:size-5" onClick={shareQRCode}>
            <Icon icon="solar:share-bold" className="h-4 w-4" />
            Share
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 