import { useState } from "react"
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from "../firebase"
import { useNavigate } from "react-router-dom"

function Login() {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const navigate = useNavigate()

  const login = async () => {

    try {

      await signInWithEmailAndPassword(auth, email, password)

      // TEMP FIX: force admin for now
      localStorage.setItem("role", "admin")

      navigate("/dashboard")

    } catch (err) {
      alert(err.message)
    }

  }

  return (
    <div className="h-screen flex items-center justify-center bg-black text-white">

      <div className="bg-zinc-900 p-6 rounded-xl w-80">

        <h1 className="text-xl mb-4">Login</h1>

        <input
          className="w-full p-2 mb-2 text-black"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-2 mb-4 text-black"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={login}
          className="w-full bg-blue-500 p-2 rounded"
        >
          Login
        </button>

      </div>

    </div>
  )
}

export default Login