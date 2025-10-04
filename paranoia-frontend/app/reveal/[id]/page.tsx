"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from 'next/navigation';
import CryptoJS from "crypto-js";
import { Copy } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function RevealPassword() {
  const params = useParams()
  const { id } = params
  const [isRevealed, setIsRevealed] = useState(false)
  const [secret, setSecret] = useState("")
  const [error, setError] = useState("")
  const { toast } = useToast()

  const getKeyFromUrl = () => {
    const hash = window.location.hash
    if (!hash || hash === '#') {
      throw new Error('No decryption key found in URL');
    }
    return decodeURIComponent(hash.substring(1));
  }

  useEffect(() => {
    if (!id) return
    const fetchSecret = async () => {
      try {
        const key = getKeyFromUrl();
        const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
        if (!apiBaseUrl) {
          throw new Error('API base URL is not configured')
        }

        const response = await fetch(`${apiBaseUrl}/getsecret/${id}`)
        const data = await response.json()
        if (response.ok) {
          const decryptedSecret = CryptoJS.AES.decrypt(data.secret, key).toString(CryptoJS.enc.Utf8)
          setSecret(decryptedSecret)

          window.history.replaceState(null, "", window.location.pathname);
        } else {
          setError(data.message || "Failed to retrieve secret")
        }
      } catch (error) {
        if (error instanceof Error && error.message === 'No decryption key found in URL') {
          setError("Missing decryption key in URL")
        } else {
          setError("Error retrieving or decrypting secret")
        }
      }
    }
    fetchSecret()
  }, [id])

  const copyToClipboard = () => {
    navigator.clipboard
      .writeText(secret)
      .then(() => {
        toast({
          title: "Copied!",
          content: "The secret has been copied to your clipboard.",
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
          <CardDescription className="text-tertiary">The secrets await you!</CardDescription>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-4">
            {error ? (
              <div className="text-red-500">{error}</div>
            ) : (
              <>
                <div className="bg-tertiary p-4 rounded-md relative overflow-hidden">
                  <div className={`transition-all duration-300 ${isRevealed ? "blur-none" : "blur-md"}`}>{secret}</div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    onClick={() => setIsRevealed(!isRevealed)}
                    className="w-full bg-secondary hover:bg-primary text-white transition-colors"
                  >
                    {isRevealed ? "Hide" : "Reveal"}
                  </Button>
                  <Button onClick={copyToClipboard} className="bg-secondary hover:bg-primary text-white">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
