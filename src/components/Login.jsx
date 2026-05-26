import { useState } from "react"

import {
  signInWithEmailAndPassword,
} from "firebase/auth"

import { auth } from "../firebase"


function Login({ setUser }) {

  const [email, setEmail] =
    useState("")

  const [password, setPassword] =
    useState("")

  const [error, setError] =
    useState("")


  const handleLogin = async (e) => {

    e.preventDefault()

    try {

      const userCredential =
        await signInWithEmailAndPassword(
          auth,
          email,
          password
        )

      setUser(userCredential.user)

    } catch (err) {

      setError("Invalid email or password")

    }

  }


  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center text-white">

      <form
        onSubmit={handleLogin}
        className="bg-zinc-900 p-8 rounded-2xl w-[400px] border border-zinc-800"
      >

        <h1 className="text-3xl font-bold mb-6 text-center">
          Gaming Hub Login
        </h1>


        <input
          type="email"
          placeholder="Email"
          className="w-full p-3 rounded-xl bg-zinc-800 mb-4"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />


        <input
          type="password"
          placeholder="Password"
          className="w-full p-3 rounded-xl bg-zinc-800 mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />


        {error && (
          <p className="text-red-500 mb-4">
            {error}
          </p>
        )}


        <button
          type="submit"
          className="w-full bg-green-500 text-black p-3 rounded-xl font-bold"
        >
          Login
        </button>

      </form>
    </div>
  )
}

export default Login