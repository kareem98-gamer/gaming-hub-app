function QueuePanel({ queue, cancelQueue }) {

  return (
    <div className="bg-zinc-900 p-4 rounded-xl">

      <h2 className="text-xl mb-4">Queue</h2>

      {queue.length === 0 && (
        <p className="text-zinc-500">
          No customers waiting
        </p>
      )}

      <div className="space-y-2">

        {queue.map((q, index) => (

          <div
            key={q.id}
            className="flex justify-between items-center bg-zinc-800 p-2 rounded"
          >

            <div>
              <span className="font-bold mr-2">
                #{index + 1}
              </span>

              {q.name}
            </div>

            <button
              onClick={() => cancelQueue(q.id)}
              className="bg-red-500 px-2 py-1 rounded"
            >
              Cancel
            </button>

          </div>

        ))}

      </div>

    </div>
  )
}

export default QueuePanel