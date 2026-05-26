import { useEffect, useState } from "react"

import {
  collection,
  onSnapshot,
} from "firebase/firestore"

import {
  getAuth,
} from "firebase/auth"

import { useNavigate } from "react-router-dom"

import { db } from "../firebase"


function Admin() {

  const navigate = useNavigate()

  const auth = getAuth()

  const [sessions, setSessions] =
    useState([])

  const [userEmail, setUserEmail] =
    useState("")


  useEffect(() => {

    if (auth.currentUser) {
      setUserEmail(auth.currentUser.email)
    }

  }, [])


  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "sessions"),
      (snap) => {

        const data = []

        snap.forEach(doc => {

          data.push({
            id: doc.id,
            ...doc.data(),
          })

        })

        setSessions(data)

      }
    )

    return () => unsub()

  }, [])


  // TOTAL REVENUE
  const totalRevenue =
    sessions.reduce(
      (sum, s) =>
        sum + (s.price || 0),
      0
    )


  // ADMIN CHECK
  const isAdmin =
    userEmail === "gaminghubcashier@gmail.com"


  if (!isAdmin) {

    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">

        <div className="text-center">

          <h1 className="text-3xl font-bold mb-4">
            Access Denied
          </h1>

          <button
            onClick={() =>
              navigate("/dashboard")
            }
            className="bg-blue-500 px-4 py-2 rounded-xl"
          >
            Back
          </button>

        </div>

      </div>
    )
  }


  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Admin Panel
        </h1>

        <button
          onClick={() =>
            navigate("/dashboard")
          }
          className="bg-blue-500 px-4 py-2 rounded-xl"
        >
          Back
        </button>

      </div>


      {/* CARDS */}
      <div className="grid grid-cols-3 gap-4 mb-6">

        <div className="bg-zinc-900 p-4 rounded-xl">

          <h2 className="text-zinc-400">
            Total Revenue
          </h2>

          <p className="text-3xl font-bold text-green-400">
            {totalRevenue} LYD
          </p>

        </div>


        <div className="bg-zinc-900 p-4 rounded-xl">

          <h2 className="text-zinc-400">
            Total Sessions
          </h2>

          <p className="text-3xl font-bold">
            {sessions.length}
          </p>

        </div>


        <div className="bg-zinc-900 p-4 rounded-xl">

          <h2 className="text-zinc-400">
            Logged In
          </h2>

          <p className="text-lg font-bold">
            {userEmail}
          </p>

        </div>

      </div>


      {/* SESSION TABLE */}
      <div className="bg-zinc-900 rounded-xl overflow-hidden">

        <table className="w-full">

          <thead className="bg-zinc-800">

            <tr>

              <th className="p-3 text-left">
                Customer
              </th>

              <th className="p-3 text-left">
                Station
              </th>

              <th className="p-3 text-left">
                Duration
              </th>

              <th className="p-3 text-left">
                Price
              </th>

            </tr>

          </thead>


          <tbody>

            {sessions
              .slice()
              .reverse()
              .map(session => (

              <tr
                key={session.id}
                className="border-b border-zinc-800"
              >

                <td className="p-3">
                  {session.customerName}
                </td>

                <td className="p-3">
                  {session.stationType}
                </td>

                <td className="p-3">
                  {session.duration}
                </td>

                <td className="p-3 text-green-400">
                  {session.price} LYD
                </td>

              </tr>

            ))}

          </tbody>

        </table>

      </div>

    </div>
  )
}

export default Admin