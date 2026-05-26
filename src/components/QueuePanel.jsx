function QueuePanel({ queue }) {

  return (
    <div>

      <h2 className="text-2xl font-bold mb-4">
        Queue
      </h2>


      <div className="bg-zinc-900 p-5 rounded-2xl">

        {queue.map((person) => (

          <div
            key={person.id}
            className="border-b border-zinc-700 pb-4 mb-4"
          >

            <h3 className="font-bold">
              {person.name}
            </h3>

            <p className="text-zinc-400 text-sm">
              Waiting for {person.console}
            </p>

            <p className="text-yellow-400 mt-2">
              Estimated Wait: {person.wait}
            </p>

          </div>

        ))}

      </div>

    </div>
  )
}

export default QueuePanel