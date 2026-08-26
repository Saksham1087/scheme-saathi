import { initializeApp, type FirebaseOptions } from "firebase/app"
import { getAuth, connectAuthEmulator } from "firebase/auth"
import { getFirestore, connectFirestoreEmulator } from "firebase/firestore"
import { getFunctions, connectFunctionsEmulator } from "firebase/functions"
import { getStorage, connectStorageEmulator } from "firebase/storage"

/**
 * Demo-project fallback keeps every screen working even before real Firebase
 * credentials exist. With the emulator suite running, the whole product is
 * usable locally with zero cloud setup.
 */
const demoConfig: FirebaseOptions = {
  apiKey: "demo-api-key",
  authDomain: "scheme-saathi-demo.firebaseapp.com",
  projectId: "scheme-saathi-demo",
  storageBucket: "scheme-saathi-demo.appspot.com",
  messagingSenderId: "0",
  appId: "1:0:web:demo",
}

const envConfig: Partial<FirebaseOptions> = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const useEnvConfig = Boolean(envConfig.apiKey && envConfig.projectId)

export const firebaseApp = initializeApp(
  useEnvConfig ? (envConfig as FirebaseOptions) : demoConfig,
)

export const auth = getAuth(firebaseApp)
export const db = getFirestore(firebaseApp)
export const functions = getFunctions(firebaseApp)
export const storage = getStorage(firebaseApp)

async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD" })
    return res.ok || res.status === 200 || res.status === 404
  } catch {
    return false
  }
}

async function tryConnectEmulators() {
  const shouldUseEmulators =
    import.meta.env.VITE_USE_EMULATORS === "true" && import.meta.env.DEV

  if (!shouldUseEmulators) return

  if (await isReachable("http://127.0.0.1:9099")) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    })
  }
  if (await isReachable("http://127.0.0.1:8080")) {
    connectFirestoreEmulator(db, "127.0.0.1", 8080)
  }
  if (await isReachable("http://127.0.0.1:5001")) {
    connectFunctionsEmulator(functions, "127.0.0.1", 5001)
  }
  if (await isReachable("http://127.0.0.1:9199")) {
    connectStorageEmulator(storage, "127.0.0.1", 9199)
  }
}

tryConnectEmulators()
