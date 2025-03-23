// app/EmergencyFetcher.tsx (or any component)
"use client"

import { useEffect, useState } from "react"

interface Emergency {
  id: string
  type: string
  location: string
  time: string
  severity: string
  phone_number: string
}

export default function EmergencyFetcher() {
  const [emergencies, setEmergencies] = useState<Emergency[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("http://localhost:3001/emergencies")
      .then((res) => res.json())
      .then((data) => {
        setEmergencies(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching emergencies:", err)
        setLoading(false)
      })
  }, [])

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Live Emergencies</h2>

      {loading ? (
        <p>Loading...</p>
      ) : emergencies.length === 0 ? (
        <p>No emergencies found.</p>
      ) : (
        <ul className="space-y-2">
          {emergencies.map((emergency) => (
            <li key={emergency.id} className="rounded border p-4 bg-muted">
              <div className="font-semibold">{emergency.type}</div>
              <div className="text-sm text-muted-foreground">{emergency.location}</div>
              <div className="text-xs">Time: {emergency.time}</div>
              <div className="text-xs">Severity: {emergency.severity}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
