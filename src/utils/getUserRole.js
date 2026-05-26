import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

export async function getUserRole(uid) {

  try {

    const ref = doc(db, "users", uid)
    const snap = await getDoc(ref)

    if (snap.exists()) {
      return snap.data().role
    }

    return "cashier"

  } catch (err) {
    console.log("Role error:", err)
    return "cashier"
  }

}