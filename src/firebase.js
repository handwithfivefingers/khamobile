import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: 'AIzaSyB8q8Sz_CL1ki-n2exGdPFcVXkiJ-JooMU',
  authDomain: 'khamobile-66877.firebaseapp.com',
  projectId: 'khamobile-66877',
  storageBucket: 'khamobile-66877.appspot.com',
  messagingSenderId: '1009592411419',
  appId: '1:1009592411419:web:849602b587cce8dec45fbe',
  measurementId: 'G-S940QJ6ZLQ',
}
// Initialize Firebase
let analytics
let storage

if (firebaseConfig?.projectId) {
  // Initialize Firebase
  const app = initializeApp(firebaseConfig)

  if (app.name && typeof window !== 'undefined') {
    analytics = getAnalytics(app)
  }

  // Access Firebase services using shorthand notation
  storage = getStorage(app)
}

export { storage, analytics }
