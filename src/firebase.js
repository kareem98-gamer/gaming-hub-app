import { initializeApp } from "firebase/app"

import {
  getFirestore,
} from "firebase/firestore"

import {
  getAuth,
} from "firebase/auth"


const firebaseConfig = {

  apiKey: "AIzaSyBqz46p8z7EWh63E3Hokh8J6BNpl0Zd894",

  authDomain: "gaming-hub-system.firebaseapp.com",

  projectId: "gaming-hub-system",

  storageBucket: "gaming-hub-system.firebasestorage.app",

  messagingSenderId: "1076120854864",

  appId: "1:1076120854864:web:43e0e08c60c7a757410c55"


}


const app =
  initializeApp(firebaseConfig)


export const db =
  getFirestore(app)

export const auth =
  getAuth(app)