export type DeletedEmergency = {
    id: string
    deletedAt: string
    type: string
    location: string
  }
  
  let deletedEmergencies: DeletedEmergency[] = []
  
  export function addDeletedEmergency(id: string, type: string, location: string): void {
    const deletedAt = new Date().toISOString()
    deletedEmergencies.push({ id, deletedAt, type, location })
  
    try {
      const stored = JSON.parse(localStorage.getItem("deletedEmergencies") || "[]")
      stored.push({ id, deletedAt, type, location })
      localStorage.setItem("deletedEmergencies", JSON.stringify(stored))
    } catch (error) {
      console.error("Failed to store deleted emergency in localStorage:", error)
    }
  }
  
  export function getDeletedEmergencies(): DeletedEmergency[] {
    return [...deletedEmergencies]
  }
  
  export function isEmergencyDeleted(id: string): boolean {
    return deletedEmergencies.some((e) => e.id === id)
  }
  
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
  