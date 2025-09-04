import { initializeApp } from 'firebase/app'
import { getDatabase } from 'firebase/database'

const firebaseConfig = {
  databaseURL: import.meta.env.VITE_FIREBASE_DB_URL,
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Realtime Database and get a reference to the service
const fireDB = getDatabase(app)

export default fireDB
