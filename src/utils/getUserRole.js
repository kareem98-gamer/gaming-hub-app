import { doc, getDoc } from "firebase/firestore"
import { db } from "../firebase"

export const getUserRole = async (uid) => {

  try {

    const ref = doc(db, "users", uid)
    const snap = await getDoc(ref)

    if (!snap.exists()) {
      return "cashier"
    }

    return snap.data().role || "cashier"

  } catch (error) {

    console.log("getUserRole error:", error)

    return "cashier"
  }
}