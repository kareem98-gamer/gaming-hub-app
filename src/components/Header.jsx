import { signOut } from "firebase/auth"
import { auth } from "../firebase"

import { useNavigate } from "react-router-dom"

function Header() {

  const navigate = useNavigate()

  const logout = async () => {

    await signOut(auth)

    navigate("/login")
  }

  return (

    <div className="flex justify-between items-center mb-6">

      <h1 className="text-2xl font-bold">
        Gaming Hub POS
      </h1>


      <div className="flex gap-3">

        <button
          onClick={() => navigate("/dashboard")}
          className="bg-zinc-800 px-3 py-2 rounded-xl"
        >
          Dashboard
        </button>

        <button
          onClick={() => navigate("/analytics")}
          className="bg-blue-500 px-3 py-2 rounded-xl"
        >
          Analytics
        </button>

        <button
          onClick={() => navigate("/inventory")}
          className="bg-yellow-500 px-3 py-2 rounded-xl"
        >
          Inventory
        </button>

        <button
          onClick={logout}
          className="bg-red-500 px-3 py-2 rounded-xl"
        >
          Logout
        </button>

      </div>

    </div>

  )
}

export default Header