function Header() {
  return (
    <div className="flex justify-between items-center mb-8">

      <div>
        <h1 className="text-4xl font-bold text-green-400">
          Gaming Hub Dashboard
        </h1>

        <p className="text-zinc-400 mt-2">
          Live Operations System
        </p>
      </div>

      <div className="bg-zinc-900 px-4 py-2 rounded-xl">
        Admin Panel
      </div>

    </div>
  )
}

export default Header