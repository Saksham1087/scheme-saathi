import { create } from "zustand"
import { onAuthStateChanged, type User } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthState {
  user: User | null
  loading: boolean
}

export const useAuthStore = create<AuthState>()(() => ({
  user: null,
  loading: true,
}))

onAuthStateChanged(auth, (user) => {
  useAuthStore.setState({ user, loading: false })
})
