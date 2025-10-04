"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import CryptoJS from "crypto-js"
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function PasswordSharing() {
  const [secret, setSecret] = useState("")
  const [generatedUrl, setGeneratedUrl] = useState("")
  const { toast } = useToast()

  const handleGenerateUrl = async () => {
    try {
      const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
      if (!apiBaseUrl) {
        throw new Error("API base URL is not configured")
      }

      const key = CryptoJS.lib.WordArray.random(16).toString()
      const encryptedSecret = CryptoJS.AES.encrypt(secret, key).toString()

      const response = await fetch(`${apiBaseUrl}/generateuuid`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ secret: encryptedSecret }),
      })
      const data = await response.json()
      if (response.ok) {
        const urlWithKey = `${data.url}#${key}`
        setGeneratedUrl(urlWithKey)
      } else {
        console.error("Failed to generate URL:", data.message)
      }
    } catch (error) {
      console.error("Error generating URL:", error)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        toast({
          title: "Copied!",
          content: "The URL has been copied to your clipboard.",
        })
      })
      .catch((err) => {
        console.error("Failed to copy: ", err)
      })
  }

  return (
    <div className="min-h-screen bg-quaternary flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="bg-primary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">ParaNoia</CardTitle>
          <CardDescription className="text-tertiary">Share your secrets securely</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div>
              <label htmlFor="secret" className="block text-sm font-medium text-secondary mb-1">
                Enter your secret
              </label>
              <Input
                id="secret"
                type="password"
                placeholder="Enter your secret here"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                className="w-full border-secondary"
              />
            </div>
            <Button
              onClick={handleGenerateUrl}
              className="w-full bg-secondary hover:bg-primary text-white transition-colors"
            >
              Generate URL
            </Button>
            {generatedUrl && (
              <div className="mt-4">
                <label className="block text-sm font-medium text-secondary mb-1">Share this URL</label>
                <div className="flex">
                  <Input
                    type="text"
                    value={generatedUrl}
                    readOnly
                    className="flex-grow bg-tertiary text-primary font-medium"
                  />
                  <Button
                    onClick={() => copyToClipboard(generatedUrl)}
                    className="ml-2 bg-secondary hover:bg-primary text-white"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
