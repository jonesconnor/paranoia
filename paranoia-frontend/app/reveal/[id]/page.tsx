"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useParams } from 'next/navigation';

export default function RevealPassword() {
  const params = useParams()
  const { id } = params
  const [isRevealed, setIsRevealed] = useState(false)
  const [secret, setSecret] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!id) return

    const fetchSecret = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/getsecret/${id}`)
        const data = await response.json()
        if (response.ok) {
          setSecret(data.secret)
        } else {
          setError(data.message || "Failed to retrieve secret")
        }
      } catch (error) {
        setError("Error retrieving secret")
      }
    }

    fetchSecret()
  }, [id])

  return (
    <div className="min-h-screen bg-quaternary flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-white shadow-lg">
        <CardHeader className="bg-primary text-white rounded-t-lg">
          <CardTitle className="text-2xl font-bold">ParaNoia</CardTitle>
          <CardDescription className="text-tertiary">Your secure information is here</CardDescription>
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
                <Button
                  onClick={() => setIsRevealed(!isRevealed)}
                  className="w-full bg-secondary hover:bg-primary text-white transition-colors"
                >
                  {isRevealed ? "Hide" : "Reveal"}
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

