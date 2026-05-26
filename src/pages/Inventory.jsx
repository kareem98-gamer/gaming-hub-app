import { useEffect, useState } from "react"
import {
  collection,
  onSnapshot,
  doc,
  updateDoc,
  increment,
  addDoc
} from "firebase/firestore"

import { db } from "../firebase"

function Inventory() {

  const [items, setItems] = useState([])

  const [name, setName] = useState("")
  const [price, setPrice] = useState("")
  const [stock, setStock] = useState("")

  useEffect(() => {

    const unsub = onSnapshot(
      collection(db, "inventory"),
      (snap) => {

        const data = snap.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }))

        setItems(data)

      }
    )

    return () => unsub()

  }, [])

  // ADD ITEM
  const addItem = async () => {

    if (!name || !price || !stock) return

    await addDoc(collection(db, "inventory"), {
      name,
      price: Number(price),
      stock: Number(stock),
      minStock: 5
    })

    setName("")
    setPrice("")
    setStock("")
  }

  // ADD STOCK
  const addStock = async (id) => {
    await updateDoc(doc(db, "inventory", id), {
      stock: increment(1)
    })
  }

  // SELL ITEM
  const sellItem = async (item) => {

    if (item.stock <= 0) {
      alert("Out of stock")
      return
    }

    await updateDoc(doc(db, "inventory", item.id), {
      stock: increment(-1)
    })
  }

  return (
    <div className="min-h-screen bg-black text-white p-6">

      <h1 className="text-3xl mb-6">Inventory System</h1>

      {/* ADD ITEM */}
      <div className="bg-zinc-900 p-4 mb-6 rounded-lg">

        <h2 className="text-xl mb-3">Add New Item</h2>

        <div className="flex gap-2 flex-wrap">

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="p-2 bg-white text-black"
          />

          <input
            placeholder="Price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="p-2 bg-white text-black"
          />

          <input
            placeholder="Stock"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className="p-2 bg-white text-black"
          />

          <button
            onClick={addItem}
            className="bg-blue-500 px-4 py-2 rounded"
          >
            Add Item
          </button>

        </div>

      </div>

      {/* ITEMS */}
      <div className="grid grid-cols-3 gap-4">

        {items.map(item => (

          <div key={item.id} className="bg-zinc-900 p-4 rounded-xl">

            <h2 className="text-xl font-bold">{item.name}</h2>

            <p>Price: {item.price}</p>

            <p className={item.stock <= item.minStock ? "text-red-400" : "text-green-400"}>
              Stock: {item.stock}
            </p>

            {item.stock <= item.minStock && (
              <p className="text-red-500 text-sm">
                ⚠ Low Stock
              </p>
            )}

            <div className="flex gap-2 mt-3">

              <button
                onClick={() => addStock(item.id)}
                className="bg-green-500 px-3 py-1 rounded"
              >
                + Add
              </button>

              <button
                onClick={() => sellItem(item)}
                className="bg-red-500 px-3 py-1 rounded"
              >
                Sell
              </button>

            </div>

          </div>

        ))}

      </div>

    </div>
  )
}

export default Inventory