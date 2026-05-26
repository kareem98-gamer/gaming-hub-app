function StatsCards({
  activeSessions,
  availableStations,
  queueLength,
}) {

  return (
    <div className="grid grid-cols-4 gap-4 mb-8">

      <div className="bg-zinc-900 p-5 rounded-2xl">
        <h2 className="text-zinc-400">
          Active Sessions
        </h2>

        <p className="text-3xl font-bold mt-2 text-green-400">
          {activeSessions}
        </p>
      </div>


      <div className="bg-zinc-900 p-5 rounded-2xl">
        <h2 className="text-zinc-400">
          Available Stations
        </h2>

        <p className="text-3xl font-bold mt-2 text-blue-400">
          {availableStations}
        </p>
      </div>


      <div className="bg-zinc-900 p-5 rounded-2xl">
        <h2 className="text-zinc-400">
          Queue Waiting
        </h2>

        <p className="text-3xl font-bold mt-2 text-yellow-400">
          {queueLength}
        </p>
      </div>


      <div className="bg-zinc-900 p-5 rounded-2xl">
        <h2 className="text-zinc-400">
          Revenue Today
        </h2>

        <p className="text-3xl font-bold mt-2 text-red-400">
          320 LYD
        </p>
      </div>

    </div>
  )
}

export default StatsCards