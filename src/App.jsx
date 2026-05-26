import { Routes, Route, Navigate } from "react-router-dom"

import Login from "./components/Login"
import Dashboard from "./pages/Dashboard"
import Analytics from "./pages/Analytics"
import Inventory from "./pages/Inventory"

function App() {

  return (

    <Routes>

      <Route path="/login" element={<Login />} />

      <Route path="/dashboard" element={<Dashboard />} />

      <Route path="/analytics" element={<Analytics />} />

      <Route path="/inventory" element={<Inventory />} />

      <Route path="*" element={<Navigate to="/login" />} />

    </Routes>

  )
}

export default App