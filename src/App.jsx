import {
  Routes,
  Route,
  Navigate,
} from "react-router-dom"

import Dashboard from "./pages/Dashboard"
import Analytics from "./pages/Analytics"
import Receipts from "./pages/Receipts"
import Admin from "./pages/Admin"

function App() {

  return (

    <Routes>

      <Route
        path="/"
        element={<Navigate to="/dashboard" />}
      />

      <Route
        path="/dashboard"
        element={<Dashboard />}
      />

      <Route
        path="/analytics"
        element={<Analytics />}
      />

      <Route
        path="/receipts"
        element={<Receipts />}
      />

      <Route
        path="/admin"
        element={<Admin />}
      />

    </Routes>

  )
}

export default App