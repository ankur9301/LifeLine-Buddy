import type { Emergency } from "@/types/emergency"

// Base URL for API calls
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://kritishpokharel.pythonanywhere.com"

// Cache for storing deleted emergency IDs
let deletedEmergencyIds: Set<string> = new Set()

/**
 * Fetch all emergencies from the API
 */
export async function fetchEmergencies(): Promise<Emergency[]> {
  try {
    const response = await fetch(`${API_BASE_URL}`)

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    const data = await response.json()
    const emergencies = data.emergencies || []

    // Filter out deleted emergencies
    return emergencies.filter((emergency: Emergency) => !deletedEmergencyIds.has(emergency.id))
  } catch (error) {
    console.error("Failed to fetch emergencies:", error)
    // Return empty array instead of throwing to prevent UI crashes
    return []
  }
}

/**
 * Close a case and add it to deleted emergencies
 */
export async function closeCase(id: string): Promise<boolean> {
  try {
    // Add to local deleted cache immediately
    deletedEmergencyIds.add(id)

    // Store in localStorage for persistence
    const storedIds = JSON.parse(localStorage.getItem("deletedEmergencyIds") || "[]")
    if (!storedIds.includes(id)) {
      storedIds.push(id)
      localStorage.setItem("deletedEmergencyIds", JSON.stringify(storedIds))
    }

    // Attempt to notify backend (optional)
    try {
      await fetch(`${API_BASE_URL}/close-case`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      })
    } catch (apiError) {
      // Log but don't fail the operation since we've already updated local state
      console.warn("Failed to notify backend about closed case:", apiError)
    }

    return true
  } catch (error) {
    console.error("Failed to close case:", error)
    return false
  }
}

/**
 * Initialize the deleted emergencies from localStorage
 */
export function initializeDeletedEmergencies(): void {
  try {
    if (typeof window !== "undefined") {
      const storedIds = JSON.parse(localStorage.getItem("deletedEmergencyIds") || "[]")
      deletedEmergencyIds = new Set(storedIds)
    }
  } catch (error) {
    console.error("Failed to initialize deleted emergencies:", error)
  }
}

