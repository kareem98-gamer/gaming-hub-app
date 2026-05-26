function StationCard({
  station,
  openModal,
  cleanStation,
}) {

  return (
    <div
      className={`bg-zinc-900 p-5 rounded-2xl border ${
        station.status === "ACTIVE"
          ? "border-green-500"
          : station.status === "FINISHED"
          ? "border-red-500"
          : "border-blue-500"
      }`}
    >

      <div className="flex justify-between items-center">

        <h3 className="text-xl font-bold">
          {station.name}
        </h3>


        <span
          className={`px-3 py-1 rounded-full text-sm font-bold ${
            station.status === "ACTIVE"
              ? "bg-green-500 text-black"
              : station.status === "FINISHED"
              ? "bg-red-500 text-black"
              : "bg-blue-500 text-black"
          }`}
        >

          {station.status}

        </span>

      </div>


      {station.status === "ACTIVE" && (
        <>

          <p className="mt-4 text-zinc-400">
            Customer: {station.customer}
          </p>

          <p className="mt-2 text-zinc-400">
            Remaining: {station.remaining}
          </p>

        </>
      )}


      {station.status === "AVAILABLE" && (
        <>

          <p className="mt-4 text-zinc-400">
            Ready for next customer
          </p>

          <button
            onClick={() => openModal(station)}
            className="mt-5 bg-blue-500 text-black px-4 py-2 rounded-xl font-bold"
          >
            Start Session
          </button>

        </>
      )}


      {station.status === "FINISHED" && (
        <>

          <p className="mt-4 text-red-400">
            Session Finished
          </p>

          <p className="mt-2 text-zinc-400">
            Requires cleaning/reset
          </p>

          <button
            onClick={() =>
              cleanStation(station.id)
            }
            className="mt-5 bg-yellow-500 text-black px-4 py-2 rounded-xl font-bold"
          >
            Mark Cleaned
          </button>

        </>
      )}

    </div>
  )
}

export default StationCard