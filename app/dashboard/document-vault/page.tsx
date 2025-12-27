"use client"

import { useState, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Shield,
  Upload,
  Lock,
  FileText,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertTriangle,
  Key,
  Database,
  Cloud,
  Trash2,
  Download,
  Unlock,
  FileArchive,
  Clock,
  ShieldCheck,
  Import,
  FolderOpen,
  Copy,
  RefreshCw,
  FileKey,
  HardDrive,
  Fingerprint,
} from "lucide-react"

interface EncryptedFile {
  id: string
  name: string
  originalName: string
  originalSize: number
  encryptedSize: number
  encryptedAt: Date
  iv: Uint8Array
  salt: Uint8Array
  encryptedData: ArrayBuffer
  status: "encrypted" | "decrypting" | "decrypted"
  type: string
  checksum: string
}

interface VaultStats {
  totalFiles: number
  totalSize: number
  lastActivity: Date | null
}

export default function DocumentVaultPage() {
  const [pin, setPin] = useState("")
  const [showPin, setShowPin] = useState(false)
  const [pinStrength, setPinStrength] = useState<"weak" | "medium" | "strong" | null>(null)
  const [isPwnedChecking, setIsPwnedChecking] = useState(false)
  const [isPwned, setIsPwned] = useState<boolean | null>(null)
  const [files, setFiles] = useState<EncryptedFile[]>([])
  const [isEncrypting, setIsEncrypting] = useState(false)
  const [encryptionProgress, setEncryptionProgress] = useState(0)
  const [encryptionStage, setEncryptionStage] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [decryptPin, setDecryptPin] = useState("")
  const [decryptingFileId, setDecryptingFileId] = useState<string | null>(null)
  const [isDecrypting, setIsDecrypting] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("encrypt")
  const [importedVaultFile, setImportedVaultFile] = useState<File | null>(null)
  const [isImporting, setIsImporting] = useState(false)
  const [showDecryptModal, setShowDecryptModal] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const importInputRef = useRef<HTMLInputElement>(null)

  // Vault stats
  const vaultStats: VaultStats = {
    totalFiles: files.length,
    totalSize: files.reduce((acc, f) => acc + f.encryptedSize, 0),
    lastActivity: files.length > 0 ? files[0].encryptedAt : null,
  }

  const checkPinStrength = (value: string) => {
    if (value.length < 6) {
      setPinStrength("weak")
    } else if (value.length < 10 || !/[A-Z]/.test(value) || !/[0-9]/.test(value)) {
      setPinStrength("medium")
    } else {
      setPinStrength("strong")
    }
  }

  const checkPwned = async () => {
    if (pin.length < 4) return
    setIsPwnedChecking(true)
    try {
      await new Promise((r) => setTimeout(r, 500))
      const commonPins = [
        "123456",
        "password",
        "12345678",
        "qwerty",
        "abc123",
        "111111",
        "123123",
        "admin",
        "letmein",
        "welcome",
        "password1",
        "iloveyou",
        "sunshine",
        "princess",
        "football",
      ]
      setIsPwned(commonPins.includes(pin.toLowerCase()))
    } finally {
      setIsPwnedChecking(false)
    }
  }

  // Generate SHA-256 checksum
  const generateChecksum = async (data: ArrayBuffer): Promise<string> => {
    const hashBuffer = await crypto.subtle.digest("SHA-256", data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("")
      .slice(0, 16)
  }

  const deriveKey = async (pin: string, salt: Uint8Array): Promise<CryptoKey> => {
    const encoder = new TextEncoder()
    const pinData = encoder.encode(pin)
    const keyMaterial = await crypto.subtle.importKey("raw", pinData, "PBKDF2", false, ["deriveKey"])

    return await crypto.subtle.deriveKey(
      { name: "PBKDF2", salt, iterations: 100000, hash: "SHA-256" },
      keyMaterial,
      { name: "AES-GCM", length: 256 },
      false,
      ["encrypt", "decrypt"],
    )
  }

  const encryptFile = async () => {
    if (!selectedFile || !pin || pin.length < 6) {
      setError("Please select a file and enter a PIN (minimum 6 characters)")
      return
    }

    setIsEncrypting(true)
    setEncryptionProgress(0)
    setError(null)
    setSuccessMessage(null)

    try {
      setEncryptionStage("Generating cryptographic salt...")
      setEncryptionProgress(10)
      const salt = crypto.getRandomValues(new Uint8Array(16))
      await new Promise((r) => setTimeout(r, 200))

      setEncryptionStage("Deriving encryption key (PBKDF2)...")
      setEncryptionProgress(25)
      const key = await deriveKey(pin, salt)
      await new Promise((r) => setTimeout(r, 200))

      setEncryptionStage("Reading file contents...")
      setEncryptionProgress(40)
      const fileBuffer = await selectedFile.arrayBuffer()
      await new Promise((r) => setTimeout(r, 100))

      setEncryptionStage("Generating initialization vector...")
      setEncryptionProgress(55)
      const iv = crypto.getRandomValues(new Uint8Array(12))
      await new Promise((r) => setTimeout(r, 100))

      setEncryptionStage("Encrypting with AES-256-GCM...")
      setEncryptionProgress(70)
      const encryptedBuffer = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, fileBuffer)
      await new Promise((r) => setTimeout(r, 200))

      setEncryptionStage("Generating checksum...")
      setEncryptionProgress(90)
      const checksum = await generateChecksum(encryptedBuffer)
      await new Promise((r) => setTimeout(r, 100))

      setEncryptionProgress(100)
      setEncryptionStage("Complete!")

      const encryptedFile: EncryptedFile = {
        id: `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: `${selectedFile.name}.encrypted`,
        originalName: selectedFile.name,
        originalSize: selectedFile.size,
        encryptedSize: encryptedBuffer.byteLength,
        encryptedAt: new Date(),
        iv,
        salt,
        encryptedData: encryptedBuffer,
        status: "encrypted",
        type: selectedFile.type || "application/octet-stream",
        checksum,
      }

      setFiles((prev) => [encryptedFile, ...prev])
      setSelectedFile(null)
      setSuccessMessage(`"${selectedFile.name}" encrypted successfully with AES-256-GCM!`)
      if (fileInputRef.current) fileInputRef.current.value = ""
    } catch (error) {
      console.error("Encryption error:", error)
      setError("Encryption failed. Please try again.")
    } finally {
      setIsEncrypting(false)
      setEncryptionProgress(0)
      setEncryptionStage("")
    }
  }

  const decryptAndDownload = async (file: EncryptedFile) => {
    if (!decryptPin || decryptPin.length < 6) {
      setError("Please enter your PIN (minimum 6 characters)")
      return
    }

    setIsDecrypting(file.id)
    setError(null)
    setSuccessMessage(null)

    try {
      const key = await deriveKey(decryptPin, file.salt)
      const decryptedBuffer = await crypto.subtle.decrypt({ name: "AES-GCM", iv: file.iv }, key, file.encryptedData)

      // Create blob with original mime type
      const blob = new Blob([decryptedBuffer], { type: file.type })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = file.originalName
      a.style.display = "none"
      document.body.appendChild(a)
      a.click()

      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)

      setSuccessMessage(`"${file.originalName}" decrypted and downloaded successfully!`)
      setDecryptPin("")
      setShowDecryptModal(null)
    } catch (error) {
      console.error("Decryption error:", error)
      setError("Decryption failed. Wrong PIN or corrupted data.")
    } finally {
      setIsDecrypting(null)
    }
  }

  const downloadEncryptedBackup = (file: EncryptedFile) => {
    try {
      // Create a proper .pgvault format with all metadata
      const metadata = {
        version: "1.0",
        name: file.originalName,
        originalSize: file.originalSize,
        encryptedAt: file.encryptedAt.toISOString(),
        type: file.type,
        checksum: file.checksum,
        saltHex: Array.from(file.salt)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
        ivHex: Array.from(file.iv)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(""),
      }

      const metadataBytes = new TextEncoder().encode(JSON.stringify(metadata))
      const metadataLength = new Uint32Array([metadataBytes.length])

      // File format: [4 bytes metadata length][metadata JSON][encrypted data]
      const combined = new Uint8Array(4 + metadataBytes.length + file.encryptedData.byteLength)
      combined.set(new Uint8Array(metadataLength.buffer), 0)
      combined.set(metadataBytes, 4)
      combined.set(new Uint8Array(file.encryptedData), 4 + metadataBytes.length)

      const blob = new Blob([combined], { type: "application/x-pgvault" })
      const url = URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `${file.originalName}.pgvault`
      a.style.display = "none"
      document.body.appendChild(a)
      a.click()

      setTimeout(() => {
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
      }, 100)

      setSuccessMessage(`Encrypted backup "${file.originalName}.pgvault" downloaded!`)
    } catch (error) {
      console.error("Download error:", error)
      setError("Failed to download encrypted backup.")
    }
  }

  // Import .pgvault file
  const importVaultFile = async () => {
    if (!importedVaultFile) {
      setError("Please select a .pgvault file to import")
      return
    }

    setIsImporting(true)
    setError(null)

    try {
      const fileBuffer = await importedVaultFile.arrayBuffer()
      const dataView = new DataView(fileBuffer)

      // Read metadata length (first 4 bytes)
      const metadataLength = dataView.getUint32(0, true)

      // Read metadata
      const metadataBytes = new Uint8Array(fileBuffer, 4, metadataLength)
      const metadataJson = new TextDecoder().decode(metadataBytes)
      const metadata = JSON.parse(metadataJson)

      // Read encrypted data
      const encryptedData = fileBuffer.slice(4 + metadataLength)

      // Parse salt and IV from hex
      const salt = new Uint8Array(metadata.saltHex.match(/.{1,2}/g)!.map((byte: string) => Number.parseInt(byte, 16)))
      const iv = new Uint8Array(metadata.ivHex.match(/.{1,2}/g)!.map((byte: string) => Number.parseInt(byte, 16)))

      const importedFile: EncryptedFile = {
        id: `imported-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
        name: `${metadata.name}.encrypted`,
        originalName: metadata.name,
        originalSize: metadata.originalSize,
        encryptedSize: encryptedData.byteLength,
        encryptedAt: new Date(metadata.encryptedAt),
        iv,
        salt,
        encryptedData,
        status: "encrypted",
        type: metadata.type || "application/octet-stream",
        checksum: metadata.checksum || "unknown",
      }

      setFiles((prev) => [importedFile, ...prev])
      setSuccessMessage(`Successfully imported "${metadata.name}" from vault backup!`)
      setImportedVaultFile(null)
      if (importInputRef.current) importInputRef.current.value = ""
      setActiveTab("vault")
    } catch (error) {
      console.error("Import error:", error)
      setError("Failed to import vault file. The file may be corrupted or in wrong format.")
    } finally {
      setIsImporting(false)
    }
  }

  const deleteFile = (id: string) => {
    const file = files.find((f) => f.id === id)
    setFiles((prev) => prev.filter((f) => f.id !== id))
    if (file) {
      setSuccessMessage(`"${file.originalName}" removed from vault.`)
    }
  }

  const formatBytes = (bytes: number) => {
    if (bytes < 1024) return bytes + " B"
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB"
    return (bytes / (1024 * 1024)).toFixed(2) + " MB"
  }

  const copyChecksum = (checksum: string) => {
    navigator.clipboard.writeText(checksum)
    setSuccessMessage("Checksum copied to clipboard!")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30">
              <Shield className="h-6 w-6 text-purple-400" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">Secure Document Vault</h1>
              <p className="text-sm text-[#6b7b9a]">Track 4: Zero-Knowledge KYC Encryption</p>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30">
            <Lock className="h-3 w-3 mr-1" />
            AES-256-GCM
          </Badge>
          <Badge className="bg-[#00ffc8]/20 text-[#00ffc8] border-[#00ffc8]/30">
            <Fingerprint className="h-3 w-3 mr-1" />
            PBKDF2 100K
          </Badge>
        </div>
      </div>

      {/* Status Messages */}
      {error && (
        <Card className="bg-red-500/10 border-red-500/30">
          <CardContent className="p-4 flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-400 flex-shrink-0" />
            <p className="text-red-400 flex-1">{error}</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-red-400 hover:text-red-300"
              onClick={() => setError(null)}
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {successMessage && (
        <Card className="bg-[#00ffc8]/10 border-[#00ffc8]/30">
          <CardContent className="p-4 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-[#00ffc8] flex-shrink-0" />
            <p className="text-[#00ffc8] flex-1">{successMessage}</p>
            <Button
              variant="ghost"
              size="sm"
              className="text-[#00ffc8] hover:text-[#00ffc8]/80"
              onClick={() => setSuccessMessage(null)}
            >
              Dismiss
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Vault Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-500/20">
                <FileArchive className="h-5 w-5 text-purple-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{vaultStats.totalFiles}</p>
                <p className="text-xs text-[#6b7b9a]">Files in Vault</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00ffc8]/20">
                <HardDrive className="h-5 w-5 text-[#00ffc8]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">{formatBytes(vaultStats.totalSize)}</p>
                <p className="text-xs text-[#6b7b9a]">Encrypted Data</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-[#00a8ff]/20">
                <ShieldCheck className="h-5 w-5 text-[#00a8ff]" />
              </div>
              <div>
                <p className="text-2xl font-bold text-white">256-bit</p>
                <p className="text-xs text-[#6b7b9a]">Encryption</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-[#0a1628]/80 border-[#1a2744]">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-500/20">
                <Clock className="h-5 w-5 text-orange-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {vaultStats.lastActivity ? vaultStats.lastActivity.toLocaleDateString() : "N/A"}
                </p>
                <p className="text-xs text-[#6b7b9a]">Last Activity</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="bg-[#0a1628] border border-[#1a2744]">
          <TabsTrigger
            value="encrypt"
            className="data-[state=active]:bg-purple-500/20 data-[state=active]:text-purple-400"
          >
            <Lock className="h-4 w-4 mr-2" />
            Encrypt
          </TabsTrigger>
          <TabsTrigger value="vault" className="data-[state=active]:bg-[#00ffc8]/20 data-[state=active]:text-[#00ffc8]">
            <Database className="h-4 w-4 mr-2" />
            Vault ({files.length})
          </TabsTrigger>
          <TabsTrigger
            value="import"
            className="data-[state=active]:bg-[#00a8ff]/20 data-[state=active]:text-[#00a8ff]"
          >
            <Import className="h-4 w-4 mr-2" />
            Import
          </TabsTrigger>
        </TabsList>

        {/* Encrypt Tab */}
        <TabsContent value="encrypt">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Key className="h-5 w-5 text-[#00ffc8]" />
                Encrypt Document
              </CardTitle>
              <CardDescription className="text-[#6b7b9a]">
                Upload and encrypt KYC documents with your secret PIN using AES-256-GCM
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* PIN Input */}
              <div className="space-y-2">
                <Label className="text-[#a0aec0]">Secret PIN</Label>
                <div className="relative">
                  <Input
                    type={showPin ? "text" : "password"}
                    value={pin}
                    onChange={(e) => {
                      setPin(e.target.value)
                      checkPinStrength(e.target.value)
                      setIsPwned(null)
                    }}
                    onBlur={checkPwned}
                    placeholder="Enter a strong PIN (min 6 characters)"
                    className="bg-[#0d1520] border-[#1a2744] text-white pr-10"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-[#6b7b9a] hover:text-white h-7 w-7"
                    onClick={() => setShowPin(!showPin)}
                  >
                    {showPin ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </Button>
                </div>

                {pin && (
                  <div className="flex items-center gap-2">
                    <div className="flex gap-1 flex-1">
                      <div
                        className={`h-1 flex-1 rounded ${pinStrength === "weak" ? "bg-red-500" : pinStrength === "medium" ? "bg-yellow-500" : "bg-[#00ffc8]"}`}
                      />
                      <div
                        className={`h-1 flex-1 rounded ${pinStrength === "medium" ? "bg-yellow-500" : pinStrength === "strong" ? "bg-[#00ffc8]" : "bg-[#1a2744]"}`}
                      />
                      <div
                        className={`h-1 flex-1 rounded ${pinStrength === "strong" ? "bg-[#00ffc8]" : "bg-[#1a2744]"}`}
                      />
                    </div>
                    <span
                      className={`text-xs ${pinStrength === "weak" ? "text-red-400" : pinStrength === "medium" ? "text-yellow-400" : "text-[#00ffc8]"}`}
                    >
                      {pinStrength?.charAt(0).toUpperCase()}
                      {pinStrength?.slice(1)}
                    </span>
                  </div>
                )}

                {isPwnedChecking && (
                  <p className="text-xs text-[#6b7b9a] flex items-center gap-1">
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    Checking against common passwords...
                  </p>
                )}
                {isPwned === true && (
                  <p className="text-xs text-red-400 flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    This is a commonly used password. Choose a stronger one.
                  </p>
                )}
                {isPwned === false && (
                  <p className="text-xs text-[#00ffc8] flex items-center gap-1">
                    <CheckCircle2 className="h-3 w-3" />
                    PIN is not in common password lists
                  </p>
                )}
              </div>

              {/* File Upload */}
              <div className="space-y-2">
                <Label className="text-[#a0aec0]">Select Document</Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                    selectedFile
                      ? "border-[#00ffc8]/50 bg-[#00ffc8]/5"
                      : "border-[#1a2744] hover:border-[#00ffc8]/30 hover:bg-[#0d1520]"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,.xls,.xlsx"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                  />
                  {selectedFile ? (
                    <div className="flex flex-col items-center gap-2">
                      <FileText className="h-12 w-12 text-[#00ffc8]" />
                      <p className="text-white font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-[#6b7b9a]">
                        {formatBytes(selectedFile.size)} - {selectedFile.type || "Unknown type"}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-[#6b7b9a] hover:text-red-400"
                        onClick={(e) => {
                          e.stopPropagation()
                          setSelectedFile(null)
                          if (fileInputRef.current) fileInputRef.current.value = ""
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center gap-2">
                      <Upload className="h-12 w-12 text-[#6b7b9a]" />
                      <p className="text-[#6b7b9a]">Click or drag file to upload</p>
                      <p className="text-xs text-[#4a5568]">PDF, Images, Documents up to 50MB</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Encryption Progress */}
              {isEncrypting && (
                <div className="space-y-2 p-4 bg-[#0d1520] rounded-lg border border-[#1a2744]">
                  <div className="flex justify-between text-xs">
                    <span className="text-[#6b7b9a]">{encryptionStage}</span>
                    <span className="text-[#00ffc8]">{encryptionProgress}%</span>
                  </div>
                  <Progress value={encryptionProgress} className="h-2" />
                </div>
              )}

              <Button
                onClick={encryptFile}
                disabled={!selectedFile || !pin || pin.length < 6 || isEncrypting}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white"
              >
                <Lock className="h-4 w-4 mr-2" />
                {isEncrypting ? "Encrypting..." : "Encrypt & Store in Vault"}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Vault Tab */}
        <TabsContent value="vault">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Database className="h-5 w-5 text-purple-400" />
                Encrypted Vault
              </CardTitle>
              <CardDescription className="text-[#6b7b9a]">
                Your encrypted documents - only you can decrypt them with your PIN
              </CardDescription>
            </CardHeader>
            <CardContent>
              {files.length === 0 ? (
                <div className="text-center py-12">
                  <Cloud className="h-16 w-16 mx-auto text-[#1a2744] mb-4" />
                  <p className="text-[#6b7b9a]">No encrypted files yet</p>
                  <p className="text-xs text-[#4a5568] mt-1">Upload and encrypt a document to get started</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-[500px] overflow-y-auto">
                  {files.map((file) => (
                    <div
                      key={file.id}
                      className="p-4 rounded-lg bg-[#0d1520] border border-[#1a2744] hover:border-purple-500/30 transition-all"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-start gap-3 min-w-0 flex-1">
                          <div className="p-2 rounded-lg bg-purple-500/20 flex-shrink-0">
                            <Lock className="h-5 w-5 text-purple-400" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-white font-medium truncate">{file.originalName}</p>
                            <div className="flex flex-wrap items-center gap-2 mt-1 text-xs text-[#6b7b9a]">
                              <span>
                                {formatBytes(file.originalSize)} → {formatBytes(file.encryptedSize)}
                              </span>
                              <span>•</span>
                              <span>{file.encryptedAt.toLocaleString()}</span>
                            </div>
                            <div className="flex items-center gap-2 mt-2">
                              <code className="text-xs bg-[#1a2744] px-2 py-1 rounded text-[#00ffc8] font-mono">
                                SHA256: {file.checksum}
                              </code>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 text-[#6b7b9a] hover:text-[#00ffc8]"
                                onClick={() => copyChecksum(file.checksum)}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2">
                          {showDecryptModal === file.id ? (
                            <div className="flex flex-col gap-2 p-3 bg-[#1a2744] rounded-lg">
                              <Input
                                type="password"
                                value={decryptPin}
                                onChange={(e) => setDecryptPin(e.target.value)}
                                placeholder="Enter PIN"
                                className="bg-[#0d1520] border-[#2a3a5a] text-white text-sm h-8"
                              />
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  onClick={() => decryptAndDownload(file)}
                                  disabled={isDecrypting === file.id}
                                  className="bg-[#00ffc8] text-[#0a0e1a] hover:bg-[#00ffc8]/90 text-xs h-7"
                                >
                                  {isDecrypting === file.id ? (
                                    <RefreshCw className="h-3 w-3 animate-spin" />
                                  ) : (
                                    <Unlock className="h-3 w-3 mr-1" />
                                  )}
                                  Decrypt
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => {
                                    setShowDecryptModal(null)
                                    setDecryptPin("")
                                  }}
                                  className="text-[#6b7b9a] text-xs h-7"
                                >
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() => setShowDecryptModal(file.id)}
                                className="bg-[#00ffc8]/20 text-[#00ffc8] border border-[#00ffc8]/30 hover:bg-[#00ffc8]/30"
                              >
                                <Unlock className="h-4 w-4 mr-1" />
                                Decrypt
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => downloadEncryptedBackup(file)}
                                className="bg-[#00a8ff]/20 text-[#00a8ff] border border-[#00a8ff]/30 hover:bg-[#00a8ff]/30"
                              >
                                <Download className="h-4 w-4 mr-1" />
                                Backup
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => deleteFile(file.id)}
                                className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Import Tab */}
        <TabsContent value="import">
          <Card className="bg-[#0a1628]/80 border-[#1a2744]">
            <CardHeader>
              <CardTitle className="text-white flex items-center gap-2">
                <Import className="h-5 w-5 text-[#00a8ff]" />
                Import Vault Backup
              </CardTitle>
              <CardDescription className="text-[#6b7b9a]">
                Import a previously exported .pgvault encrypted backup file
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                  importedVaultFile
                    ? "border-[#00a8ff]/50 bg-[#00a8ff]/5"
                    : "border-[#1a2744] hover:border-[#00a8ff]/30"
                }`}
                onClick={() => importInputRef.current?.click()}
              >
                <input
                  ref={importInputRef}
                  type="file"
                  className="hidden"
                  accept=".pgvault"
                  onChange={(e) => setImportedVaultFile(e.target.files?.[0] || null)}
                />
                {importedVaultFile ? (
                  <div className="flex flex-col items-center gap-2">
                    <FileKey className="h-12 w-12 text-[#00a8ff]" />
                    <p className="text-white font-medium">{importedVaultFile.name}</p>
                    <p className="text-xs text-[#6b7b9a]">{formatBytes(importedVaultFile.size)}</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <FolderOpen className="h-12 w-12 text-[#6b7b9a]" />
                    <p className="text-[#6b7b9a]">Select .pgvault backup file</p>
                    <p className="text-xs text-[#4a5568]">Encrypted backup files only</p>
                  </div>
                )}
              </div>

              <Button
                onClick={importVaultFile}
                disabled={!importedVaultFile || isImporting}
                className="w-full bg-gradient-to-r from-[#00a8ff] to-[#00ffc8] hover:opacity-90 text-[#0a0e1a]"
              >
                {isImporting ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Importing...
                  </>
                ) : (
                  <>
                    <Import className="h-4 w-4 mr-2" />
                    Import to Vault
                  </>
                )}
              </Button>

              <div className="bg-[#0f1a2e] rounded-lg p-4 border border-[#1a2744]">
                <p className="text-sm text-[#6b7b9a]">
                  <strong className="text-white">Note:</strong> You will still need the original PIN to decrypt imported
                  files. The encryption key is derived from your PIN, not stored in the backup.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
