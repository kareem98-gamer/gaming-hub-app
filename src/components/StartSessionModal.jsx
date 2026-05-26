import { useState } from "react"

function StartSessionModal({
  station,
  closeModal,
  startSession,
}) {

  const [customerName, setCustomerName] = useState("")
  const [duration, setDuration] = useState("1 Hour")


  const handleSubmit = () => {

    if (!customerName) {
      alert("Enter customer name")
      return
    }

    startSession(
      station.id,
      customerName,
      duration
    )

    closeModal()
  }


  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">

      <div className="bg-zinc-900 p-6 rounded-2xl w-[400px]">

        <h2 className="text-2xl font-bold mb-6 text-green-400">
          Start Session
        </h2>


        <p className="mb-4">
          Station:
          <span className="font-bold ml-2">
            {station.name}
          </span>
        </p>


        <div className="mb-4">

          <label className="block mb-2">
            Customer Name
          </label>

          <input
            type="text"
            placeholder="Enter customer name"
            value={customerName}
            onChange={(e) =>
              setCustomerName(e.target.value)
            }
            className="w-full bg-zinc-800 p-3 rounded-xl outline-none"
          />

        </div>


        <div className="mb-6">

          <label className="block mb-2">
            Duration
          </label>

          <select
            value={duration}
            onChange={(e) =>
              setDuration(e.target.value)
            }
            className="w-full bg-zinc-800 p-3 rounded-xl outline-none"
          >

            <option>30 Minutes</option>
            <option>1 Hour</option>
            <option>2 Hours</option>

          </select>

        </div>


        <div className="flex gap-3">

          <button
            onClick={handleSubmit}
            className="bg-green-500 text-black px-4 py-3 rounded-xl font-bold flex-1"
          >
            Start
          </button>


          <button
            onClick={closeModal}
            className="bg-zinc-700 px-4 py-3 rounded-xl flex-1"
          >
            Cancel
          </button>

        </div>

      </div>

    </div>
  )
}

export default StartSessionModal