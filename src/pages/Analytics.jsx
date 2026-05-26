import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"

function Analytics() {

  const role = localStorage.getItem("role")

  const [sessions, setSessions] = useState([])

  if (role !== "admin") {
    return (
      <div className="text-white p-10">
        ❌ Access Denied
      </div>
    )
  }

  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "sessions"),
      (snap) => {

        const data = []

        snap.forEach(doc => {
          data.push(doc.data())
        })

        setSessions(data)

      }
    )

    return () => unsub()

  }, [])

  const toNumber = (v) => Number(v) || 0

  const totalRevenue = sessions.reduce(
    (sum, s) => sum + toNumber(s.price),
    0
  )

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      <h1 className="text-3xl mb-6">Analytics</h1>

      <div className="bg-zinc-900 p-4 rounded-xl">
        <p>Total Revenue</p>
        <h2 className="text-2xl text-green-400">
          {totalRevenue} LYD
        </h2>
      </div>

    </div>
  )
}

export default Analytics