'use client'

import { useState, useRef } from 'react'
import { Upload, X, File, Image, FileText, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface FileUploaderProps {
  projectId: string
  stage?: string
  kind?: string
  onUploadSuccess?: (filePath: string, fileName: string) => void
  className?: string
}

export function FileUploader({ 
  projectId, 
  stage = 'brief', 
  kind = 'asset',
  onUploadSuccess,
  className 
}: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [preview, setPreview] = useState<{ name: string; size: number; type: string } | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
  }

  const getFileIcon = (type: string) => {
    if (type.startsWith('image/')) return Image
    if (type.includes('pdf')) return FileText
    return File
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) {
      setPreview({ name: file.name, size: file.size, type: file.type })
      setError(null)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPreview({ name: file.name, size: file.size, type: file.type })
      setError(null)
    }
  }

  const handleClear = () => {
    setPreview(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleUpload = async () => {
    if (!fileInputRef.current?.files?.[0]) {
      setError('Selecciona un archivo primero')
      return
    }

    const file = fileInputRef.current.files[0]
    setIsUploading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('stage', stage)
      formData.append('kind', kind)

      const response = await fetch(`/api/projects/${projectId}/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setPreview(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
      
      onUploadSuccess?.(data.filePath, data.fileName)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al subir archivo')
    } finally {
      setIsUploading(false)
    }
  }

  const isImage = preview?.type.startsWith('image/')

  return (
    <div className={cn('space-y-3', className)}>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={cn(
          'relative cursor-pointer rounded-lg border-2 border-dashed p-6 transition-colors',
          isDragging 
            ? 'border-primary bg-primary/5' 
            : 'border-white/20 hover:border-white/40',
          preview && 'cursor-default',
          isUploading && 'pointer-events-none opacity-50'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileSelect}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.zip,.txt,.csv"
        />

        {preview ? (
          <div className="flex items-center gap-3">
            {isImage ? (
              <div className="flex h-12 w-12 items-center justify-center rounded bg-white/10">
                <Image className="h-6 w-6 text-primary" />
              </div>
            ) : (
              <div className="flex h-12 w-12 items-center justify-center rounded bg-white/10">
                {(() => {
                  const Icon = getFileIcon(preview.type)
                  return <Icon className="h-6 w-6 text-white/70" />
                })()}
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="truncate text-sm font-medium text-white">{preview.name}</p>
              <p className="text-xs text-white/50">{formatFileSize(preview.size)}</p>
            </div>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                handleClear()
              }}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/70 hover:bg-white/20"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2 text-center">
            <Upload className="h-8 w-8 text-white/50" />
            <div>
              <p className="text-sm text-white">
                Arrastra un archivo o haz clic para seleccionar
              </p>
              <p className="text-xs text-white/50 mt-1">
                PDF, imágenes, Word, Excel, ZIP (max 50MB)
              </p>
            </div>
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-[#ff7a7a]">{error}</p>
      )}

      {preview && (
        <Button
          onClick={handleUpload}
          disabled={isUploading}
          className="w-full"
        >
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Subiendo...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Subir archivo
            </>
          )}
        </Button>
      )}
    </div>
  )
}