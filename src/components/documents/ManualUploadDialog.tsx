import { useState, useRef } from "react"
import type { DragEvent, ChangeEvent } from "react"
import { useTranslation } from "react-i18next"
import { toast } from "sonner"
import {
  UploadCloud,
  FileText,
  ImageIcon,
  Trash2,
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  FileCheck,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDocumentStore } from "@/stores/useDocumentStore"
import type { RequiredDocument, UploadedFileRecord } from "@/types"

interface ManualUploadDialogProps {
  document: RequiredDocument
  open: boolean
  onOpenChange: (open: boolean) => void
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024 // 5 MB
const ALLOWED_MIME_TYPES = ["application/pdf", "image/jpeg", "image/png", "image/jpg"]
const ALLOWED_EXTENSIONS = [".pdf", ".jpg", ".jpeg", ".png"]

export function ManualUploadDialog({
  document,
  open,
  onOpenChange,
}: ManualUploadDialogProps) {
  const { t, i18n } = useTranslation()
  const lang = (i18n.language === "hi" ? "hi" : "en") as "en" | "hi"

  const {
    manualUploads,
    uploadManualDocument,
    removeManualDocument,
  } = useDocumentStore()

  const existingUpload = manualUploads[document.id]

  const [isDragging, setIsDragging] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const docName = document.name?.[lang] || document.name?.en || ""

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setSelectedFile(null)
      setPreviewUrl(null)
      setIsConfirmingDelete(false)
    }
    onOpenChange(newOpen)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const validateAndProcessFile = (file: File) => {
    // 1. File Size Validation
    if (file.size > MAX_FILE_SIZE_BYTES) {
      toast.error(
        t(
          "upload.errorSizeExceeded",
          "File size exceeds 5MB limit"
        )
      )
      return
    }

    // 2. MIME / Extension Validation
    const ext = "." + file.name.split(".").pop()?.toLowerCase()
    const isValidType =
      ALLOWED_MIME_TYPES.includes(file.type) ||
      ALLOWED_EXTENSIONS.includes(ext)

    if (!isValidType) {
      toast.error(
        t(
          "upload.errorInvalidType",
          "Invalid file format. Only PDF, JPG, and PNG are allowed."
        )
      )
      return
    }

    setSelectedFile(file)

    // Generate preview URL if image
    if (file.type.startsWith("image/")) {
      const reader = new FileReader()
      reader.onload = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreviewUrl(null)
    }
  }

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0]
      validateAndProcessFile(file)
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0]
      validateAndProcessFile(file)
    }
  }

  const handleConfirmSaveUpload = () => {
    if (!selectedFile) return

    const record: UploadedFileRecord = {
      fileName: selectedFile.name,
      fileSize: selectedFile.size,
      fileType: selectedFile.type || "application/octet-stream",
      uploadedAt: new Date().toISOString(),
      previewUrl: previewUrl || undefined,
    }

    uploadManualDocument(document.id, record)
    toast.success(
      t(
        "upload.toastUploadSuccess",
        "Document uploaded successfully!"
      )
    )
    onOpenChange(false)
  }

  const handleDeleteUploadedFile = () => {
    removeManualDocument(document.id)
    setSelectedFile(null)
    setPreviewUrl(null)
    setIsConfirmingDelete(false)
    toast.info(
      t(
        "upload.toastDeleteSuccess",
        "Uploaded document removed."
      )
    )
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader className="space-y-1.5">
          <div className="flex items-center gap-2 text-primary">
            <UploadCloud className="size-5" />
            <span className="text-xs font-bold uppercase tracking-wider">
              {t("upload.headerBadge", "Manual Document Upload")}
            </span>
          </div>
          <DialogTitle className="text-lg sm:text-xl font-bold text-foreground">
            {docName}
          </DialogTitle>
          <DialogDescription className="text-xs sm:text-sm text-muted-foreground">
            {t(
              "upload.dialogSubtitle",
              "Upload a scanned copy or clear photograph of the certificate for branch verification (Max 5MB: PDF, JPG, PNG)."
            )}
          </DialogDescription>
        </DialogHeader>

        {/* Existing Upload View */}
        {existingUpload && !selectedFile && !isConfirmingDelete && (
          <div className="space-y-4 py-2">
            <div className="rounded-xl border-2 border-primary/30 bg-primary/5 p-4 sm:p-5 space-y-3">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex items-center justify-center size-10 rounded-lg bg-primary/10 text-primary shrink-0">
                    {existingUpload.fileType.includes("pdf") ? (
                      <FileText className="size-5" />
                    ) : (
                      <ImageIcon className="size-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-foreground truncate">
                      {existingUpload.fileName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatFileSize(existingUpload.fileSize)} •{" "}
                      {new Date(existingUpload.uploadedAt).toLocaleDateString(
                        lang === "hi" ? "hi-IN" : "en-IN",
                        { day: "numeric", month: "short", year: "numeric" }
                      )}
                    </p>
                  </div>
                </div>

                <Badge className="bg-emerald-600 text-white text-[10px] uppercase font-semibold shrink-0">
                  {t("upload.badgeUploaded", "Uploaded")}
                </Badge>
              </div>

              {/* Thumbnail if preview available */}
              {existingUpload.previewUrl && (
                <div className="rounded-lg overflow-hidden border border-border/80 max-h-48 flex items-center justify-center bg-black/5">
                  <img
                    src={existingUpload.previewUrl}
                    alt={existingUpload.fileName}
                    className="max-h-48 object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-2 pt-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsConfirmingDelete(true)}
                className="h-10 min-h-[44px] text-xs font-semibold text-destructive hover:text-destructive hover:bg-destructive/10 gap-1.5 w-full sm:w-auto"
              >
                <Trash2 className="size-3.5" />
                <span>{t("upload.btnDeleteFile", "Remove File")}</span>
              </Button>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="h-10 min-h-[44px] text-xs font-semibold gap-1.5 w-full sm:w-auto"
                >
                  <RefreshCw className="size-3.5" />
                  <span>{t("upload.btnReplaceFile", "Replace File")}</span>
                </Button>
                <Button
                  type="button"
                  onClick={() => onOpenChange(false)}
                  className="h-10 min-h-[44px] text-xs font-semibold px-5 w-full sm:w-auto"
                >
                  {t("common.done", "Done")}
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Confirm Delete State */}
        {isConfirmingDelete && (
          <div className="space-y-4 py-2">
            <div className="flex items-center gap-2 text-destructive">
              <AlertCircle className="size-5" />
              <h4 className="font-bold text-base">
                {t("upload.confirmDeleteTitle", "Remove Uploaded File?")}
              </h4>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              {t(
                "upload.confirmDeleteDesc",
                "This will remove the uploaded file record and reset the document readiness status. You can upload a new copy anytime."
              )}
            </p>
            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsConfirmingDelete(false)}
                className="h-11 min-h-[44px] text-xs font-semibold"
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleDeleteUploadedFile}
                className="h-11 min-h-[44px] text-xs font-semibold gap-1.5"
              >
                <Trash2 className="size-3.5" />
                <span>{t("upload.btnConfirmDelete", "Yes, Remove File")}</span>
              </Button>
            </DialogFooter>
          </div>
        )}

        {/* New / Replace Upload Zone */}
        {(!existingUpload || selectedFile) && !isConfirmingDelete && (
          <div className="space-y-4 py-1">
            {/* Drag & Drop Area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 sm:p-8 text-center cursor-pointer transition-all duration-200 ${
                isDragging
                  ? "border-primary bg-primary/10 scale-[1.01]"
                  : "border-border/80 hover:border-primary/60 bg-muted/20 hover:bg-muted/40"
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                onChange={handleFileInputChange}
                className="hidden"
                aria-label={t("upload.inputAriaLabel", "Choose file to upload")}
              />

              <div className="flex flex-col items-center justify-center space-y-3">
                <div className="flex items-center justify-center size-14 rounded-full bg-primary/10 text-primary">
                  <UploadCloud className="size-7" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-semibold text-foreground">
                    {t(
                      "upload.dropzonePrompt",
                      "Click to browse or drag and drop file here"
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {t(
                      "upload.dropzoneFormats",
                      "PDF, JPG, PNG (Max size: 5 MB)"
                    )}
                  </p>
                </div>
              </div>
            </div>

            {/* Selected File Details & Preview */}
            {selectedFile && (
              <div className="rounded-xl border border-border bg-card p-3.5 space-y-2.5">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileCheck className="size-4 text-emerald-600 shrink-0" />
                    <span className="text-xs font-semibold text-foreground truncate">
                      {selectedFile.name}
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-mono shrink-0">
                    {formatFileSize(selectedFile.size)}
                  </span>
                </div>

                {previewUrl && (
                  <div className="rounded-lg overflow-hidden border border-border/60 max-h-36 flex items-center justify-center bg-black/5">
                    <img
                      src={previewUrl}
                      alt={selectedFile.name}
                      className="max-h-36 object-contain"
                    />
                  </div>
                )}
              </div>
            )}

            <DialogFooter className="flex flex-col-reverse sm:flex-row gap-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSelectedFile(null)
                  setPreviewUrl(null)
                  onOpenChange(false)
                }}
                className="h-11 min-h-[44px] text-xs font-semibold"
              >
                {t("common.cancel", "Cancel")}
              </Button>
              <Button
                type="button"
                disabled={!selectedFile}
                onClick={handleConfirmSaveUpload}
                className="h-11 min-h-[44px] text-xs font-semibold gap-1.5"
              >
                <CheckCircle2 className="size-4" />
                <span>{t("upload.btnSaveDocument", "Save & Attach Document")}</span>
              </Button>
            </DialogFooter>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
