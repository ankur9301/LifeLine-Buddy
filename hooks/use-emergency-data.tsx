"use client"

import { useState, useEffect, useCallback } from "react"
import type { Emergency } from "@/types/emergency"
import { fetchEmergencies, closeCase, initializeDeletedEmergencies } from "@/lib/api"

export function useEmergencyData() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [activeEmergency, setActiveEmergency] = useState<Emergency | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Load emergencies from API
  const loadEmergencies = useCallback(async () => {
    try {
      setLoading(true)
      const data = await fetchEmergencies()
      setEmergencies(data)
      setError(null)
    } catch (err) {
      setError("Failed to load emergencies")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [])

  // Handle closing a case
  const handleCloseCase = useCallback(
    async (id: string) => {
      const success = await closeCase(id)

      if (success) {
        // Update local state
        setEmergencies((prev) => prev.filter((e) => e.id !== id))

        // Reset active emergency if it was closed
        if (activeEmergency?.id === id) {
          setActiveEmergency(null)
        }
      }

      return success
    },
    [activeEmergency],
  )

  // Initialize on component mount
  useEffect(() => {
    // Initialize deleted emergencies from localStorage
    initializeDeletedEmergencies()

    // Load emergencies immediately
    loadEmergencies()

    // Set up polling interval (every 30 seconds)
    const interval = setInterval(loadEmergencies, 30000)

    // Clean up interval on unmount
    return () => clearInterval(interval)
  }, [loadEmergencies])

  return {
    emergencies,
    activeEmergency,
    setActiveEmergency,
    loading,
    error,
    refreshEmergencies: loadEmergencies,
    closeCase: handleCloseCase,
  }
}

