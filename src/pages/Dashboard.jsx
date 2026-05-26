import { useEffect, useState } from "react"

import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
} from "firebase/firestore"

import { useNavigate } from "react-router-dom"

import { db } from "../firebase"

import { calculateSessionPrice } from "../billing"

import Header from "../components/Header"
import StatsCards from "../components/StatsCards"
import StationCard from "../components/StationCard"
import QueuePanel from "../components/QueuePanel"
import StartSessionModal from "../components/StartSessionModal"


function Dashboard() {

  const navigate = useNavigate()

  const [stations, setStations] = useState([])

  const [queue, setQueue] = useState([
    {
      id: 1,
      name: "Yousef",
      console: "PS5",
      duration: "1 Hour",
    },

    {
      id: 2,
      name: "Khaled",
      console: "PS4",
      duration: "30 Minutes",
    },
  ])

  const [selectedStation, setSelectedStation] =
    useState(null)

  const [currentTime, setCurrentTime] =
    useState(Date.now())


  // REALTIME STATIONS
  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "stations"),
      (snap) => {

        const data = []

        snap.forEach(doc => {

          data.push({
            id: doc.id,
            ...doc.data(),
          })

        })

        setStations(data)
      }
    )

    return () => unsub()

  }, [])


  // CLOCK
  useEffect(() => {

    const interval = setInterval(() => {

      setCurrentTime(Date.now())

    }, 1000)

    return () => clearInterval(interval)

  }, [])


  // AUTO FINISH
  useEffect(() => {

    const interval = setInterval(async () => {

      for (const station of stations) {

        if (
          station.status !== "ACTIVE" ||
          !station.endTime
        ) {
          continue
        }

        if (Date.now() >= station.endTime) {

          await updateDoc(
            doc(db, "stations", station.id),
            {
              status: "FINISHED",
            }
          )

        }

      }

    }, 1000)

    return () => clearInterval(interval)

  }, [stations])


  // LOG SESSION
  const logSession = async (data) => {

    await addDoc(
      collection(db, "sessions"),
      {
        ...data,
        createdAt: serverTimestamp(),
      }
    )

  }


  // START SESSION
  const startSession = async (
    stationId,
    customerName,
    duration
  ) => {

    let minutes = 60

    if (duration === "30 Minutes") {
      minutes = 30
    }

    if (duration === "2 Hours") {
      minutes = 120
    }

    const station = stations.find(
      s => s.id === stationId
    )

    const price =
      calculateSessionPrice(
        station.type,
        duration
      )

    const endTime =
      Date.now() + minutes * 60000


    await updateDoc(
      doc(db, "stations", stationId),
      {
        status: "ACTIVE",
        customer: customerName,
        endTime,
        sessionPrice: price,
        duration,
      }
    )


    await logSession({
      stationId,
      stationType: station.type,
      customerName,
      duration,
      price,
      startTime: Date.now(),
      endTime,
      status: "ACTIVE",
    })

    setSelectedStation(null)

  }


  // CLEAN STATION
  const cleanStation = async (stationId) => {

    const station = stations.find(
      s => s.id === stationId
    )

    const next = queue.find(
      q => q.console === station.type
    )


    if (next) {

      let minutes = 60

      if (next.duration === "30 Minutes") {
        minutes = 30
      }

      if (next.duration === "2 Hours") {
        minutes = 120
      }

      const price =
        calculateSessionPrice(
          station.type,
          next.duration
        )

      const endTime =
        Date.now() + minutes * 60000


      await updateDoc(
        doc(db, "stations", stationId),
        {
          status: "ACTIVE",
          customer: next.name,
          endTime,
          sessionPrice: price,
          duration: next.duration,
        }
      )


      await logSession({
        stationId,
        stationType: station.type,
        customerName: next.name,
        duration: next.duration,
        price,
        startTime: Date.now(),
        endTime,
        status: "ACTIVE",
      })


      setQueue(
        queue.filter(q => q.id !== next.id)
      )

      return
    }


    await updateDoc(
      doc(db, "stations", stationId),
      {
        status: "AVAILABLE",
        customer: "",
        endTime: null,
        sessionPrice: 0,
        duration: "",
      }
    )

  }


  // TIMER FORMAT
  const calculateRemainingTime = (endTime) => {

    if (!endTime) {
      return "00:00:00"
    }

    const diff = endTime - currentTime

    if (diff <= 0) {
      return "00:00:00"
    }

    const h =
      Math.floor(diff / 3600000)

    const m =
      Math.floor(
        (diff % 3600000) / 60000
      )

    const s =
      Math.floor(
        (diff % 60000) / 1000
      )

    return (
      `${String(h).padStart(2,"0")}:` +
      `${String(m).padStart(2,"0")}:` +
      `${String(s).padStart(2,"0")}`
    )
  }


  const activeSessions =
    stations.filter(
      s => s.status === "ACTIVE"
    ).length


  const availableStations =
    stations.filter(
      s => s.status === "AVAILABLE"
    ).length


  const totalRevenue =
    stations.reduce(
      (sum, s) =>
        sum + (s.sessionPrice || 0),
      0
    )


  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <Header />

        <div className="flex gap-3">

          <button
            onClick={() => navigate("/analytics")}
            className="bg-blue-500 px-4 py-2 rounded-xl font-semibold"
          >
            Analytics
          </button>

          <button
            onClick={() => navigate("/receipts")}
            className="bg-purple-500 px-4 py-2 rounded-xl font-semibold"
          >
            Receipts
          </button>

          <button
            onClick={() => navigate("/admin")}
            className="bg-yellow-500 text-black px-4 py-2 rounded-xl font-semibold"
          >
            Admin
          </button>

        </div>

      </div>


      {/* STATS */}
      <div className="grid grid-cols-4 gap-4 mb-6">

        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="text-zinc-400">
            Active Sessions
          </h2>

          <p className="text-3xl font-bold">
            {activeSessions}
          </p>
        </div>


        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="text-zinc-400">
            Available Stations
          </h2>

          <p className="text-3xl font-bold">
            {availableStations}
          </p>
        </div>


        <div className="bg-zinc-900 p-4 rounded-xl">
          <h2 className="text-zinc-400">
            Queue
          </h2>

          <p className="text-3xl font-bold">
            {queue.length}
          </p>
        </div>


        <div className="bg-green-600 p-4 rounded-xl">
          <h2 className="text-green-100">
            Revenue
          </h2>

          <p className="text-3xl font-bold">
            {totalRevenue} LYD
          </p>
        </div>

      </div>


      {/* MAIN GRID */}
      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 grid grid-cols-2 gap-4">

          {stations.map(station => (

            <StationCard
              key={station.id}
              station={{
                ...station,
                remaining:
                  calculateRemainingTime(
                    station.endTime
                  ),
              }}
              openModal={setSelectedStation}
              cleanStation={cleanStation}
            />

          ))}

        </div>

        <QueuePanel queue={queue} />

      </div>


      {/* MODAL */}
      {selectedStation && (

        <StartSessionModal
          station={selectedStation}
          closeModal={() =>
            setSelectedStation(null)
          }
          startSession={startSession}
        />

      )}

    </div>
  )
}

export default Dashboard