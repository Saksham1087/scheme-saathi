import { useState } from "react"
import { useTranslation } from "react-i18next"
import { ExternalLink, CheckCircle2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { initiateAuth, fetchDocuments, disconnect } from "@/services/digilocker"
import { getConnectionStatus } from "@/services/digilocker/types"

interface DigiLockerButtonProps {
  onDocumentsFetched?: (docs: { name: string; type: string }[]) => void
}

export function DigiLockerButton({ onDocumentsFetched }: DigiLockerButtonProps) {
  const { t } = useTranslation()
  const [isConnected, setIsConnected] = useState(getConnectionStatus())
  const [isLoading, setIsLoading] = useState(false)

  const handleConnect = () => {
    const url = initiateAuth()
    window.location.href = url
  }

  const handleFetchDocuments = async () => {
    setIsLoading(true)
    try {
      const docs = await fetchDocuments()
      onDocumentsFetched?.(docs.map((d) => ({ name: d.name, type: d.type })))
      setIsConnected(true)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDisconnect = () => {
    disconnect()
    setIsConnected(false)
  }

  if (isConnected) {
    return (
      <div className="flex items-center gap-2">
        <Badge variant="default" className="gap-1 bg-success">
          <CheckCircle2 className="size-3" />
          {t("digilocker.connected")}
        </Badge>
        <Button size="sm" variant="outline" onClick={handleFetchDocuments} disabled={isLoading}>
          {isLoading ? <Loader2 className="size-4 animate-spin" /> : t("digilocker.fetchDocs")}
        </Button>
        <Button size="sm" variant="ghost" onClick={handleDisconnect}>
          {t("digilocker.disconnect")}
        </Button>
      </div>
    )
  }

  return (
    <Button size="sm" variant="outline" onClick={handleConnect}>
      <ExternalLink className="mr-1.5 size-4" />
      {t("digilocker.connect")}
    </Button>
  )
}
