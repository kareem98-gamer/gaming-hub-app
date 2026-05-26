import { useEffect, useState } from "react"

import {
  collection,
  onSnapshot,
} from "firebase/firestore"

import { useNavigate } from "react-router-dom"

import jsPDF from "jspdf"

import { db } from "../firebase"


function Receipts() {

  const navigate = useNavigate()

  const [sessions, setSessions] =
    useState([])


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


  // PDF EXPORT
  const generatePDF = (session) => {

    const doc = new jsPDF()

    doc.setFontSize(22)

    doc.text(
      "Gaming Hub Receipt",
      20,
      20
    )

    doc.setFontSize(14)

    doc.text(
      `Customer: ${session.customerName}`,
      20,
      50
    )

    doc.text(
      `Station: ${session.stationType}`,
      20,
      65
    )

    doc.text(
      `Duration: ${session.duration}`,
      20,
      80
    )

    doc.text(
      `Price: ${session.price} LYD`,
      20,
      95
    )

    doc.text(
      `Status: ${session.status}`,
      20,
      110
    )

    doc.save(
      `${session.customerName}-receipt.pdf`
    )
  }


  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <h1 className="text-3xl font-bold">
          Receipts
        </h1>

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-blue-500 px-4 py-2 rounded-xl"
        >
          Back
        </button>

      </div>


      {/* RECEIPTS */}
      <div className="space-y-4">

        {sessions
          .slice()
          .reverse()
          .map(session => (

          <div
            key={session.id}
            className="bg-zinc-900 p-4 rounded-xl"
          >

            <div className="flex justify-between items-center">

              {/* LEFT */}
              <div>

                <p className="text-xl font-bold">
                  {session.customerName}
                </p>

                <p className="text-zinc-400">
                  {session.stationType}
                </p>

                <p className="text-zinc-400">
                  {session.duration}
                </p>

              </div>


              {/* RIGHT */}
              <div className="text-right">

                <p className="text-2xl font-bold text-green-400">
                  {session.price} LYD
                </p>

                <p className="text-zinc-500 mb-3">
                  {session.status}
                </p>

                <button
                  onClick={() =>
                    generatePDF(session)
                  }
                  className="bg-green-500 px-4 py-2 rounded-xl"
                >
                  Download PDF
                </button>

              </div>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Receipts