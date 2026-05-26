import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"

function Analytics() {

  const [sessions, setSessions] = useState([])

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

  // SAFE NUMBER CONVERTER
  const toNumber = (value) => {

    const num = Number(value)

    if (isNaN(num)) return 0

    return num
  }

  const now = new Date()

  const startOfDay = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate()
  )

  const startOfMonth = new Date(
    now.getFullYear(),
    now.getMonth(),
    1
  )

  // TOTAL REVENUE (SAFE)
  const totalRevenue = sessions.reduce(
    (sum, s) => sum + toNumber(s.price),
    0
  )

  // TODAY REVENUE (SAFE)
  const todayRevenue = sessions
    .filter(s => new Date(s.startTime) >= startOfDay)
    .reduce((sum, s) => sum + toNumber(s.price), 0)

  // MONTH REVENUE (SAFE)
  const monthRevenue = sessions
    .filter(s => new Date(s.startTime) >= startOfMonth)
    .reduce((sum, s) => sum + toNumber(s.price), 0)


  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Revenue Analytics
      </h1>

      <div className="grid grid-cols-3 gap-4">

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p>Today Revenue</p>
          <h2 className="text-2xl font-bold text-green-400">
            {todayRevenue} LYD
          </h2>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p>Month Revenue</p>
          <h2 className="text-2xl font-bold text-green-400">
            {monthRevenue} LYD
          </h2>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <p>Total Revenue</p>
          <h2 className="text-2xl font-bold text-green-400">
            {totalRevenue} LYD
          </h2>
        </div>

      </div>

    </div>
  )
}

export default Analytics