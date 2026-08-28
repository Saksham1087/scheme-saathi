import { setGlobalOptions } from "firebase-functions/v2"
import { initializeApp } from "firebase-admin/app"
import { matchSchemes } from "./matchSchemes"
import { submitApplication } from "./submitApplication"
import { scheduledSync, normalizeMcpEntry, schemesSeed } from "./mcpSync/scheduledSync"
import { chatCompletion, textToSpeech } from "./chat"

// NOTE: keep functions in the default region so the web client's
// getFunctions() (us-central1) resolves them without extra config.
setGlobalOptions({ maxInstances: 10 })

initializeApp()

export { matchSchemes, submitApplication, scheduledSync, normalizeMcpEntry, schemesSeed, chatCompletion, textToSpeech }
