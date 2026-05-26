import { useEffect, useState } from "react"

import {
  collection,
  onSnapshot,
} from "firebase/firestore"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts"

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

  // 💰 TOTAL REVENUE
  const totalRevenue = sessions.reduce(
    (sum, s) => sum + (s.price || 0),
    0
  )

  // 📅 TODAY REVENUE
  const todayStr = new Date().toDateString()

  const todayRevenue = sessions
    .filter(s =>
      s.startTime &&
      new Date(s.startTime).toDateString() === todayStr
    )
    .reduce((sum, s) => sum + (s.price || 0), 0)


  // 📊 STATION USAGE DATA (FOR CHART)
  const usageMap = {}

  sessions.forEach(s => {
    usageMap[s.stationType] =
      (usageMap[s.stationType] || 0) + 1
  })

  const chartData = Object.keys(usageMap).map(key => ({
    name: key,
    sessions: usageMap[key],
  }))


  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Analytics Dashboard
      </h1>

      {/* STATS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2>Total Revenue</h2>
          <p className="text-2xl font-bold">
            {totalRevenue} LYD
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2>Today Revenue</h2>
          <p className="text-2xl font-bold">
            {todayRevenue} LYD
          </p>
        </div>

        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2>Total Sessions</h2>
          <p className="text-2xl font-bold">
            {sessions.length}
          </p>
        </div>

      </div>

      {/* CHART */}
      <div className="bg-zinc-900 p-4 rounded-xl h-[350px]">

        <h2 className="mb-4 font-bold">
          Station Usage
        </h2>

        <ResponsiveContainer width="100%" height="100%">

          <BarChart data={chartData}>

            <XAxis dataKey="name" />

            <YAxis />

            <Tooltip />

            <Bar dataKey="sessions" fill="#22c55e" />

          </BarChart>

        </ResponsiveContainer>

      </div>

      {/* RECENT SESSIONS */}
      <div className="mt-6 bg-zinc-900 p-4 rounded-xl">

        <h2 className="font-bold mb-3">
          Recent Sessions
        </h2>

        <div className="space-y-2">

          {sessions.slice(-10).reverse().map((s, i) => (

            <div
              key={i}
              className="flex justify-between border-b border-zinc-700 py-2"
            >

              <span>{s.customerName}</span>
              <span>{s.stationType}</span>
              <span>{s.price} LYD</span>

            </div>

          ))}

        </div>

      </div>

    </div>
  )
}

export default Analytics