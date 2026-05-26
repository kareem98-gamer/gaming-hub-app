import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"

function Inventory() {

  const role = localStorage.getItem("role")
  const [items, setItems] = useState([])

  if (role !== "admin") {
    return <div className="text-white p-10">❌ Access Denied</div>
  }

  useEffect(() => {

    console.log("Inventory page loaded")

    const unsub = onSnapshot(
      collection(db, "inventory"),
      (snapshot) => {

        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        console.log("DATA FROM FIRESTORE:", data)

        setItems(data)

      }
    )

    return () => unsub()

  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl mb-6">Inventory System</h1>

      {items.length === 0 ? (
        <div className="text-gray-400">
          ❌ No items found in Firestore collection: inventory
        </div>
      ) : (

        <div className="grid grid-cols-3 gap-4">

          {items.map(item => (

            <div key={item.id} className="bg-zinc-900 p-4 rounded-xl">

              <h2 className="text-xl">{item.name}</h2>

              <p>Price: {item.price}</p>

              <p>Stock: {item.stock}</p>

            </div>

          ))}

        </div>

      )}

    </div>
  )
}

export default Inventory