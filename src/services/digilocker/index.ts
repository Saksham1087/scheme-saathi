import {
  type DigiLockerDocument,
  type DigiLockerToken,
  storeToken,
  clearToken,
} from "./types"

const DigiLockerAPI = "https://api.digilocker.gov.in"

export function initiateAuth(): string {
  const state = crypto.randomUUID()
  const redirectUri = `${window.location.origin}/digilocker/callback`
  return `${DigiLockerAPI}/oauth2/authorize?client_id=demo&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&state=${state}`
}

export async function handleCallback(code: string): Promise<boolean> {
  try {
    const mockToken: DigiLockerToken = {
      accessToken: `mock-${code}`,
      expiresAt: Date.now() + 3600000,
      tokenType: "Bearer",
    }
    storeToken(mockToken)
    return true
  } catch {
    return false
  }
}

export async function fetchDocuments(): Promise<DigiLockerDocument[]> {
  const mockDocs: DigiLockerDocument[] = [
    { uri: "doc/aadhaar", name: "Aadhaar Card", type: "identity", issuer: "UIDAI", verificationStatus: "verified" },
    { uri: "doc/caste", name: "Caste Certificate", type: "certificate", issuer: "Revenue Department", verificationStatus: "verified" },
    { uri: "doc/income", name: "Income Certificate", type: "certificate", issuer: "Revenue Department", verificationStatus: "verified" },
  ]
  return mockDocs
}

export function disconnect(): void {
  clearToken()
}
