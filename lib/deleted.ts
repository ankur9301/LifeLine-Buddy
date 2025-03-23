// Store for deleted emergency IDs
export type DeletedEmergency = {
    id: string
    deletedAt: string
    type: string
    location: string
  }
  
  // In-memory store for deleted emergencies
  let deletedEmergencies: DeletedEmergency[] = []
  
  /**
   * Add an emergency to the deleted list
   */
  export function addDeletedEmergency(id: string, type: string, location: string): void {
    const deletedAt = new Date().toISOString()
    deletedEmergencies.push({ id, deletedAt, type, location })
  
    // Also store in localStorage for persistence
    try {
      const stored = JSON.parse(localStorage.getItem("deletedEmergencies") || "[]")
      stored.push({ id, deletedAt, type, location })
      localStorage.setItem("deletedEmergencies", JSON.stringify(stored))
    } catch (error) {
      console.error("Failed to store deleted emergency in localStorage:", error)
    }
  }
  
  /**
   * Get all deleted emergencies
   */
  export function getDeletedEmergencies(): DeletedEmergency[] {
    return [...deletedEmergencies]
  }
  
  /**
   * Check if an emergency is deleted
   */
  export function isEmergencyDeleted(id: string): boolean {
    return deletedEmergencies.some((e) => e.id === id)
  }
  
  /**
   * Initialize deleted emergencies from localStorage
   */
  export function initializeDeletedEmergencies(): void {
    try {
      if (typeof window !== "undefined") {
        const stored = JSON.parse(localStorage.getItem("deletedEmergencies") || "[]")
        deletedEmergencies = stored
      }
    } catch (error) {
      console.error("Failed to initialize deleted emergencies:", error)
    }
  }
  
  