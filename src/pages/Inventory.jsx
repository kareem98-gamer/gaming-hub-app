import { useEffect, useState } from "react"

import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  addDoc,
  serverTimestamp
} from "firebase/firestore"

import { db } from "../firebase"

function Inventory() {

  const [items, setItems] = useState([])


  // LOAD INVENTORY REALTIME
  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "inventory"),
      (snap) => {

        const data = []

        snap.forEach(doc => {

          data.push({
            id: doc.id,
            ...doc.data()
          })

        })

        setItems(data)

      }
    )

    return () => unsub()

  }, [])


  // ADD STOCK
  const addStock = async (id) => {

    await updateDoc(
      doc(db, "inventory", id),
      {
        stock: increment(1)
      }
    )

  }


  // SELL ITEM
  const sellItem = async (item) => {

    // PREVENT NEGATIVE STOCK
    if (item.stock <= 0) {
      alert("Out of stock")
      return
    }

    // REMOVE 1 STOCK
    await updateDoc(
      doc(db, "inventory", item.id),
      {
        stock: increment(-1)
      }
    )

    // SAVE SALE INTO FIREBASE
    await addDoc(
      collection(db, "inventorySales"),
      {
        itemName: item.name,
        price: Number(item.price),
        soldAt: Date.now(),
        createdAt: serverTimestamp()
      }
    )

  }


  return (

    <div className="min-h-screen bg-zinc-950 text-white p-6">

      <h1 className="text-3xl font-bold mb-6">
        Inventory System
      </h1>


      <div className="grid grid-cols-3 gap-4">

        {items.map(item => (

          <div
            key={item.id}
            className="bg-zinc-900 p-4 rounded-xl"
          >

            <h2 className="text-xl font-bold mb-2">
              {item.name}
            </h2>

            <p className="mb-1">
              Price:
              <span className="text-green-400 ml-2">
                {item.price} LYD
              </span>
            </p>

            <p className="mb-3">
              Stock:
              <span className={
                item.stock <= 5
                  ? "text-red-400 ml-2"
                  : "text-blue-400 ml-2"
              }>
                {item.stock}
              </span>
            </p>


            {/* LOW STOCK WARNING */}
            {item.stock <= 5 && (
              <div className="bg-red-500 p-2 rounded mb-3 text-sm">
                Low Stock Warning
              </div>
            )}


            <div className="flex gap-2">

              <button
                onClick={() => addStock(item.id)}
                className="bg-green-500 px-3 py-2 rounded"
              >
                + Add Stock
              </button>

              <button
                onClick={() => sellItem(item)}
                className="bg-red-500 px-3 py-2 rounded"
              >
                Sell Item
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Inventory