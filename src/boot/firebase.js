// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getDatabase } from "firebase/database"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBIhU40emk0EzSCw_ASkwhEKcqiSlN14_A",
  authDomain: "awesome-todo-3ff9f.firebaseapp.com",
  databaseURL: "https://awesome-todo-3ff9f-default-rtdb.firebaseio.com",
  projectId: "awesome-todo-3ff9f",
  storageBucket: "awesome-todo-3ff9f.appspot.com",
  messagingSenderId: "961014179792",
  appId: "1:961014179792:web:f19911ea56909e7de5bbd5"
}

// Initialize Firebase
let firebaseApp = initializeApp(firebaseConfig)
let firebaseAuth = getAuth(firebaseApp)

let firebaseDb = getDatabase(firebaseApp)

export { firebaseAuth, firebaseDb }
