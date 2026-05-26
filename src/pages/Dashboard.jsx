import { useEffect, useState } from "react"

import {
  collection,
  doc,
  updateDoc,
  onSnapshot,
  addDoc,
  serverTimestamp,
  query,
  orderBy,
} from "firebase/firestore"

import { db } from "../firebase"

import Header from "../components/Header"
import StatsCards from "../components/StatsCards"
import StationCard from "../components/StationCard"
import QueuePanel from "../components/QueuePanel"
import StartSessionModal from "../components/StartSessionModal"


function Dashboard() {

  const [stations, setStations] = useState([])
  const [queue, setQueue] = useState([])
  const [selectedStation, setSelectedStation] = useState(null)
  const [currentTime, setCurrentTime] = useState(Date.now())


  // REALTIME STATIONS
  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "stations"),
      (snap) => {

        const data = []
        snap.forEach(doc => data.push({ id: doc.id, ...doc.data() }))
        setStations(data)

      }
    )

    return () => unsub()

  }, [])


  // REALTIME QUEUE (FIREBASE)
  useEffect(() => {

    const q = query(
      collection(db, "queue"),
      orderBy("number", "asc")
    )

    const unsub = onSnapshot(q, (snap) => {

      const data = []

      snap.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() })
      })

      setQueue(data)

    })

    return () => unsub()

  }, [])


  // CLOCK
  useEffect(() => {

    const interval = setInterval(() => {
      setCurrentTime(Date.now())
    }, 1000)

    return () => clearInterval(interval)

  }, [])


  // LOG SESSION
  const logSession = async (data) => {

    await addDoc(collection(db, "sessions"), {
      ...data,
      createdAt: serverTimestamp(),
    })

  }


  // ADD TO QUEUE (FIREBASE)
  const addToQueue = async (name, consoleType, duration) => {

    const nextNumber =
      queue.length > 0
        ? Math.max(...queue.map(q => q.number)) + 1
        : 1

    await addDoc(collection(db, "queue"), {
      name,
      console: consoleType,
      duration,
      number: nextNumber,
      createdAt: serverTimestamp(),
    })

  }


  // CANCEL QUEUE
  const cancelQueue = async (id) => {
    await updateDoc(doc(db, "queue", id), {
      cancelled: true
    })
  }


  // AUTO ASSIGN NEXT CUSTOMER
  const assignNext = async (stationId, stationType) => {

    const next = queue.find(q =>
      q.console === stationType && !q.cancelled
    )

    if (!next) return false

    let minutes = 60

    if (next.duration === "30 Minutes") minutes = 30
    if (next.duration === "2 Hours") minutes = 120

    const endTime = Date.now() + minutes * 60000

    await updateDoc(doc(db, "stations", stationId), {
      status: "ACTIVE",
      customer: next.name,
      endTime,
      duration: next.duration,
      sessionPrice: 10,
    })

    await logSession({
      stationId,
      stationType,
      customerName: next.name,
      duration: next.duration,
      price: 10,
      startTime: Date.now(),
      endTime,
      status: "ACTIVE",
    })

    await updateDoc(doc(db, "queue", next.id), {
      used: true
    })

    return true
  }


  // START SESSION OR AUTO QUEUE
  const startSession = async (stationId, name, duration) => {

    let minutes = 60
    if (duration === "30 Minutes") minutes = 30
    if (duration === "2 Hours") minutes = 120

    const station = stations.find(s => s.id === stationId)

    const endTime = Date.now() + minutes * 60000

    await updateDoc(doc(db, "stations", stationId), {
      status: "ACTIVE",
      customer: name,
      endTime,
      duration,
      sessionPrice: 10,
    })

    await logSession({
      stationId,
      stationType: station.type,
      customerName: name,
      duration,
      price: 10,
      startTime: Date.now(),
      endTime,
      status: "ACTIVE",
    })

    setSelectedStation(null)
  }


  // CLEAN + AUTO FILL NEXT CUSTOMER
  const cleanStation = async (stationId) => {

    const station = stations.find(s => s.id === stationId)

    const assigned = await assignNext(
      stationId,
      station.type
    )

    if (assigned) return

    await updateDoc(doc(db, "stations", stationId), {
      status: "AVAILABLE",
      customer: "",
      endTime: null,
      sessionPrice: 0,
    })

  }


  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      <Header />

      <StatsCards />

      <div className="grid grid-cols-3 gap-6">

        <div className="col-span-2 grid grid-cols-2 gap-4">

          {stations.map(station => (

            <StationCard
              key={station.id}
              station={station}
              openModal={setSelectedStation}
              cleanStation={cleanStation}
            />

          ))}

        </div>

        <QueuePanel
          queue={queue}
          cancelQueue={cancelQueue}
        />

      </div>

      {selectedStation && (

        <StartSessionModal
          station={selectedStation}
          closeModal={() => setSelectedStation(null)}
          startSession={startSession}
        />

      )}

    </div>
  )
}

export default Dashboard