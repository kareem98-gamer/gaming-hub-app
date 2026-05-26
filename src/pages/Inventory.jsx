import { useEffect, useState } from "react"
import { collection, onSnapshot } from "firebase/firestore"
import { db } from "../firebase"

function Inventory() {

  const [items, setItems] = useState([])

  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "inventory"),
      (snapshot) => {

        setItems(
          snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }))
        )

      }
    )

    return () => unsub()

  }, [])

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl mb-6">Inventory</h1>

      {items.length === 0 ? (
        <p>No items found</p>
      ) : (
        items.map(item => (
          <div key={item.id} className="mb-2">
            {item.name} - {item.stock}
          </div>
        ))
      )}

    </div>
  )
}

export default Inventory