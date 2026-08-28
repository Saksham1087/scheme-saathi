export interface DigiLockerToken {
  accessToken: string
  refreshToken?: string
  expiresAt: number
  tokenType: string
}

export interface DigiLockerDocument {
  uri: string
  name: string
  type: string
  issuer: string
  issuedDate?: string
  verificationStatus: "verified" | "pending" | "failed"
}

export interface DigiLockerState {
  isConnected: boolean
  token: DigiLockerToken | null
  documents: DigiLockerDocument[]
}

let currentState: DigiLockerState = {
  isConnected: false,
  token: null,
  documents: [],
}

export function getConnectionStatus(): boolean {
  if (!currentState.token) return false
  return currentState.token.expiresAt > Date.now()
}

export function getAvailableDocuments(): DigiLockerDocument[] {
  return currentState.documents
}

export function storeToken(token: DigiLockerToken): void {
  currentState = { ...currentState, token, isConnected: true }
}

export function clearToken(): void {
  currentState = { token: null, isConnected: false, documents: [] }
}
