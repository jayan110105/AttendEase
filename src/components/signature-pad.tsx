"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Eraser } from "lucide-react"

interface SignaturePadProps {
  onChange: (dataUrl: string | null) => void
  width?: number
  height?: number
}

export function SignaturePad({ onChange, height = 200 }: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [hasSignature, setHasSignature] = useState(false)

  // Use refs for drawing state to avoid issues with event handlers
  const isDrawingRef = useRef(false)

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions with device pixel ratio for better quality
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()

    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr

    ctx.scale(dpr, dpr)

    // Set line style
    ctx.lineWidth = 2
    ctx.lineCap = "round"
    ctx.lineJoin = "round"
    ctx.strokeStyle = "#000"

    // Clear canvas initially
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Reset state when component unmounts
    return () => {
      isDrawingRef.current = false
      setHasSignature(false)
    }
  }, [])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return

      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // Save current drawing
      const imageData = canvas.toDataURL("image/png")

      // Resize canvas
      const dpr = window.devicePixelRatio || 1
      const rect = canvas.getBoundingClientRect()

      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr

      ctx.scale(dpr, dpr)

      // Restore drawing
      const img = new Image()
      img.onload = () => {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height)
      }
      img.src = imageData
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const getCoordinates = (
    e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement> | MouseEvent | TouchEvent,
    canvas: HTMLCanvasElement,
  ) => {
    const rect = canvas.getBoundingClientRect()
    let clientX, clientY

    // Touch event
    if ("touches" in e && e.touches[0]) {
      clientX = e.touches[0].clientX
      clientY = e.touches[0].clientY
    }
    // Mouse event
    else {
      clientX = (e as MouseEvent).clientX
      clientY = (e as MouseEvent).clientY
    }

    return {
      x: clientX - rect.left,
      y: clientY - rect.top,
    }
  }

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    isDrawingRef.current = true

    const { x, y } = getCoordinates(e, canvas)

    ctx.beginPath()
    ctx.moveTo(x, y)
  }

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const { x, y } = getCoordinates(e, canvas)

    ctx.lineTo(x, y)
    ctx.stroke()

    if (!hasSignature) {
      setHasSignature(true)
    }
  }

  const endDrawing = () => {
    const canvas = canvasRef.current
    if (!canvas || !isDrawingRef.current) return

    isDrawingRef.current = false

    // If there's a signature, pass the data URL to the parent
    if (hasSignature) {
      const dataUrl = canvas.toDataURL("image/png")
      onChange(dataUrl)
    }
  }

  const clearSignature = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.fillStyle = "#fff"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    setHasSignature(false)
    onChange(null)
  }

  // Setup touch event handlers
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    // Prevent scrolling when drawing on mobile
    const preventScroll = (e: TouchEvent) => {
      if (isDrawingRef.current) {
        e.preventDefault()
      }
    }

    canvas.addEventListener("touchmove", preventScroll, { passive: false })

    return () => {
      canvas.removeEventListener("touchmove", preventScroll)
    }
  }, [])

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-full">
        <canvas
          ref={canvasRef}
          className="touch-none w-full cursor-crosshair rounded border border-input bg-white"
          style={{ height: `${height}px` }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        <Button
          type="button"
          size="sm"
          variant="ghost"
          className="absolute bottom-2 right-2 h-6 w-6 rounded-full p-0"
          onClick={clearSignature}
          title="Clear signature"
        >
          <Eraser className="h-4 w-4" />
          <span className="sr-only">Clear signature</span>
        </Button>
      </div>
    </div>
  )
}

