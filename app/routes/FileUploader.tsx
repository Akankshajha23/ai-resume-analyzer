import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { formatSize } from '../lib/utils'
import { UploadCloud, FileCheck, X } from 'lucide-react'

interface FileUploaderProps {
    onFileSelect?: (file: File | null) => void
}

const FileUploader = ({ onFileSelect }: FileUploaderProps) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null)
    const [isDragActive, setIsDragActive] = useState(false)

    const onDrop = useCallback((acceptedFiles: File[]) => {
        const file = acceptedFiles[0] || null
        setSelectedFile(file)
        onFileSelect?.(file)
        setIsDragActive(false)
    }, [onFileSelect])

    const maxFileSize = 20 * 1024 * 1024 // 20MB

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        multiple: false,
        accept: { 'application/pdf': ['.pdf'] },
        maxSize: maxFileSize,
        onDragEnter: () => setIsDragActive(true),
        onDragLeave: () => setIsDragActive(false),
    })

    const handleRemove = (e: React.MouseEvent) => {
        e.stopPropagation()
        setSelectedFile(null)
        onFileSelect?.(null)
    }

    return (
        <div className="w-full">
            <div
                {...getRootProps()}
                className={`
                    relative overflow-hidden
                    border-2 border-dashed rounded-2xl p-8
                    transition-all duration-300 cursor-pointer
                    ${isDragActive 
                        ? 'border-[#6b8cff] bg-[#6b8cff]/10 scale-[1.02]' 
                        : selectedFile 
                            ? 'border-[#8b5cf6] bg-[#14141f]'
                            : 'border-[#2a2a3d] bg-[#14141f] hover:border-[#6b8cff] hover:bg-[#6b8cff]/5'
                    }
                `}
                style={{
                    boxShadow: isDragActive 
                        ? 'inset 0 0 30px 0 rgba(107, 140, 255, 0.3)' 
                        : selectedFile
                            ? 'inset 0 0 20px 0 rgba(139, 92, 246, 0.2)'
                            : 'inset 0 0 12px 0 rgba(107, 140, 255, 0.15)'
                }}
            >
                {/* Animated background gradient */}
                <div className={`
                    absolute inset-0 bg-gradient-to-br from-[#6b8cff]/5 via-transparent to-[#8b5cf6]/5
                    transition-opacity duration-300
                    ${isDragActive ? 'opacity-100' : 'opacity-0'}
                `}></div>

                <input {...getInputProps()} />
                
                <div className="relative z-10">
                    {selectedFile ? (
                        <div
                            className="flex flex-col sm:flex-row items-center justify-between gap-4 animate-fadeIn"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center gap-4 flex-1">
                                <div className="relative">
                                    <div className="absolute inset-0 bg-[#6b8cff] blur-lg opacity-50"></div>
                                    <div className="relative bg-gradient-to-br from-[#6b8cff] to-[#8b5cf6] p-3 rounded-xl">
                                        <FileCheck className="w-6 h-6 text-white" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-start">
                                    <p className="text-sm font-semibold text-white truncate max-w-[250px] sm:max-w-md">
                                        {selectedFile.name}
                                    </p>
                                    <p className="text-xs text-[#a0b4ec]">{formatSize(selectedFile.size)}</p>
                                </div>
                            </div>
                            <button
                                className="group p-2 hover:bg-red-500/20 rounded-full transition-all duration-300 border border-red-500/30 hover:border-red-500"
                                onClick={handleRemove}
                            >
                                <X className="w-5 h-5 text-red-400 group-hover:text-red-300 transition-colors" />
                            </button>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center space-y-4">
                            <div className="relative">
                                {/* Glow effect */}
                                <div className={`
                                    absolute inset-0 bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] blur-2xl opacity-30
                                    transition-all duration-300
                                    ${isDragActive ? 'scale-150 opacity-50' : 'scale-100'}
                                `}></div>
                                
                                {/* Icon */}
                                <div className={`
                                    relative w-16 h-16 flex items-center justify-center
                                    bg-gradient-to-br from-[#6b8cff]/20 to-[#8b5cf6]/20
                                    rounded-2xl border-2
                                    transition-all duration-300
                                    ${isDragActive 
                                        ? 'border-[#6b8cff] scale-110' 
                                        : 'border-[#2a2a3d]'
                                    }
                                `}>
                                    <UploadCloud className={`
                                        w-8 h-8 transition-all duration-300
                                        ${isDragActive ? 'text-[#6b8cff] scale-110' : 'text-[#6b8cff]'}
                                    `} />
                                </div>
                            </div>
                            
                            <div className="text-center space-y-2">
                                <p className="text-base sm:text-lg text-white">
                                    <span className="font-bold bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6] bg-clip-text text-transparent">
                                        {isDragActive ? 'Drop your resume here' : 'Upload Resume'}
                                    </span>
                                    {!isDragActive && <span className="text-[#a0b4ec]"> or drag and drop</span>}
                                </p>
                                <p className="text-xs sm:text-sm text-[#a0b4ec]">
                                    PDF only • Max {formatSize(maxFileSize)}
                                </p>
                            </div>

                            {/* Decorative dots */}
                            <div className="flex gap-2 mt-4">
                                {[0, 1, 2].map((i) => (
                                    <div 
                                        key={i}
                                        className={`
                                            w-2 h-2 rounded-full bg-gradient-to-r from-[#6b8cff] to-[#8b5cf6]
                                            transition-all duration-300
                                            ${isDragActive ? 'animate-pulse' : 'opacity-50'}
                                        `}
                                        style={{ animationDelay: `${i * 150}ms` }}
                                    />
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-[#6b8cff]/30 rounded-tl-2xl"></div>
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-[#8b5cf6]/30 rounded-br-2xl"></div>
            </div>
        </div>
    )
}

export default FileUploader