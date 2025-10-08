import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'
import { UploadCloud } from 'lucide-react'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null
        setSelectedFile(file)
        onFileSelect?.(file)
    }, [onFileSelect])

    const maxFileSize = 20 * 1024 * 1024 // 20MB

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
    })

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedFile(null)
        onFileSelect?.(null)
    }

    return (
        <div className="w-full gradient-border">
            <div
                {...getRootProps()}
                className="border-2 border-dashed border-gray-400 rounded-xl p-4 sm:p-6 md:p-8 hover:border-green-500 transition-colors duration-300 max-w-full sm:max-w-lg mx-auto"
            >
                <input {...getInputProps()} />
                <div className="space-y-4 cursor-pointer">
                    {selectedFile ? (
                        <div
                            className="flex flex-col sm:flex-row items-center justify-center bg-green-300 p-3 sm:p-4 rounded-md relative gap-2 sm:gap-0"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <img src="/images/pdf.png" alt="pdf" className="w-8 h-8 sm:w-10 sm:h-10 mr-0 sm:mr-4 mb-2 sm:mb-0" />
                            <div className="flex-1 flex flex-col items-center sm:items-start">
                                <p className="text-xs sm:text-sm font-semibold text-gray-800 truncate max-w-[180px] sm:max-w-xs text-center sm:text-left">
                                    {selectedFile.name}
                                </p>
                                <p className="text-xs sm:text-sm text-gray-600">{formatSize(selectedFile.size)}</p>
                            </div>
                            <button
                                className="p-1 sm:p-2 hover:bg-red-100 rounded-full absolute right-2 sm:right-4 top-2 sm:top-auto"
                                onClick={handleRemove}
                            >
                                <img src="/icons/cross.svg" alt="remove" className="w-3 h-3 sm:w-4 sm:h-4" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-2">
                            <div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center mb-2">
                                <UploadCloud className="w-8 h-8 sm:w-10 sm:h-10 text-green-500" />
                            </div>
                            <p className="text-base sm:text-lg text-gray-900 text-center">
                                <span className="font-bold">Upload Resume</span> or drag and drop
                            </p>
                            <p className="text-xs sm:text-sm text-gray-300 text-center">
                                PDF only (max {formatSize(maxFileSize)})
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default FileUploader